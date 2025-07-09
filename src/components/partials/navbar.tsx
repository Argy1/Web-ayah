'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

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

export default function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  // Tutup menu mobile kalau route berubah
  useEffect(() => {
    setMenuOpen(false)
  }, [router.pathname])

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition"
        >
          Website Pribadi Ayah
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav items */}
        <ul
          className={`
            flex-col md:flex md:flex-row md:items-center
            absolute md:static top-full left-0 w-full md:w-auto
            bg-white md:bg-transparent
            md:space-x-6 space-y-4 md:space-y-0
            p-4 md:p-0
            shadow-md md:shadow-none
            ${menuOpen ? 'flex' : 'hidden'}
          `}
        >
          {navItems.map(({ label, href }) => {
            const isActive = router.pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    block font-medium
                    ${isActive
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-500'}
                    transition
                  `}
                >
                  {label}
                </Link>
              </li>
            )
          })}

          {/* Hanya tampil di mobile */}
          <li className="md:hidden">
            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full text-left block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </li>
        </ul>

        {/* Auth button desktop */}
        <div className="hidden md:flex md:items-center">
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
