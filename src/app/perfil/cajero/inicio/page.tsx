import { redirect } from 'next/navigation'
import { BgParticles } from './_components/BgParticles'
import { WelcomeCajero } from './_components/WelcomeCajero'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getAdminEmails } from '@/services/getAdminEmails'
import { getMeserosEmails } from '@/services/getMeserosEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Inicio'
  }
}

export default async function HomePage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const adminEmails = await getAdminEmails()
  const meserosEmails = await getMeserosEmails()

  const isAdmin = adminEmails.includes(data?.user?.email ?? '')
  const isMesero = meserosEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/sign-in')
  if (isAdmin) return redirect('/perfil/admin/inicio')
  if (isMesero) return redirect('/perfil/mesero/inicio')

  return (
    <div className='h-screen relative px-9 font-inter-sans flex flex-col items-center justify-center w-full'>
      <BgParticles />
      <WelcomeCajero />
    </div>
  )
}
