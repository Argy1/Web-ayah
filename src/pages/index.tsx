// src/pages/index.tsx
import React from 'react'
import Link from 'next/link'
import {
  User,
  BookOpen,
  Briefcase,
  Camera,
  MessageCircle,
  Heart,
  Mail,
} from 'lucide-react'

const cards = [
  { href: '/profile', label: 'Profil', icon: User },
  { href: '/perjalanan-hidup', label: 'Perjalanan Hidup', icon: BookOpen },
  { href: '/pelajaran-hidup', label: 'Pelajaran Hidup', icon: Briefcase },
  { href: '/galeri-kenangan', label: 'Galeri & Kenangan', icon: Camera },
  { href: '/blog', label: 'Blog', icon: MessageCircle },
  { href: '/motivasi-inspirasi', label: 'Motivasi', icon: Heart },
  { href: '/contact', label: 'Kontak', icon: Mail },
]

export default function Home() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 dark:from-gray-800 dark:to-black text-white py-20 overflow-hidden">
      {/* Decorative floating circle */}
      <div className="absolute -left-32 -top-32 w-64 h-64 bg-white/20 dark:bg-gray-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="container mx-auto px-6 text-center relative space-y-8">
        <h1 className="text-6xl font-extrabold drop-shadow-lg">
          👋 Selamat Datang di Situs Saya!
        </h1>
        <p className="text-xl max-w-3xl mx-auto drop-shadow-md">
          Saya Aris, <strong>Pengurus Pusat PDPI</strong> dan penulis. Di sini Anda dapat menjelajahi profil, perjalanan hidup, pelajaran berharga, galeri kenangan, blog, motivasi, dan cara menghubungi saya.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {cards.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <div className="p-6 bg-white/30 dark:bg-white/30 backdrop-blur-md rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition flex flex-col items-center">
                <Icon size={48} className="mb-4 text-white group-hover:text-indigo-200" />
                <span className="font-semibold text-lg text-white dark:text-white">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}   