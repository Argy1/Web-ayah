// src/pages/contact.tsx
import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react'

export default function Contact() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6 lg:px-0">
        {/* Judul Halaman */}
        <h2 className="text-4xl font-extrabold text-center mb-12">
          📬 Kontak Saya
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sisi Kiri: Info & Peta */}
          <div className="lg:w-1/2 space-y-8">
            {/* Info Dasar */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone size={24} className="text-indigo-600" />
                <div>
                  <h4 className="font-semibold">Telepon</h4>
                  <p className="text-gray-700">+62 812 3456 7890</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={24} className="text-indigo-600" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-700">email@ayahdomain.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={24} className="text-indigo-600" />
                <div>
                  <h4 className="font-semibold">Alamat</h4>
                  <p className="text-gray-700">
                    Jl. Contoh No.123, Jakarta, Indonesia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={24} className="text-indigo-600" />
                <div>
                  <h4 className="font-semibold">Website</h4>
                  <p className="text-gray-700">www.ayahdomain.com</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-semibold mb-4">🔗 Ikuti Saya</h4>
              <div className="flex items-center space-x-6">
                <a href="https://linkedin.com/in/ayah" target="_blank" rel="noreferrer">
                  <Linkedin size={28} className="text-indigo-600 hover:text-indigo-800 transition" />
                </a>
                <a href="https://github.com/ayah" target="_blank" rel="noreferrer">
                  <Github size={28} className="text-gray-800 hover:text-black transition" />
                </a>
                <a href="https://twitter.com/ayah" target="_blank" rel="noreferrer">
                  <Twitter size={28} className="text-blue-400 hover:text-blue-600 transition" />
                </a>
              </div>
            </div>

            {/* Google Maps */}
            <div>
              <h4 className="text-xl font-semibold mb-4">📍 Lokasi Saya</h4>
              <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d106.82715331531531!3d-6.175110362258151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e0f0f0f0f0%3A0xabcdef1234567890!2sJl.%20Contoh%20No.123%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1610000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Form Kontak */}
          <div className="lg:w-1/2">
            <h4 className="text-xl font-semibold mb-4">📝 Kirim Pesan</h4>
            <form action="#" className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Nama Anda"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="email@domain.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Subjek
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Judul pesan"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Pesan
                </label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Tulis pesan Anda di sini..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                📩 Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
