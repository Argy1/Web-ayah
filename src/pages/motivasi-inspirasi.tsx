// src/pages/motivasi-inspirasi.tsx
import React from 'react'
import {
  MessageSquare,
  Heart,
  CloudLightning,
  BookOpen,
  Users,
} from 'lucide-react'

const favoriteQuotes = [
  {
    text: '🔑 Kunci kesuksesan adalah memulai. – Mark Twain',
    author: 'Mark Twain',
  },
  {
    text: '🌱 Setiap hari adalah kesempatan baru untuk tumbuh. – Anonim',
    author: 'Anonim',
  },
  {
    text: '🚀 Jangan takut melangkah perlahan, yang penting jangan berhenti. – Konfusius',
    author: 'Konfusius',
  },
  {
    text: '✨ Jadilah perubahan yang ingin kau lihat di dunia. – Mahatma Gandhi',
    author: 'Mahatma Gandhi',
  },
]

const stories = [
  {
    icon: CloudLightning,
    title: '⚡ Bangkit dari Kegagalan',
    content:
      'Saat startup pertama saya gagal, saya hampir menyerah. Namun saya mempelajari kesalahan, bangun kembali dengan strategi baru, dan akhirnya berhasil merilis produk yang lebih baik.',
  },
  {
    icon: BookOpen,
    title: '📖 Menemukan Semangat Baru',
    content:
      'Di tengah kelelahan kerja, saya memutuskan rehat dan membaca buku motivasi. Hanya dengan satu bab, semangat saya kembali menyala dan produktivitas melonjak.',
  },
  {
    icon: Users,
    title: '🤝 Kekuatan Kolaborasi',
    content:
      'Dalam sebuah proyek besar, tim kami hampir runtuh. Dengan komunikasi terbuka dan saling mendukung, kami berhasil menyelesaikannya tepat waktu dan meraih penghargaan internal.',
  },
]

export default function MotivasiInspirasi() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-6 lg:px-0">
        {/* Judul */}
        <h2 className="text-4xl font-extrabold text-center mb-12">
          🌟 Motivasi & Inspirasi
        </h2>

        {/* Kumpulan Kutipan */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
            <MessageSquare size={24} className="text-indigo-600" />
            Kutipan Favorit
          </h3>
          <ul className="space-y-4 max-w-3xl mx-auto">
            {favoriteQuotes.map((q, i) => (
              <li
                key={i}
                className="border-l-4 border-indigo-500 pl-4 italic text-gray-700"
              >
                {q.text}
                <div className="mt-1 text-right font-medium">— {q.author}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Cerita & Pengalaman */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
            <Heart size={24} className="text-red-500" />
            Cerita yang Mendorong
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((s, i) => {
              const Icon = s.icon
              return (
                <div
                  key={i}
                  className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <Icon size={28} className="text-indigo-600 mr-3" />
                    <h4 className="text-xl font-semibold">{s.title}</h4>
                  </div>
                  <p className="text-gray-700 flex-grow">{s.content}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            ⭐️ Punya cerita inspiratif? Bagikan di halaman kontak!
          </p>
          <a
            href="/contact"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
          >
            Kirim Cerita Anda
          </a>
        </div>
      </div>
    </section>
  )
}
