import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import { IncomingForm, File } from 'formidable'
import fs from 'fs/promises'
import path from 'path'

// Nonaktifkan bodyParser Next.js
export const config = { api: { bodyParser: false } }

type Fields = Record<string, string | string[]>
type Files = { photoFile?: File | File[] }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  // Cek session & role
  const session = await getServerSession(req, res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Siapkan folder upload
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  try {
    // Parse form-data
    const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) =>
      form.parse(req, (err, flds, fls) =>
        err ? reject(err) : resolve({ fields: flds as Fields, files: fls as Files })
      )
    )

    // Helper: normalize field to string
    const norm = (val?: string | string[]): string =>
      Array.isArray(val) ? val.join('\n') : val ?? ''

    // Tentukan path foto (baru atau lama)
    let photoPath = norm(fields.oldPhoto)
    if (files.photoFile) {
      const file = Array.isArray(files.photoFile) ? files.photoFile[0] : files.photoFile
      const name = path.basename(file.filepath)
      photoPath = '/uploads/' + name
    }

    // Ambil dan split teks
    const about = norm(fields.about)
    const education = norm(fields.education).split('\n').filter(Boolean)
    const experience = norm(fields.experience)
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [title, period, desc] = line.split('|')
        return { title: title || '', period: period || '', desc: desc || '' }
      })
    const skills = norm(fields.skills)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    // Contact di‐store sebagai JSON string di form
    const rawContact = norm(fields.contact)
    let contact = {}
    try {
      contact = rawContact ? JSON.parse(rawContact) : {}
    } catch {
      console.warn('/api/profile: invalid JSON in contact field')
    }

    // Upsert ke database
    const updated = await prisma.profile.upsert({
      where: { id: 1 },
      update: { photo: photoPath, about, education, experience, skills, contact },
      create: { photo: photoPath, about, education, experience, skills, contact },
    })

    return res.status(200).json(updated)
  } catch (error) {
    console.error('❌ /api/profile error:', error)
    return res.status(500).json({ message: 'Error saving profile' })
  }
}
