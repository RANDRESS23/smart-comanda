import { CAJERO_INITIAL_VALUES } from '@/initial-values/cajero'
import { type Cajero } from '@/types/cajeros'
import { create } from 'zustand'

interface CajeroStore {
  cajero: Cajero
  cajeros: Cajero[]
  totalCajeros: Cajero[]
  cajerosCount: number
  setCajerosCount: (cajerosCount: number) => void
  setCajeros: (cajeros: Cajero[]) => void
  setTotalCajeros: (cajeros: Cajero[]) => void
  setCajero: (cajero: Cajero) => void
}

/* ➡ Configurando el store para el cajero */
export const useCajeroStore = create<CajeroStore>((set) => ({
  cajero: CAJERO_INITIAL_VALUES,
  cajeros: [CAJERO_INITIAL_VALUES],
  totalCajeros: [CAJERO_INITIAL_VALUES],
  cajerosCount: 0,
  setCajerosCount: (cajerosCount: number) => { set({ cajerosCount }) },
  setCajeros: (cajeros: Cajero[]) => { set({ cajeros }) },
  setTotalCajeros: (totalCajeros: Cajero[]) => { set({ totalCajeros }) },
  setCajero: (cajero: Cajero) => { set({ cajero }) }
}))
