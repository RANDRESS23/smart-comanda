import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type EstadoMesa, type Mesas } from '@/types/mesas'
import { useMesasStore } from '@/store/mesas'

/* ➡ Hook para manejar los datos de los mesas totales */
export const useMesasTotales = () => {
  const mesasTotales = useMesasStore(state => state.mesasTotales)
  const setMesasTotales = useMesasStore(state => state.setMesasTotales)
  const estadosMesas = useMesasStore(state => state.estadosMesas)
  const setEstadosMesas = useMesasStore(state => state.setEstadosMesas)
  const [loadingMesasTotales, setLoadingMesasTotales] = useState(false)

  useEffect(() => {
    const getMesasTotales = async () => {
      try {
        setLoadingMesasTotales(true)

        const response = await api.get('/mesas')
        const response2 = await api.get('/mesas/estado')

        if (response.data === null || response2.data === null) return

        setMesasTotales(response.data.mesasTotales as Mesas[])
        setEstadosMesas(response2.data.estadosMesas as EstadoMesa[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingMesasTotales(false)
      }
    }

    getMesasTotales()
  }, [])

  return { mesasTotales, estadosMesas, loadingMesasTotales, setMesasTotales, setEstadosMesas }
}
