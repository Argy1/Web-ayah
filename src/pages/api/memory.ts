// src/pages/api/memory.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import { IncomingForm, File } from 'formidable'
import fs from 'fs/promises'
import path from 'path'

// Matikan bodyParser default agar formidable bisa mem-parsing multipart/form-data
export const config = { api: { bodyParser: false } }

type Fields = Record<string, string | string[]>
type Files = { imageFile?: File | File[] }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ————————— GET ALL —————————
  if (req.method === 'GET') {
    try {
      const list = await prisma.memoryItem.findMany({ orderBy: { order: 'asc' } })
      return res.status(200).json(list)
    } catch (err) {
      console.error('GET /api/memory error', err)
      return res.status(500).json({ message: 'Gagal mengambil data.' })
    }
  }

  // ————————— ADMIN CHECK —————————
  const session = await getServerSession(req, res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Utility small helper
  const norm = (v?: string | string[]): string =>
    Array.isArray(v) ? v[0] : v ?? ''

  // ————————— CREATE / UPDATE —————————
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    })

    try {
      const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) =>
        form.parse(req, (err, flds, fls) =>
          err ? reject(err) : resolve({ fields: flds as Fields, files: fls as Files })
        )
      )

      // Parsing semua field
      const id          = parseInt(norm(fields.id) || '0', 10) || undefined
      const order       = parseInt(norm(fields.order), 10) || 0
      const label       = norm(fields.label)
      const date        = new Date(norm(fields.date))
      const location    = norm(fields.location)
      const isFavorite  = norm(fields.isFavorite) === 'true'
      const description = norm(fields.description)

      // Tentukan image path: kalau ada upload baru, gunakan itu; kalau tidak pakai oldImage
      let image = norm(fields.oldImage)
      if (files.imageFile) {
        const file     = Array.isArray(files.imageFile) ? files.imageFile[0] : files.imageFile
        const filename = path.basename(file.filepath)
        image          = '/uploads/' + filename
      }

      const data = { order, label, date, location, isFavorite, description, image }
      const item = id
        ? await prisma.memoryItem.update({ where: { id }, data })
        : await prisma.memoryItem.create({ data })

      return res.status(200).json(item)
    } catch (err) {
      console.error('POST /api/memory error', err)
      return res.status(500).json({ message: 'Gagal menyimpan galeri kenangan.' })
    }
  }

  // ————————— DELETE —————————
  if (req.method === 'DELETE') {
    try {
      const idParam = req.query.id
      const id      = parseInt(Array.isArray(idParam) ? idParam[0] : (idParam as string), 10)
      if (isNaN(id)) throw new Error('Invalid id')
      await prisma.memoryItem.delete({ where: { id } })
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('DELETE /api/memory error', err)
      return res.status(500).json({ message: 'Gagal menghapus galeri kenangan.' })
    }
  }

  // ————————— METHOD NOT ALLOWED —————————
  res.setHeader('Allow', ['GET','POST','DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
