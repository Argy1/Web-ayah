// src/pages/api/blog.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import { IncomingForm, File } from 'formidable'
import fs from 'fs/promises'
import path from 'path'

export const config = { api: { bodyParser: false } }

type Fields = Record<string, string | string[]>
type Files  = { imageFile?: File | File[] }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1) GET semua post
    if (req.method === 'GET') {
      const posts = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } })
      return res.status(200).json(posts)
    }

    // 2) Cek admin untuk operasi berikutnya
    const session = await getServerSession(req, res, authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // helper untuk ambil field pertama
    const norm = (v?: string | string[]) => Array.isArray(v) ? v[0] : v ?? ''

    // 3) CREATE / UPDATE via multipart/form-data
    if (req.method === 'POST') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })

      // parse form
      const form = new IncomingForm({ uploadDir, keepExtensions: true })
      const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((ok, fail) =>
        form.parse(req, (err, flds, fls) => err ? fail(err) : ok({ fields: flds as Fields, files: fls as Files }))
      )

      // ekstrak dan normalisasi
      const rawId    = norm(fields.id)
      const id       = rawId && !isNaN(Number(rawId)) ? Number(rawId) : undefined
      const title    = norm(fields.title).trim()
      const dateStr  = norm(fields.date)
      const date     = dateStr ? new Date(dateStr) : new Date()
      const excerpt  = norm(fields.excerpt)
      const content  = norm(fields.content)

      // slug otomatis jika kosong
      let slug = norm(fields.slug).trim()
      if (!slug) {
        slug = title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-]/g, '')
          .slice(0, 100)
      }

      // gambar: gunakan oldImage atau file upload baru
      let image = norm(fields.oldImage)
      if (files.imageFile) {
        const file = Array.isArray(files.imageFile) ? files.imageFile[0] : files.imageFile
        const fn   = path.basename(file.filepath)
        image = '/uploads/' + fn
      }

      // persiapkan data untuk Prisma
      const data = { slug, title, date, excerpt, content, image }

      let post
      if (id) {
        post = await prisma.blogPost.update({ where: { id }, data })
      } else {
        post = await prisma.blogPost.create({ data })
      }

      return res.status(200).json(post)
    }

    // 4) DELETE ?id=xx
    if (req.method === 'DELETE') {
      const idParam = req.query.id
      const id       = parseInt(Array.isArray(idParam) ? idParam[0] : idParam as string, 10)
      if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' })
      await prisma.blogPost.delete({ where: { id } })
      return res.status(200).json({ success: true })
    }

    // jika method lain
    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)

  } catch (err: any) {
    console.error('API /api/blog error:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
