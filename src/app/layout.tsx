import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextUIProviderContext from '@/providers/NextUIProvider'
import { NavBar } from '@/components/Navbar'
import { Toaster } from 'sonner'
import { ViewTransitions } from 'next-view-transitions'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'SmartComanda | Inicio',
  description: 'Generated by create next app'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans`}
        >
          <NextUIProviderContext>
            <Toaster />
            <NavBar />
            {children}
          </NextUIProviderContext>
        </body>
      </html>
    </ViewTransitions>
  )
}
