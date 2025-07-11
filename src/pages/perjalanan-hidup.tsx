// src/pages/perjalanan-hidup.tsx
import React from 'react'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'
import { BookOpen, Calendar as CalIcon, Award } from 'lucide-react'

// Buat PrismaClient secara langsung
const prisma = new PrismaClient()

// Tipe data untuk Journey dan Memory
export type JourneyItem = {
  id: number
  order: number
  title: string
  period: string
  description: string
  image: string
}

export type MemoryItem = {
  id: number
  order: number
  label: string
  image: string
}

interface Props {
  journeyItems: JourneyItem[]
  memoryItems: MemoryItem[]
}

export default function PerjalananHidup({ journeyItems, memoryItems }: Props) {
  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6 space-y-16">
        <h1 className="text-4xl font-bold text-center dark:text-white">
          <BookOpen className="inline mb-1" /> Perjalanan Hidup Saya
        </h1>

        {journeyItems.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Belum ada data perjalanan hidup.
          </p>
        ) : (
          journeyItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col lg:flex-row items-center lg:items-start gap-8"
            >
              <div className="relative flex-shrink-0 w-full lg:w-1/3 h-48 rounded-lg shadow overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full lg:w-2/3">
                <h2 className="text-2xl font-bold mb-2 dark:text-indigo-300">
                  <CalIcon className="inline mr-1" /> {item.title} ({item.period})
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold dark:text-white">
          </h2>
          {/* Anda bisa menampilkan satu item journey dengan title "Penghargaan" */}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
            📸 Dokumentasi Kenangan
          </h2>

          {memoryItems.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {memoryItems.map((m) => (
                <div
                  key={m.id}
                  className="relative h-64 rounded-lg overflow-hidden shadow bg-gray-100 dark:bg-gray-700"
                >
                  <Image
                    src={m.image}
                    alt={m.label}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // Ambil semua record; karena kita instantiate PrismaClient di atas,
  // journeyItem dan memoryItem pasti terdefinisi jika modelnya ada di schema.
  const journeyItems = await prisma.journeyItem.findMany({
    orderBy: { order: 'asc' },
  })
  const memoryItems = await prisma.memoryItem.findMany({
    orderBy: { order: 'asc' },
  })

  // Tutup koneksi jika perlu (opsional)
  await prisma.$disconnect()

  // Pastikan data serializable
  return {
    props: {
      journeyItems: JSON.parse(JSON.stringify(journeyItems)),
      memoryItems: JSON.parse(JSON.stringify(memoryItems)),
    },
  }
}
