// src/pages/profile.tsx
import { GetServerSideProps } from 'next'
import Image from 'next/image'
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

      {/* Terakhir Update */}
      <section className="text-sm text-gray-600 flex items-center">
        <CalendarIcon className="mr-2" /> Terakhir diperbarui:{' '}
        {new Date(updatedAt).toLocaleString()}
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async () => {
  const { prisma } = await import('../lib/prisma')
  const data = await prisma.profile.findFirst()
  if (!data) {
    return { notFound: true }
  }

  // parsing education
  const education: string[] = Array.isArray(data.education)
    ? data.education.filter((e): e is string => typeof e === 'string')
    : []

  // parsing experience
  const rawExp = Array.isArray(data.experience) ? data.experience : []
  const experience = rawExp.map((item) => ({
    title: typeof (item as any).title === 'string' ? (item as any).title : '',
    period:
      typeof (item as any).period === 'string' ? (item as any).period : '',
    desc: typeof (item as any).desc === 'string' ? (item as any).desc : '',
  }))

  // parsing skills
  const skills: string[] = Array.isArray(data.skills)
    ? data.skills.filter((s): s is string => typeof s === 'string')
    : []

  // guard untuk contact JSON dan dukung social nested
  const rawContact = data.contact
  const contactObj =
    typeof rawContact === 'object' &&
    rawContact !== null &&
    !Array.isArray(rawContact)
      ? (rawContact as Record<string, any>)
      : {}
  const socialData =
    typeof contactObj.social === 'object' && contactObj.social !== null
      ? (contactObj.social as Record<string, any>)
      : {}
  const contact = {
    location:
      typeof contactObj.location === 'string' ? contactObj.location : '',
    phone: typeof contactObj.phone === 'string' ? contactObj.phone : '',
    email: typeof contactObj.email === 'string' ? contactObj.email : '',
  }
  const social = {
    linkedin:
      typeof contactObj.linkedin === 'string'
        ? contactObj.linkedin
        : typeof socialData.linkedin === 'string'
        ? socialData.linkedin
        : '',
    github:
      typeof contactObj.github === 'string'
        ? contactObj.github
        : typeof socialData.github === 'string'
        ? socialData.github
        : '',
    twitter:
      typeof contactObj.twitter === 'string'
        ? contactObj.twitter
        : typeof socialData.twitter === 'string'
        ? socialData.twitter
        : '',
  }

  // updatedAt
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
      updatedAt,
    },
  }
}
