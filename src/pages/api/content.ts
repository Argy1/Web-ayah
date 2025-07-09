// src/pages/api/content.ts
import { getSession } from 'next-auth/react'
import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { page, title, body } = req.body
    const updated = await prisma.pageContent.upsert({
      where: { page },
      update: { title, body },
      create: { page, title, body },
    })
    return res.json(updated)
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
