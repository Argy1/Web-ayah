// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Buat admin default
  const hashed = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@site.com' },
    update: {},
    create: {
      email:    'admin@site.com',
      name:     'Admin',
      password: hashed,
      role:     'admin',
    },
  })

  // Buat record Profile awal (sesuaikan data Anda)
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      photo: '/fotoprofile.jpg',
      about: 'Saya adalah pengurus pusat dengan pengalaman lebih dari 15 tahun di organisasi...',
      education: [
        'SMA Teknik Informatika, Universitas Contoh (1993–1997)',
        'S2 Ilmu Komputer, Institut Teknologi Impian (1998–2000)',
      ],
      experience: [
        {
          title: 'Lead Developer di CV Solusi Digital',
          period: '2010–Sekarang',
          desc: 'Memimpin tim 5 orang, membangun aplikasi skala enterprise.',
        },
        {
          title: 'Software Engineer di PT Teknologi Maju',
          period: '2000–2010',
          desc: 'Mengembangkan sistem e-commerce dan portal pemerintah.',
        },
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Prisma'],
      contact: {
        location: 'Klaten, Jawa Tengah, Indonesia',
        birth: '1974-08-18',
        phone: '+62 813 8133 3213',
        email: 'adarsono@yahoo.com',
        social: {
          linkedin: 'https://linkedin.com/in/adarsono',
          github: 'https://github.com/adarsono',
          twitter: 'https://twitter.com/adarsono',
        },
      },
    },
  })

  console.log('✅ Seed selesai')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
