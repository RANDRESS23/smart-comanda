import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Mesas } from '@/types/mesas'
import { useMesasStore } from '@/store/mesas'

/* ➡ Hook para manejar los datos de los mesas totales */
export const useMesasTotales = () => {
  const mesasTotales = useMesasStore(state => state.mesasTotales)
  const setMesasTotales = useMesasStore(state => state.setMesasTotales)
  const [loadingMesasTotales, setLoadingMesasTotales] = useState(false)

  useEffect(() => {
    const getMesasTotales = async () => {
      try {
        setLoadingMesasTotales(true)

        const response = await api.get('/mesas')

        if (response.data === null) return

        setMesasTotales(response.data.mesasTotales as Mesas[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingMesasTotales(false)
      }
    }

    getMesasTotales()
  }, [])

  return { mesasTotales, loadingMesasTotales, setMesasTotales }
}
