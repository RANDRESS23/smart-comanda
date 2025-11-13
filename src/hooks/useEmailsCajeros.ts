import { useState, useEffect } from 'react'
import api from '@/libs/api'

/* ➡ Hook para manejar los emails de los cajeros */
export const useEmailsCajeros = () => {
  const [emailsCajeros, setEmailsCajeros] = useState<string[]>([])
  const [loadingEmailsCajeros, setLoadingEmailsCajeros] = useState(false)

  useEffect(() => {
    const getEmailsCajeros = async () => {
      try {
        setLoadingEmailsCajeros(true)

        const response = await api.get('/cajeros/emails', { fetchOptions: { cache: 'no-store' } })

        setEmailsCajeros(response?.data?.emailsCajeros as string[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmailsCajeros(false)
      }
    }

    getEmailsCajeros()
  }, [])

  return { emailsCajeros, loadingEmailsCajeros }
}
