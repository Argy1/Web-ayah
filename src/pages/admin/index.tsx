// src/pages/admin/index.tsx
import Link from 'next/link'
import { User, BookOpen, MapPin, Camera, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const cards = [
    {
      title: 'Profil',
      description: 'Kelola informasi diri dan kontak',
      href: '/admin/edit?page=profile',
      icon: User,
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: 'Perjalanan Hidup',
      description: 'Tambah, ubah, atau hapus tahap hidup',
      href: '/admin/edit?page=perjalanan-hidup',
      icon: MapPin,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Galeri Kenangan',
      description: 'Kelola foto & kenangan favorit',
      href: '/admin/edit?page=galeri-kenangan',
      icon: Camera,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Blog',
      description: 'Tulis, sunting, atau hapus artikel',
      href: '/admin/edit?page=blog',
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-600',
    },
  ]

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          ⚙️ Dashboard Admin
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Selamat datang, <span className="font-medium">admin@site.com</span>.  
          Pilih salah satu untuk mulai mengelola situs.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {cards.map(({ title, description, href, icon: Icon, color }) => (
            <Link key={title} href={href} legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 
                  rounded-xl shadow hover:shadow-lg transition-shadow
                `}
              >
                <div
                  className={`
                    flex-none p-3 rounded-lg ${color}
                  `}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                </div>
              </motion.a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
