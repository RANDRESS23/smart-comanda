import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Comanda } from '@/types/comandas'
import { format } from '@formkit/tempo'

/* ➡ Hook para manejar las comandas del restaurante */
export const useComandas = () => {
  const [comandas, setComandas] = useState<Comanda[]>([])
  const [loadingComandas, setLoadingComandas] = useState(false)

  const getComandas = async () => {
    try {
      setLoadingComandas(true)

      const fecha = format(new Date(), 'YYYY-MM-DD')
      const response = await api.get(`/comanda/${fecha}`)

      setComandas(response?.data?.comandas as Comanda[])
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingComandas(false)
    }
  }

  useEffect(() => {
    getComandas()
  }, [])

  return { comandas, getComandas, setComandas, loadingComandas }
}
