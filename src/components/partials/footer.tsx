// src/components/footer.tsx
import Link from 'next/link'
import { Phone, Mail, Linkedin } from 'lucide-react'

export default function Footer() {
  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Profil', href: '/profile' },
    { label: 'Perjalanan Hidup', href: '/perjalanan-hidup' },
    { label: 'Pelajaran Hidup', href: '/pelajaran-hidup' },
    { label: 'Galeri & Kenangan', href: '/galeri-kenangan' },
    { label: 'Blog', href: '/blog' },
    { label: 'Motivasi & Inspirasi', href: '/motivasi-inspirasi' },
    { label: 'Kontak', href: '/contact' },
  ]

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
        {/* Info & Social */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Website Pribadi Ayah</h3>
          {/* GANTI <p> MENJADI <div> */}
          <div className="mb-4">
            Software Engineer berpengalaman di bidang web dan mobile.  
            Senang berbagi ilmu, inspirasi, dan cerita di situs ini.
          </div>
          <div className="flex space-x-4">
            <a href="tel:+6281234567890" aria-label="Telepon">
              <Phone size={24} className="hover:text-indigo-500 transition" />
            </a>
            <a href="mailto:email@ayahdomain.com" aria-label="Email">
              <Mail size={24} className="hover:text-indigo-500 transition" />
            </a>
            <a
              href="https://linkedin.com/in/ayah"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} className="hover:text-indigo-500 transition" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Navigasi</h3>
          <ul className="space-y-2">
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-indigo-500 transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-8 text-center text-sm">
        © {new Date().getFullYear()} Website Pribadi Ayah. All rights reserved.
      </div>
    </footer>
  )
}
