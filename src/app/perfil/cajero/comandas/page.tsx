import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getAdminEmails } from '@/services/getAdminEmails'
import { getMeserosEmails } from '@/services/getMeserosEmails'
import { ListOfComandas } from './_components/ListOfComandas'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Comandas'
  }
}

export default async function ComandasPage () {
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
    <main className='pt-8 pb-10 px-9 relative w-full font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center overflow-y-auto'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-dark bg-color-background-light [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-center sm:text-left font-extrabold text-4xl z-10 pb-7 w-full'>
        Total <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Comandas</span>
      </span>
      <ListOfComandas />
    </main>
  )
}
