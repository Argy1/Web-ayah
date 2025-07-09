// src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '../../../lib/prisma'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      /** 
       * authorize sekarang menerima (credentials, req)
       * dan harus mengembalikan NextAuthUser dengan id: string 
       */
      async authorize(credentials, req) {
        // jika tidak ada credentials, batalkan
        if (!credentials) return null

        // cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null

        // cek password
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        // kembalikan objek User yang sesuai tipe NextAuthUser (id: string)
        const nextAuthUser: NextAuthUser = {
          id: user.id.toString(),         // ubah number -> string
          name: user.name,
          email: user.email,
        }
        // simpan role di token via callback di bawah
        ;(nextAuthUser as any).role = user.role

        return nextAuthUser
      },
    }),
  ],

  callbacks: {
    // menyertakan role pada JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    // expose role ke session
    async session({ session, token }) {
      session.user = session.user || {}
      ;(session.user as any).role = token.role
      return session
    },
  },
}

export default NextAuth(authOptions)
