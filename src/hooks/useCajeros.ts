import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Cajero } from '@/types/cajeros'
import { useCajeroStore } from '@/store/cajeros'

interface CajeroProps {
  page?: string
  rows?: string
}

/* ➡ Hook para manejar los datos de los cajeros */
export const useCajeros = ({ page = '1', rows = '10' }: CajeroProps) => {
  const cajeros = useCajeroStore(state => state.cajeros)
  const setCajeros = useCajeroStore(state => state.setCajeros)
  const totalCajeros = useCajeroStore(state => state.totalCajeros)
  const setTotalCajeros = useCajeroStore(state => state.setTotalCajeros)
  const cajerosCount = useCajeroStore(state => state.cajerosCount)
  const setCajerosCount = useCajeroStore(state => state.setCajerosCount)
  const [loadingCajeros, setLoadingCajeros] = useState(false)

  useEffect(() => {
    const getCajeros = async () => {
      try {
        setLoadingCajeros(true)

        const response = await api.get(`/cajeros?page=${page}&rows=${rows}`)

        setCajeros(response.data.cajeros as Cajero[])
        setTotalCajeros(response.data.totalCajeros as Cajero[])
        setCajerosCount(response.data.cajerosCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingCajeros(false)
      }
    }

    getCajeros()
  }, [page, rows])

  return { cajeros, cajerosCount, totalCajeros, loadingCajeros, setCajeros }
}
