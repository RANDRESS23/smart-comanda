import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { CashierTable } from './_components/CashierTable'
import { RegisterCashier } from './_components/RegisterCashier'
import { getMeserosEmails } from '@/services/getMeserosEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Registrar Cajero'
  }
}

export default async function RegisterCashierPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const meserosEmails = await getMeserosEmails()
  const cajerosEmails = await getCajerosEmails()

  const isMesero = meserosEmails.includes(data?.user?.email ?? '')
  const isCajero = cajerosEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/sign-in')
  if (isMesero) return redirect('/perfil/mesero/inicio')
  if (isCajero) return redirect('/perfil/cajero/inicio')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const serviceRolKey = process.env.SERVICE_ROL_KEY ?? ''

  return (
    <main className='pt-8 pb-10 px-9 relative w-full font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center overflow-y-auto'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-dark bg-color-background-light [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-left font-extrabold text-4xl z-10 pb-7 w-full'>
        Registrar <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Cajero</span>
      </span>
      <p className='w-full z-10 -mt-3 mb-9 text-p-light dark:text-p-dark text-center lg:text-left'>En esta sección podrás registrar un nuevo cajero, modificar la información de los cajeros ya registrados, o simplemente eliminar la cuenta de algún cajero.</p>
      <RegisterCashier
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
      <CashierTable
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
    </main>
  )
}
