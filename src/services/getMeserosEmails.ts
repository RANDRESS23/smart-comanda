import api from '@/libs/api'

/* ➡ Función para obtener los emails de todos los meseros */
export const getMeserosEmails = async () => {
  let meserosEmails: string[] = []

  try {
    const { data: { emailsMeseros } } = await api.get('/meseros/emails')

    meserosEmails = emailsMeseros
  } catch (error) {
    console.log(error)
  }

  return meserosEmails
}
