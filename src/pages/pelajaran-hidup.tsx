// src/pages/pelajaran-hidup.tsx
import {
  Lightbulb,
  Heart,
  Users,
  Globe,
  BookOpen,
} from 'lucide-react'

const personalLessons = [
  {
    icon: Lightbulb,
    title: '💡 Inovasi Tanpa Henti',
    description:
      'Selalu cari cara baru untuk memperbaiki proses dan hasil kerja, bahkan untuk hal-hal kecil.',
  },
  {
    icon: Heart,
    title: '❤️ Empati & Kepedulian',
    description:
      'Pahami perasaan orang lain, karena kehangatan hati memudahkan kerjasama dan membangun kepercayaan.',
  },
  {
    icon: Users,
    title: '🤝 Kekuatan Tim',
    description:
      'Keberhasilan terbaik dicapai bersama—saling mendukung, belajar, dan tumbuh sebagai satu kesatuan.',
  },
  {
    icon: Globe,
    title: '🌐 Wawasan Global',
    description:
      'Jangan terjebak di zona nyaman; buka mata pada peluang dan budaya dari seluruh dunia.',
  },
]

const famousQuotes = [
  {
    text: 'Gagal itu biasa, bangkit kembali itu luar biasa.',
    author: 'Anonim',
  },
  {
    text: 'Hidup bukan tentang menemukan dirimu, tapi menciptakan dirimu.',
    author: 'George Bernard Shaw',
  },
  {
    text: 'Perjalanan seribu mil dimulai dengan satu langkah kecil.',
    author: 'Lao Tzu',
  },
  {
    text: 'Kesuksesan adalah kemampuan untuk berpindah dari satu kegagalan ke kegagalan lain tanpa kehilangan antusiasme.',
    author: 'Winston Churchill',
  },
]

export default function PelajaranHidup() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 lg:px-0">
        <h2 className="text-4xl font-extrabold text-center mb-8">
          📚 Pelajaran Hidup
        </h2>

        {/* Personal Lessons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {personalLessons.map((lesson, idx) => {
            const Icon = lesson.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-start p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <Icon size={32} className="text-indigo-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">{lesson.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Famous Quotes */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-6">
            💭 Kutipan Inspiratif
          </h3>
          <div className="space-y-6">
            {famousQuotes.map((q, i) => (
              <blockquote
                key={i}
                className="border-l-4 border-indigo-500 pl-4 italic text-gray-700"
              >
                “{q.text}”
                <footer className="mt-2 text-right font-semibold">
                  — {q.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
