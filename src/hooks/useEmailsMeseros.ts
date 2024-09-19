import { useState, useEffect } from 'react'
import api from '@/libs/api'

/* ➡ Hook para manejar los emails de los Meseros */
export const useEmailsMeseros = () => {
  const [emailsMeseros, setEmailsMeseros] = useState<string[]>([])
  const [loadingEmailsMeseros, setLoadingEmailsMeseros] = useState(false)

  useEffect(() => {
    const getEmailsMeseros = async () => {
      try {
        setLoadingEmailsMeseros(true)

        const response = await api.get('/meseros/emails')

        setEmailsMeseros(response?.data?.emailsMeseros as string[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmailsMeseros(false)
      }
    }

    getEmailsMeseros()
  }, [])

  return { emailsMeseros, loadingEmailsMeseros }
}
