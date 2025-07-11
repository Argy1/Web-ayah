// src/pages/galeri-kenangan.tsx
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { prisma } from '../lib/prisma'

export interface MemoryItem {
  id: number
  order: number
  label: string
  date: string
  location: string
  description: string
  image: string
}

interface Props {
  memoryItems: MemoryItem[]
}

export default function GaleriKenangan({ memoryItems }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Galeri Kenangan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memoryItems.map((item) => (
          <div key={item.id} className="border rounded p-4">
            <Image
              src={item.image}
              alt={item.label}
              width={300}
              height={200}
              className="rounded"
            />
            <h2 className="mt-2 text-lg font-medium">{item.label}</h2>
            <p className="text-sm text-gray-500">
              {new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              — {item.location}
            </p>
            <p className="mt-1">{item.description}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center">
        ⭐️ Ingin menambahkan kenangan lain? <a href="/contact" className="underline">Hubungi saya</a>!
      </p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const items = await prisma.memoryItem.findMany({
      orderBy: { order: 'asc' },
    })
    return {
      props: {
        memoryItems: items.map((m) => ({
          ...m,
          date: m.date.toISOString(),
        })),
      },
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}
