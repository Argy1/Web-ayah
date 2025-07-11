// src/pages/profile.tsx
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { prisma } from '../lib/prisma'

interface ProfileProps {
  photo: string
  about: string
  education: string[]
  experience: Array<{ title: string; period: string; desc: string }>
  skills: string[]
  contact: { location: string; phone: string; email: string }
  social: { linkedin: string; github: string; twitter: string }
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
    <div>
      {/* Foto */}
      <Image
        src={photo}
        alt="Foto Profil"
        width={200}
        height={200}
        className="rounded-full mx-auto"
      />

      {/* Tentang Saya */}
      <h2 className="mt-6 text-xl font-semibold">Tentang Saya</h2>
      <p>{about}</p>

      {/* Pendidikan */}
      <h2 className="mt-6 text-xl font-semibold">Pendidikan</h2>
      <ul className="list-disc pl-5">
        {education.map((edu, i) => (
          <li key={i}>{edu}</li>
        ))}
      </ul>

      {/* Pengalaman */}
      <h2 className="mt-6 text-xl font-semibold">Pengalaman</h2>
      {experience.map((exp, i) => (
        <div key={i} className="mb-4">
          <h3 className="text-lg font-medium">{exp.title}</h3>
          <p className="text-sm text-gray-600">{exp.period}</p>
          <p>{exp.desc}</p>
        </div>
      ))}

      {/* Keahlian */}
      <h2 className="mt-6 text-xl font-semibold">Keahlian</h2>
      <p>{skills.join(', ')}</p>

      {/* Kontak & Sosial Media */}
      <h2 className="mt-6 text-xl font-semibold">Kontak & Sosial Media</h2>
      <ul className="list-none">
        <li>📍 {contact.location}</li>
        <li>📞 {contact.phone}</li>
        <li>✉️ {contact.email}</li>
        <li>🔗 <a href={social.linkedin} target="_blank">LinkedIn</a></li>
        <li>🐙 <a href={social.github} target="_blank">GitHub</a></li>
        <li>🐦 <a href={social.twitter} target="_blank">Twitter</a></li>
      </ul>

      <p className="mt-6 text-sm text-gray-500">
        Terakhir diperbarui: {new Date(updatedAt).toLocaleString()}
      </p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await prisma.profile.findFirst()
    if (!data) return { notFound: true }

    // parsing JSON fields
    const education = Array.isArray(data.education) ? data.education : []
    const experience = Array.isArray(data.experience)
      ? data.experience.map((item: any) => ({
          title: item.title ?? '',
          period: item.period ?? '',
          desc: item.desc ?? '',
        }))
      : []
    const skills = Array.isArray(data.skills) ? data.skills : []
    const contactObj = typeof data.contact === 'object' ? data.contact : {}
    const contact = {
      location: contactObj.location ?? '',
      phone: contactObj.phone ?? '',
      email: contactObj.email ?? '',
    }
    const social = {
      linkedin: (contactObj as any).linkedin ?? '',
      github: (contactObj as any).github ?? '',
      twitter: (contactObj as any).twitter ?? '',
    }

    return {
      props: {
        photo: data.photo,
        about: data.about,
        education,
        experience,
        skills,
        contact,
        social,
        updatedAt: data.updatedAt.toISOString(),
      },
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}
