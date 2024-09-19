import api from '@/libs/api'

/* ➡ Función para obtener los emails de todos los cajeros */
export const getCajerosEmails = async () => {
  let cajerosEmails: string[] = []

  try {
    const { data: { emailsCajeros } } = await api.get('/cajeros/emails')

    cajerosEmails = emailsCajeros
  } catch (error) {
    console.log(error)
  }

  return cajerosEmails
}
