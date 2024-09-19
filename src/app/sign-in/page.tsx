import { type Metadata } from 'next'
import { FormSignIn } from './_components/FormSignIn'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getAdminEmails } from '@/services/getAdminEmails'
import { getMeserosEmails } from '@/services/getMeserosEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Iniciar Sesión'
  }
}

/* ➡ Este componente es el que se renderiza en la pagina "Iniciar Sesión" del aplicativo */
export default async function SignInPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  const adminEmails = await getAdminEmails()
  const meserosEmails = await getMeserosEmails()
  const cajerosEmails = await getCajerosEmails()

  if (data.user) {
    const isAdmin = adminEmails.includes(data?.user?.email ?? '')
    const isMesero = meserosEmails.includes(data?.user?.email ?? '')
    const isCajero = cajerosEmails.includes(data?.user?.email ?? '')

    if (isAdmin) return redirect('/perfil/admin/inicio')
    else if (isMesero) return redirect('/perfil/mesero/inicio')
    else if (isCajero) return redirect('/perfil/cajero/inicio')
  }

  return (
    <div className='container py-20 mx-auto'>
      <FormSignIn />
    </div>
  )
}
