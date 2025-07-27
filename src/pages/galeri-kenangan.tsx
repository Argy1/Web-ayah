// src/pages/galeri-kenangan.tsx
import { GetServerSideProps } from 'next'
import React from 'react'
import Image from 'next/image'
import { MemoryItem } from '../types/admin'
import { Calendar as CalIcon, MapPin, Heart, Camera } from 'lucide-react'

interface Props {
  memoryItems: MemoryItem[]
}

export default function GaleriKenangan({ memoryItems }: Props) {
  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6 space-y-8">
        <h1 className="text-4xl font-bold text-center dark:text-white">
          Galeri Kenangan
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {memoryItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden"
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-2 right-2 bg-indigo-600 text-white p-2 rounded-full">
                  <Camera size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">{item.label}</h2>
                <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-4">
                  <CalIcon />
                  <span>
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <MapPin />
                  <span>{item.location}</span>
                  <Heart
                    className={item.isFavorite ? 'text-red-500' : 'text-gray-400'}
                  />
                  <span>Favorit</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Ajakan Interaksi */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-4">
          ⭐️ Ingin menambahkan kenangan lain? Kirim foto dan cerita Anda!
        </p>
        <a
          href="/contact"
          className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
        >
          Hubungi Saya
        </a>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { prisma } = await import('../lib/prisma')
  const memoryItems = await prisma.memoryItem.findMany({
    orderBy: { order: 'asc' },
  })
  return {
    props: {
      memoryItems: JSON.parse(JSON.stringify(memoryItems)),
    },
  }
}
