// src/pages/api/journey.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import { IncomingForm, File } from 'formidable'
import fs from 'fs/promises'
import path from 'path'

// Nonaktifkan bodyParser untuk form‐data
export const config = { api: { bodyParser: false } }

type Fields = Record<string, string | string[]>
type Files = { imageFile?: File | File[] }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET all journey items
  if (req.method === 'GET') {
    const list = await prisma.journeyItem.findMany({ orderBy: { order: 'asc' } })
    return res.status(200).json(list)
  }

  // Auth check
  const session = await getServerSession(req, res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // POST = create or update
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

      // Helper normalize
      const norm = (val?: string | string[]): string =>
        Array.isArray(val) ? val.join('\n') : val ?? ''

      // Parsing fields
      const id = parseInt(norm(fields.id) || '0', 10) || undefined
      const order = parseInt(norm(fields.order), 10) || 0
      const title = norm(fields.title)
      const period = norm(fields.period)
      const description = norm(fields.description)

      // Determine image path
      let imagePath = norm(fields.oldImage)
      if (files.imageFile) {
        const file = Array.isArray(files.imageFile) ? files.imageFile[0] : files.imageFile
        const name = path.basename(file.filepath)
        imagePath = '/uploads/' + name
      }

      const data = { order, title, period, description, image: imagePath }
      const item = id
        ? await prisma.journeyItem.update({ where: { id }, data })
        : await prisma.journeyItem.create({ data })

      return res.status(200).json(item)
    } catch (error) {
      console.error('❌ /api/journey error:', error)
      return res.status(500).json({ message: 'Error saving journey' })
    }
  }

  // DELETE by id from query string
  if (req.method === 'DELETE') {
    try {
      const idParam = req.query.id
      const id = typeof idParam === 'string'
        ? parseInt(idParam, 10)
        : parseInt(Array.isArray(idParam) ? idParam[0] : '', 10)

      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' })
      }

      await prisma.journeyItem.delete({ where: { id } })
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('❌ /api/journey delete error:', error)
      return res.status(500).json({ message: 'Error deleting journey' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
