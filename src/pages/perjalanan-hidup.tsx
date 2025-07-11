// src/pages/perjalanan-hidup.tsx
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { prisma } from '../lib/prisma'
import { BookOpen, Calendar as CalIcon, Award } from 'lucide-react'

export interface JourneyItem {
  id: number
  order: number
  title: string
  period: string
  description: string
  image: string
}
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
  journeyItems: JourneyItem[]
  memoryItems: MemoryItem[]
}

export default function PerjalananHidup({
  journeyItems,
  memoryItems,
}: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Perjalanan Hidup Saya</h1>

      {journeyItems.length === 0 ? (
        <p>Belum ada data perjalanan hidup.</p>
      ) : (
        journeyItems.map((item) => (
          <div key={item.id} className="mb-6">
            <h2 className="text-xl font-semibold">
              {item.title} <span className="text-sm text-gray-600">({item.period})</span>
            </h2>
            <p>{item.description}</p>
            <Image src={item.image} alt={item.title} width={400} height={250} className="mt-2 rounded" />
          </div>
        ))
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Dokumentasi Kenangan</h2>
      {memoryItems.length === 0 ? (
        <p>Belum ada kenangan tersimpan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoryItems.map((m) => (
            <div key={m.id} className="border p-4 rounded">
              <Image src={m.image} alt={m.label} width={300} height={200} className="rounded" />
              <h3 className="mt-2 font-medium">{m.label}</h3>
              <p className="text-sm text-gray-500">
                {new Date(m.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                — {m.location}
              </p>
              <p className="mt-1">{m.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const journey = await prisma.journeyItem.findMany({
      orderBy: { order: 'asc' },
    })
    const memories = await prisma.memoryItem.findMany({
      orderBy: { order: 'asc' },
    })
    return {
      props: {
        journeyItems: journey.map((j) => ({
          ...j,
          date: undefined, // tidak dipakai di journey
        })),
        memoryItems: memories.map((m) => ({
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
