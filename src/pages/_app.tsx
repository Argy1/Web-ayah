// src/pages/_app.tsx
'use client'

import React from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import MainLayout from '../components/layouts/main-layout'
import PageTransition from '../components/pagetransition'
import Cursor from '../components/cursor'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: any } }) {
  const router = useRouter()

  return (
    <SessionProvider session={session}>
      <MainLayout>
        <Cursor />
        <PageTransition>
          <Component key={router.asPath} {...pageProps} />
        </PageTransition>
      </MainLayout>
    </SessionProvider>
  )
}
