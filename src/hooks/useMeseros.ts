import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Mesero } from '@/types/meseros'
import { useMeseroStore } from '@/store/meseros'

interface MeseroProps {
  page?: string
  rows?: string
}

/* ➡ Hook para manejar los datos de los meseros */
export const useMeseros = ({ page = '1', rows = '10' }: MeseroProps) => {
  const meseros = useMeseroStore(state => state.meseros)
  const setMeseros = useMeseroStore(state => state.setMeseros)
  const totalMeseros = useMeseroStore(state => state.totalMeseros)
  const setTotalMeseros = useMeseroStore(state => state.setTotalMeseros)
  const meserosCount = useMeseroStore(state => state.meserosCount)
  const setMeserosCount = useMeseroStore(state => state.setMeserosCount)
  const [loadingMeseros, setLoadingMeseros] = useState(false)

  useEffect(() => {
    const getMeseros = async () => {
      try {
        setLoadingMeseros(true)

        const response = await api.get(`/meseros?page=${page}&rows=${rows}`)

        setMeseros(response.data.meseros as Mesero[])
        setTotalMeseros(response.data.totalMeseros as Mesero[])
        setMeserosCount(response.data.meserosCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingMeseros(false)
      }
    }

    getMeseros()
  }, [page, rows])

  return { meseros, meserosCount, totalMeseros, loadingMeseros, setMeseros }
}
