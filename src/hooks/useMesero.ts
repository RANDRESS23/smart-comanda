import { useEffect, useState } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { useMeseroStore } from '@/store/meseros'
import { type Mesero } from '@/types/meseros'
import { MESERO_INITIAL_VALUES } from '@/initial-values/mesero'

/* ➡ Hook para manejar los datos del mesero */
export const useMesero = () => {
  const [loadingMesero, setLoadingMesero] = useState(false)
  const mesero = useMeseroStore(state => state.mesero)
  const setMesero = useMeseroStore(state => state.setMesero)
  const meseroStorage: Mesero | null = useReadLocalStorage('mesero')
  const [meseroStorageInitial, setMeseroStorage] = useLocalStorage<Mesero>('mesero', () => MESERO_INITIAL_VALUES)

  const setMeseroStorageMemo = (mesero: Mesero) => {
    setMeseroStorage(mesero)
    setMesero(mesero)
  }

  useEffect(() => {
    setLoadingMesero(true)

    if (meseroStorage === null) setMeseroStorage(meseroStorageInitial)
    else if (meseroStorage.correo !== '') setMesero(meseroStorage)

    setLoadingMesero(false)
  }, [])

  return { mesero, loadingMesero, setMesero: setMeseroStorageMemo }
}
