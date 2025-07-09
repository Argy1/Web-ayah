// src/pages/profile.tsx

import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { prisma } from '../lib/prisma'
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react'

interface ProfileProps {
  photo: string
  about: string
  education: string[]
  experience: Array<{
    title: string
    period: string
    desc: string
  }>
  skills: string[]
  contact: {
    location: string
    phone: string
    email: string
  }
  social: {
    linkedin: string
    github: string
    twitter: string
  }
  dob: string | null
  updatedAt: string
}

export default function Profile({
  photo,
  about,
  education,
  experience,
  skills,
  contact,
  social,
  dob,
  updatedAt,
}: ProfileProps) {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Foto */}
      <div className="flex justify-center">
        <Image
          src={photo}
          alt="Foto Profil"
          width={150}
          height={150}
          className="rounded-full"
        />
      </div>

      {/* Tentang Saya */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Tentang Saya</h2>
        <p>{about}</p>
      </section>

      {/* Pendidikan */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Pendidikan</h2>
        <ul className="list-disc list-inside">
          {education.map((edu, i) => (
            <li key={i}>{edu}</li>
          ))}
        </ul>
      </section>

      {/* Pengalaman */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Pengalaman</h2>
        {experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-medium">{exp.title}</h3>
            <span className="text-sm text-gray-600">{exp.period}</span>
            <p>{exp.desc}</p>
          </div>
        ))}
      </section>

      {/* Keahlian */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Keahlian</h2>
        <p>{skills.join(', ')}</p>
      </section>

      {/* Kontak & Sosial Media */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Kontak & Sosial Media</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <MapPin className="mr-2 text-indigo-500" /> {contact.location}
          </li>
          <li className="flex items-center">
            <Phone className="mr-2 text-indigo-500" /> {contact.phone}
          </li>
          <li className="flex items-center">
            <Mail className="mr-2 text-indigo-500" /> {contact.email}
          </li>
          <li className="flex items-center">
            <Linkedin className="mr-2 text-indigo-500" /> {social.linkedin}
          </li>
          <li className="flex items-center">
            <Github className="mr-2 text-indigo-500" /> {social.github}
          </li>
          <li className="flex items-center">
            <Twitter className="mr-2 text-indigo-500" /> {social.twitter}
          </li>
        </ul>
      </section>

      {/* Tanggal Lahir & Terakhir Update */}
      <section className="text-sm text-gray-600">
        {dob && (
          <div className="flex items-center mb-1">
            <CalendarIcon className="mr-2" /> Lahir: {new Date(dob).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center">
          <CalendarIcon className="mr-2" /> Terakhir diperbarui:{' '}
          {new Date(updatedAt).toLocaleString()}
        </div>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async () => {
  const data = await prisma.profile.findFirst()
  if (!data) {
    return { notFound: true }
  }

  // Parse education dan skills jadi string[]
  const education: string[] = Array.isArray(data.education)
    ? data.education.filter((e): e is string => typeof e === 'string')
    : []

  const skills: string[] = Array.isArray(data.skills)
    ? data.skills.filter((s): s is string => typeof s === 'string')
    : []

  // Parse pengalaman jadi array objek
  const rawExp = Array.isArray(data.experience) ? data.experience : []
  const experience = rawExp.map(item => ({
    title: typeof (item as any).title === 'string' ? (item as any).title : '',
    period: typeof (item as any).period === 'string' ? (item as any).period : '',
    desc: typeof (item as any).desc === 'string' ? (item as any).desc : '',
  }))

  // Guard jika contact null
  const cr = data.contact ?? {}
  const contact = {
    location: typeof cr.location === 'string' ? cr.location : '',
    phone: typeof cr.phone === 'string' ? cr.phone : '',
    email: typeof cr.email === 'string' ? cr.email : '',
  }
  const social = {
    linkedin: typeof cr.linkedin === 'string' ? cr.linkedin : '',
    github: typeof cr.github === 'string' ? cr.github : '',
    twitter: typeof cr.twitter === 'string' ? cr.twitter : '',
  }

  // Serialisasi Date
  const dob = data.dob ? data.dob.toISOString() : null
  const updatedAt = data.updatedAt.toISOString()

  return {
    props: {
      photo: data.photo,
      about: data.about,
      education,
      experience,
      skills,
      contact,
      social,
      dob,
      updatedAt,
    },
  }
}
