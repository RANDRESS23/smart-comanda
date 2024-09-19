import { MESERO_INITIAL_VALUES } from '@/initial-values/mesero'
import { type Mesero } from '@/types/meseros'
import { create } from 'zustand'

interface MeseroStore {
  mesero: Mesero
  meseros: Mesero[]
  totalMeseros: Mesero[]
  meserosCount: number
  setMeserosCount: (meserosCount: number) => void
  setMeseros: (meseros: Mesero[]) => void
  setTotalMeseros: (meseros: Mesero[]) => void
  setMesero: (mesero: Mesero) => void
}

/* ➡ Configurando el store para el mesero */
export const useMeseroStore = create<MeseroStore>((set) => ({
  mesero: MESERO_INITIAL_VALUES,
  meseros: [MESERO_INITIAL_VALUES],
  totalMeseros: [MESERO_INITIAL_VALUES],
  meserosCount: 0,
  setMeserosCount: (meserosCount: number) => { set({ meserosCount }) },
  setMeseros: (meseros: Mesero[]) => { set({ meseros }) },
  setTotalMeseros: (totalMeseros: Mesero[]) => { set({ totalMeseros }) },
  setMesero: (mesero: Mesero) => { set({ mesero }) }
}))
