// src/components/AdminEditClient.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'          // ← Tambahkan ini
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  PostItem,
  EditPageProps,
} from '../types/admin'
import {
  UserCircle2,
  Calendar as CalendarIcon,
} from 'lucide-react'

export default function AdminEditClient({
  page,
  initialProfile,
  initialContent,
  initialJourney,
  initialMemory,
  initialPosts,
}: EditPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // ─── Safe fallbacks so nothing stays undefined ──────────────────────────
  const prof: ProfileData = initialProfile ?? {
    id: 0,
    photo: '',
    about: '',
    education: [],
    experience: [],
    skills: [],
    dob: null,
    contact: { location: '', phone: '', email: '' },
    social: { linkedin: '', github: '', twitter: '' },
    updatedAt: new Date().toISOString(),
  }

  const content: PageContentData = initialContent ?? {
    page,
    title: '',
    body: '',
    updatedAt: new Date().toISOString(),
  }

  const journeyList: JourneyItem[] = initialJourney ?? []
  const memoryList:  MemoryItem[]  = initialMemory  ?? []
  const postsList:   PostItem[]    = initialPosts   ?? []

  // ─── Redirect non-admins ───────────────────────────────────────────────
  useEffect(() => {
    if (status === 'authenticated' && (!session || (session.user as any).role !== 'admin')) {
      router.replace('/login')
    }
  }, [status, session, router])

  if (status === 'loading') return <p>Loading…</p>
  if (!session || (session.user as any).role !== 'admin') return null

  // ─── PROFILE Hooks ─────────────────────────────────────────────────────
  const [photoFile,    setPhotoFile]    = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState(prof.photo)
  const [about,        setAbout]        = useState(prof.about)
  const [education,    setEducation]    = useState(prof.education.join('\n'))
  const [experience,   setExperience]   = useState(
    prof.experience.map(e => `${e.title}|${e.period}|${e.desc}`).join('\n')
  )
  const [skills,       setSkills]       = useState(prof.skills.join(','))
  const [contact,      setContact]      = useState(JSON.stringify(prof.contact, null, 2))
  const [social,       setSocial]       = useState(JSON.stringify(prof.social, null, 2))
  const [dob,          setDob]          = useState(prof.dob ?? '')

  // ─── PAGE CONTENT Hooks ────────────────────────────────────────────────
  const [contentTitle, setContentTitle] = useState(content.title)
  const [contentBody,  setContentBody]  = useState(content.body)

  // ─── JOURNEY Hooks ─────────────────────────────────────────────────────
  const [journeyItems,    setJourneyItems]    = useState<JourneyItem[]>(journeyList)
  const [journeyFiles,    setJourneyFiles]    = useState<(File | null)[]>(journeyList.map(() => null))
  const [journeyPreviews, setJourneyPreviews] = useState<string[]>(journeyList.map(it => it.image))

  // ─── MEMORY Hooks ──────────────────────────────────────────────────────
  const [memoryItems,    setMemoryItems]    = useState<MemoryItem[]>(memoryList)
  const [memoryFiles,    setMemoryFiles]    = useState<(File | null)[]>(memoryList.map(() => null))
  const [memoryPreviews, setMemoryPreviews] = useState<string[]>(memoryList.map(m => m.image))

  // ─── HANDLERS ───────────────────────────────────────────────────────────

  // Profile
  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setPhotoFile(f)
    if (f) setPhotoPreview(URL.createObjectURL(f))
  }
  const saveProfile = async () => {
    const form = new FormData()
    if (photoFile) form.append('photoFile', photoFile)
    else form.append('oldPhoto', photoPreview)
    form.append('about', about)
    form.append('education', education)
    form.append('experience', experience)
    form.append('skills', skills)
    form.append('contact', contact)
    form.append('social', social)
    form.append('dob', dob)

    await axios.post('/api/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    alert('Profil berhasil disimpan!')
    router.reload()
  }

  // Page content
  const saveContent = async () => {
    await axios.post('/api/content', {
      page: content.page,
      title: contentTitle,
      body: contentBody,
    })
    alert('Konten berhasil disimpan!')
    router.reload()
  }

  // Journey
  const addJourney = () => {
    setJourneyItems([
      ...journeyItems,
      { id: 0, order: journeyItems.length + 1, title: '', period: '', description: '', image: '' },
    ])
    setJourneyFiles([...journeyFiles, null])
    setJourneyPreviews([...journeyPreviews, ''])
  }
  const updateJourney = (idx: number, field: keyof JourneyItem, value: any) => {
    const arr = [...journeyItems]
    // @ts-ignore
    arr[idx][field] = value
    setJourneyItems(arr)
  }
  const onJourneyFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    const newFiles    = [...journeyFiles]
    newFiles[idx]     = f
    setJourneyFiles(newFiles)
    if (f) {
      const newPrev   = [...journeyPreviews]
      newPrev[idx]    = URL.createObjectURL(f)
      setJourneyPreviews(newPrev)
    }
  }
  const saveJourneyItem = async (item: JourneyItem, idx: number) => {
    const form = new FormData()
    form.append('id',          item.id.toString())
    form.append('order',       item.order.toString())
    form.append('title',       item.title)
    form.append('period',      item.period)
    form.append('description', item.description)
    if (journeyFiles[idx]) form.append('imageFile', journeyFiles[idx]!)
    else form.append('oldImage', journeyPreviews[idx])

    await axios.post('/api/journey', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    alert('Tahap perjalanan disimpan!')
    router.reload()
  }
  const deleteJourneyItem = async (id: number) => {
    if (!confirm('Hapus tahap ini?')) return
    try {
      await axios.delete(`/api/journey?id=${id}`)
      alert('Tahap dihapus!')
      router.reload()
    } catch {
      alert('Gagal menghapus tahap.')
    }
  }

  // Memory
  const addMemory = () => {
    setMemoryItems([
      ...memoryItems,
      { id: 0, order: memoryItems.length + 1, label: '', image: '' },
    ])
    setMemoryFiles([...memoryFiles, null])
    setMemoryPreviews([...memoryPreviews, ''])
  }
  const updateMemory = (idx: number, field: keyof MemoryItem, value: any) => {
    const arr = [...memoryItems]
    // @ts-ignore
    arr[idx][field] = value
    setMemoryItems(arr)
  }
  const onMemoryFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    const newFiles     = [...memoryFiles]
    newFiles[idx]      = f
    setMemoryFiles(newFiles)
    if (f) {
      const newPrev    = [...memoryPreviews]
      newPrev[idx]     = URL.createObjectURL(f)
      setMemoryPreviews(newPrev)
    }
  }
  const saveMemoryItem = async (item: MemoryItem, idx: number) => {
    const form = new FormData()
    form.append('id',    item.id.toString())
    form.append('order', item.order.toString())
    form.append('label', item.label)
    if (memoryFiles[idx]) form.append('imageFile', memoryFiles[idx]!)
    else form.append('oldImage', memoryPreviews[idx])

    await axios.post('/api/memory', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    alert('Foto kenangan disimpan!')
    router.reload()
  }
  const deleteMemoryItem = async (id: number) => {
    if (!confirm('Hapus foto kenangan ini?')) return
    try {
      await axios.delete(`/api/memory?id=${id}`)
      alert('Foto kenangan dihapus!')
      router.reload()
    } catch {
      alert('Gagal menghapus foto.')
    }
  }

  // ─── Render by page ───────────────────────────────────────────────────────
  if (page==='profile') {
    return (
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <UserCircle2 className="mr-2 text-indigo-500"/> Edit Profil
        </h1>
        {/* Photo */}
        <div className="mb-4">
          <label className="block mb-1">Foto Profil</label>
          <input type="file" accept="image/*" onChange={onPhotoChange}/>
          {photoPreview && (
            <img src={photoPreview} alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>
        {/* About */}
        <div className="mb-4">
          <label className="block mb-1">Tentang Saya</label>
          <textarea
            rows={4} value={about}
            onChange={e=>setAbout(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Education */}
        <div className="mb-4">
          <label className="block mb-1">Pendidikan (baris per item)</label>
          <textarea
            rows={3} value={education}
            onChange={e=>setEducation(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Experience */}
        <div className="mb-4">
          <label className="block mb-1">Pengalaman (judul|periode|desc)</label>
          <textarea
            rows={4} value={experience}
            onChange={e=>setExperience(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Skills */}
        <div className="mb-4">
          <label className="block mb-1">Keahlian (pisah koma)</label>
          <input
            type="text" value={skills}
            onChange={e=>setSkills(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* DOB */}
        <div className="mb-4">
          <label className="block mb-1 flex items-center">
            <CalendarIcon className="mr-1 text-indigo-500"/> Tanggal Lahir
          </label>
          <input
            type="date" value={dob}
            onChange={e=>setDob(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 flex items-center">
              <MapPin className="mr-1 text-indigo-500"/> Lokasi
            </label>
            <input
              type="text" value={location}
              onChange={e=>setLocation(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 flex items-center">
              <Phone className="mr-1 text-indigo-500"/> Telepon
            </label>
            <input
              type="tel" value={phone}
              onChange={e=>setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 flex items-center">
              <Mail className="mr-1 text-indigo-500"/> Email
            </label>
            <input
              type="email" value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {/* Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 flex items-center">
              <LinkedinIcon className="mr-1 text-indigo-500"/> LinkedIn
            </label>
            <input
              type="url" value={linkedin}
              onChange={e=>setLinkedin(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 flex items-center">
              <GithubIcon className="mr-1 text-indigo-500"/> GitHub
            </label>
            <input
              type="url" value={github}
              onChange={e=>setGithub(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 flex items-center">
              <TwitterIcon className="mr-1 text-indigo-500"/> Twitter
            </label>
            <input
              type="url" value={twitter}
              onChange={e=>setTwitter(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {/* Save */}
        <button
          onClick={saveProfile}
          className="px-6 py-2 bg-indigo-600 text-white rounded flex items-center hover:bg-indigo-700"
        >
          <Save className="mr-2"/> Simpan Profil
        </button>
      </motion.div>
    )
  }

  // 2) PERJALANAN HIDUP
 if (page === 'perjalanan-hidup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg max-w-5xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold flex items-center">
            <CalendarIcon className="mr-2 text-indigo-500" /> Edit Perjalanan Hidup
          </h1>
          <motion.button
            onClick={addJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            <PlusCircle className="mr-2" /> Tambah Tahap
          </motion.button>
        </div>

        <div className="space-y-6">
          {journeyItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <CalendarIcon className="mr-2 text-indigo-500" /> Tahap #{item.order}
                </h2>
                {item.id !== 0 && (
                  <motion.button
                    onClick={() => deleteJourneyItem(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 />
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium mb-1">Order</label>
                    <input
                      type="number"
                      value={item.order}
                      onChange={e => updateJourney(idx, 'order', +e.target.value)}
                      className="w-24 p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400"
                    />
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium mb-1">Judul</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => updateJourney(idx, 'title', e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400"
                    />
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium mb-1">Periode</label>
                    <input
                      type="text"
                      value={item.period}
                      onChange={e => updateJourney(idx, 'period', e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400"
                    />
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={e => updateJourney(idx, 'description', e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400"
                    />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium mb-1 flex items-center">
                    <ImageIcon className="mr-2 text-purple-500" /> Gambar
                  </label>
                  <motion.input
                    type="file"
                    accept="image/*"
                    onChange={e => onJourneyFileChange(idx, e)}
                    whileHover={{ scale: 1.02 }}
                    className="block w-full text-sm text-gray-600 dark:text-gray-300
                               file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-100 file:text-purple-700
                               hover:file:bg-purple-200 transition-colors"
                  />
                  {journeyPreviews[idx] && (
                    <div className="w-full h-40 rounded-lg overflow-hidden border">
                      <img
                        src={journeyPreviews[idx]}
                        alt={`Preview Tahap #${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <motion.button
                  onClick={() => saveJourneyItem(item, idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
                >
                  <CheckCircle className="mr-2" /> Simpan
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (page === 'galeri-kenangan') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg max-w-5xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold flex items-center">
            <CameraIcon className="mr-2 text-green-600" /> Edit Galeri Kenangan
          </h1>
          <motion.button
            onClick={addMemory}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            <PlusCircle className="mr-2" /> Tambah Foto
          </motion.button>
        </div>

        <div className="space-y-6">
          {memoryItems.map((m, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <CameraIcon className="mr-2 text-green-500" />
                  Foto #{m.order}
                </h2>
                {m.id !== 0 && (
                  <motion.button
                    onClick={() => deleteMemoryItem(m.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 />
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Label</label>
                    <motion.input
                      type="text"
                      value={m.label}
                      onChange={e => updateMemory(idx, 'label', e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Tanggal</label>
                    <motion.input
                      type="date"
                      value={m.date}
                      onChange={e => updateMemory(idx, 'date', e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Lokasi</label>
                    <motion.input
                      type="text"
                      value={m.location}
                      onChange={e => updateMemory(idx, 'location', e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => updateMemory(idx, 'isFavorite', !m.isFavorite)}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 rounded-full ${
                        m.isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Star />
                    </motion.button>
                    <span>Favorit</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Deskripsi</label>
                    <motion.textarea
                      rows={3}
                      value={m.description}
                      onChange={e => updateMemory(idx, 'description', e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium flex items-center">
                    <CameraIcon className="mr-2 text-purple-500" /> Gambar
                  </label>
                  <motion.input
                    type="file"
                    accept="image/*"
                    onChange={e => onMemoryFileChange(idx, e)}
                    whileHover={{ scale: 1.02 }}
                    className="block w-full text-sm text-gray-600 dark:text-gray-300
                               file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-100 file:text-purple-700
                               hover:file:bg-purple-200 transition-colors"
                  />
                  {memoryPreviews[idx] && (
                    <div className="w-full h-40 rounded-lg overflow-hidden border">
                      <img
                        src={memoryPreviews[idx]}
                        alt={`Preview #${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right mt-4">
                <motion.button
                  onClick={() => saveMemoryItem(m, idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                >
                  <CheckCircle className="mr-2" /> Simpan
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (page === 'blog') {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold flex items-center">
          <BlogIcon className="mr-2 text-blue-600" /> Edit Blog
        </h1>
        <motion.button
          onClick={addPost}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          <PlusCircle className="mr-2" /> Tambah Post
        </motion.button>
      </div>

      {posts.map((post, idx) => (
        <motion.div
          key={idx}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="border-b pb-6 mb-6 space-y-4"
        >
          {/* Tanggal */}
          <div className="flex items-center space-x-4">
            <label className="w-20">📅 Tanggal</label>
            <input
              type="date"
              value={post.date.slice(0, 10)}
              onChange={e => updatePost(idx, 'date', e.target.value)}
              className="p-2 border rounded flex-1"
            />
          </div>

          {/* Judul */}
          <div className="flex items-center space-x-4">
            <label className="w-20">📝 Judul</label>
            <input
              type="text"
              value={post.title}
              onChange={e => updatePost(idx, 'title', e.target.value)}
              placeholder="Judul post"
              className="p-2 border rounded flex-1"
            />
          </div>

          {/* Excerpt */}
          <div className="flex items-start space-x-4">
            <label className="w-20 pt-2">✂️ Ringkasan</label>
            <textarea
              rows={2}
              value={post.excerpt}
              onChange={e => updatePost(idx, 'excerpt', e.target.value)}
              placeholder="Excerpt (ringkasan)"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Konten */}
          <div className="flex items-start space-x-4">
            <label className="w-20 pt-2">📖 Konten</label>
            <textarea
              rows={4}
              value={post.content}
              onChange={e => updatePost(idx, 'content', e.target.value)}
              placeholder="Tuliskan konten lengkap di sini"
              className="w-full p-2 border rounded font-mono"
            />
          </div>

          {/* Gambar */}
          <div className="flex items-center space-x-4">
            <label className="w-20">🖼️ Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => onPostFileChange(idx, e)}
              className="flex-1"
            />
            {postPreviews[idx] && (
              <img
                src={postPreviews[idx]}
                alt="Preview"
                className="w-24 h-16 object-cover rounded"
              />
            )}
          </div>

          {/* Tombol Simpan + Hapus */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => savePost(post, idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="mr-2" /> Simpan
            </motion.button>
            {post.id !== 0 && (
              <motion.button
                onClick={() => deletePost(post.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              >
                <Trash2 className="mr-2" /> Hapus
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

  // Default fallback
  return null
}


