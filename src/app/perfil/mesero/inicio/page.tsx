import { redirect } from 'next/navigation'
import { BgParticles } from './_components/BgParticles'
import { WelcomeMesero } from './_components/WelcomeMesero'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getAdminEmails } from '@/services/getAdminEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Inicio'
  }
}

export default async function HomePage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const adminEmails = await getAdminEmails()
  const cajerosEmails = await getCajerosEmails()

  const isAdmin = adminEmails.includes(data?.user?.email ?? '')
  const isCajero = cajerosEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/sign-in')
  if (isAdmin) return redirect('/perfil/admin/inicio')
  if (isCajero) return redirect('/perfil/cajero/inicio')

  return (
    <div className='h-screen relative px-9 font-inter-sans flex flex-col items-center justify-center w-full'>
      <BgParticles />
      <WelcomeMesero />
    </div>
  )
}
