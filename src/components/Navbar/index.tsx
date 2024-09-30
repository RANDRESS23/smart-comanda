import { createClient } from '@/utils/supabase/server'
import { NavBarApp } from './NavBarApp'
import { getAdminEmails } from '@/services/getAdminEmails'
import { getMeserosEmails } from '@/services/getMeserosEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'

/* ➡ Componente que renderiza el NavBar del aplicativo */
export const NavBar = async () => {
  const supabase = createClient()
  const adminEmails = await getAdminEmails()
  const meserosEmails = await getMeserosEmails()
  const cajerosEmails = await getCajerosEmails()

  const { data } = await supabase.auth.getUser()

  const isAdmin = adminEmails.includes(data?.user?.email ?? '')
  const isMesero = meserosEmails.includes(data?.user?.email ?? '')
  const isCajero = cajerosEmails.includes(data?.user?.email ?? '')

  return (
    <NavBarApp
      user={data.user}
      isAdmin={isAdmin}
      isMesero={isMesero}
      isCajero={isCajero}
    />
  )
}
