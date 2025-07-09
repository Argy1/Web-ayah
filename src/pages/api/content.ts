// src/pages/api/content.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Cek autentikasi + role admin
  const session = await getSession({ req })
  if (!session || (session.user as any).role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // 2) Hanya terima POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`)
  }

  // 3) Ambil payload dan validasi minimal
  const { page, title, body } = req.body as {
    page: string
    title: string
    body: string
  }
  if (!page || !title || !body) {
    return res
      .status(400)
      .json({ error: 'Missing page, title or body' })
  }

  try {
    // 4) Upsert konten halaman
    const content = await prisma.pageContent.upsert({
      where: { page },
      create: { page, title, body },
      update: { title, body },
    })
    return res.status(200).json(content)
  } catch (error) {
    console.error('Failed to save page content:', error)
    return res
      .status(500)
      .json({ error: 'Failed to save page content' })
  }
}
