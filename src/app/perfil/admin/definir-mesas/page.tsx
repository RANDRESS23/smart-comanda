import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getMeserosEmails } from '@/services/getMeserosEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'
import { DefineTables } from './_components/DefineTables'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Definir Mesas'
  }
}

export default async function DefineTablesPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const meserosEmails = await getMeserosEmails()
  const cajerosEmails = await getCajerosEmails()

  const isMesero = meserosEmails.includes(data?.user?.email ?? '')
  const isCajero = cajerosEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/sign-in')
  if (isMesero) return redirect('/perfil/mesero/inicio')
  if (isCajero) return redirect('/perfil/cajero/inicio')

  return (
    <main className='pt-8 pb-10 px-9 relative w-full font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center overflow-y-auto'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-dark bg-color-background-light [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-left font-extrabold text-4xl z-10 pb-7 w-full'>
        Definir Cantidad de <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Mesas</span>
      </span>
      <p className='w-full z-10 -mt-3 text-p-light dark:text-p-dark text-center lg:text-left'>En esta sección podrás definir la cantidad de mesas disponibles para el restaurante, así como también modificar dicha cantidad de mesas.</p>
      <DefineTables />
    </main>
  )
}
