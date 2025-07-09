// src/pages/profile.tsx
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import {
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  Phone,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Twitter as TwitterIcon,
} from 'lucide-react'
import { prisma } from '../lib/prisma'

type ProfileData = {
  photo: string
  about: string
  education: string[]
  experience: { title: string; period: string; desc: string }[]
  skills: string[]
  dob: string | null
  contact: { location: string; phone: string; email: string }
  social: { linkedin: string; github: string; twitter: string }
}

type ProfileProps = {
  profile: ProfileData
}

export default function Profile({ profile }: ProfileProps) {
  const contact = profile.contact ?? { location: '', phone: '', email: '' }
  const social  = profile.social  ?? { linkedin: '', github: '', twitter: '' }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="px-8 py-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            👋 Halo, Saya Ayah!
          </h2>
          <p className="mt-2 text-indigo-600 italic">
            “Membawa Teknologi untuk Kemajuan Bersama”
          </p>
        </div>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="flex flex-col items-center lg:items-start space-y-6">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                <Image
                  src={profile.photo}
                  alt="Foto Profil"
                  fill
                  className="object-cover"
                />
              </div>

              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <MapPin className="text-indigo-500" />
                  {contact.location}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarIcon className="text-indigo-500" />
                  {profile.dob
                    ? new Date(profile.dob).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '–'}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="text-indigo-500" />
                  {contact.phone}
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="text-indigo-500" />
                  {contact.email}
                </li>
              </ul>

              <div className="flex space-x-4">
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <LinkedinIcon size={28} />
                  </a>
                )}
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-800 hover:text-black transition"
                  >
                    <GithubIcon size={28} />
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition"
                  >
                    <TwitterIcon size={28} />
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2 space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
              {/* ABOUT */}
              <div className="pt-4">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  👨‍💻 Tentang Saya
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.about}
                </p>
              </div>

              {/* EDUCATION */}
              <div className="pt-6">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  🎓 Pendidikan
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  {profile.education.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              </div>

              {/* EXPERIENCE */}
              <div className="pt-6">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  💼 Pengalaman Kerja
                </h3>
                <ul className="space-y-4">
                  {profile.experience.map((exp, i) => (
                    <li
                      key={i}
                      className="border-l-4 border-indigo-500 pl-4 text-gray-600 dark:text-gray-400"
                    >
                      <span className="font-medium">{exp.title}</span>{' '}
                      <span className="italic">({exp.period})</span>
                      <p className="mt-1">{exp.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SKILLS */}
              <div className="pt-6">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  🛠️ Keahlian
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-600 hover:text-white transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// getServerSideProps: pastikan dob boleh null
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.profile.findFirst()
  if (!data) return { notFound: true }

  const contact = data.contact ?? { location: '', phone: '', email: '' }
  const social  = data.social  ?? { linkedin: '', github: '', twitter: '' }
  const dob     = data.dob ? data.dob.toISOString() : null

  return {
    props: {
      profile: {
        photo:      data.photo,
        about:      data.about,
        education:  data.education ?? [],
        experience: data.experience ?? [],
        skills:     data.skills ?? [],
        dob,
        contact,
        social,
      },
    },
  }
}
