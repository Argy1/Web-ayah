import React from 'react'
// Sebelumnya kita pakai './navbar' dan './footer' — itu menyebabkan Next.js
// tidak menemukan file karena keduanya ada dalam folder 'partials'
import Navbar from '../partials/navbar'
import Footer from '../partials/footer'


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Konten Utama */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}