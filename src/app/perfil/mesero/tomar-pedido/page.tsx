import { getAdminEmails } from '@/services/getAdminEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'
import { createClient } from '@/utils/supabase/server'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ListOfTables } from './_components/ListOfTables'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Tomar Pedido'
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
    <main className='pt-8 pb-10 px-9 relative w-full font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center overflow-y-auto'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-dark bg-color-background-light [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-left font-extrabold text-4xl z-10 pb-7 w-full'>
        Tomar <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Pedido</span>
      </span>
      <p className='w-full z-10 -mt-3 mb-9 text-p-light dark:text-p-dark text-center lg:text-left'>En esta sección podrás tomar el pedido a los clientes, y visualizar cuantas y cuales mesas se encuentran disponibles para su respectivo uso.</p>
      <ListOfTables />
    </main>
  )
}
