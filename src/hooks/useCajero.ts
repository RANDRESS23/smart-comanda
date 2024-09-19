import { useEffect, useState } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { useCajeroStore } from '@/store/cajeros'
import { type Cajero } from '@/types/cajeros'
import { CAJERO_INITIAL_VALUES } from '@/initial-values/cajero'

/* ➡ Hook para manejar los datos del cajero */
export const useCajero = () => {
  const [loadingCajero, setLoadingCajero] = useState(false)
  const cajero = useCajeroStore(state => state.cajero)
  const setCajero = useCajeroStore(state => state.setCajero)
  const cajeroStorage: Cajero | null = useReadLocalStorage('cajero')
  const [cajeroStorageInitial, setCajeroStorage] = useLocalStorage<Cajero>('cajero', () => CAJERO_INITIAL_VALUES)

  const setCajeroStorageMemo = (cajero: Cajero) => {
    setCajeroStorage(cajero)
    setCajero(cajero)
  }

  useEffect(() => {
    setLoadingCajero(true)

    if (cajeroStorage === null) setCajeroStorage(cajeroStorageInitial)
    else if (cajeroStorage.correo !== '') setCajero(cajeroStorage)

    setLoadingCajero(false)
  }, [])

  return { cajero, loadingCajero, setCajero: setCajeroStorageMemo }
}
