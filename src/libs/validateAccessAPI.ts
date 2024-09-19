import { getAdminEmails } from '@/services/getAdminEmails'
import { getMeserosEmails } from '@/services/getMeserosEmails'
import { getCajerosEmails } from '@/services/getCajerosEmails'
import { createClient } from '@/utils/supabase/server'

export const validateAccessAPI = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const adminEmails = await getAdminEmails()
  const meserosEmails = await getMeserosEmails()
  const cajerosEmails = await getCajerosEmails()

  const isAdmin = adminEmails.includes(data?.user?.email ?? '')
  const isMesero = meserosEmails.includes(data?.user?.email ?? '')
  const isCajero = cajerosEmails.includes(data?.user?.email ?? '')

  return isAdmin || isMesero || isCajero
}
