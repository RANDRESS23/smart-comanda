import { type Mesas } from '@/types/mesas'
import { create } from 'zustand'

interface MesasStore {
  mesasTotales: Mesas[]
  setMesasTotales: (mesasTotales: Mesas[]) => void
}

/* ➡ Configurando el store para los mesas */
export const useMesasStore = create<MesasStore>((set) => ({
  mesasTotales: [],
  setMesasTotales: (mesasTotales: Mesas[]) => { set({ mesasTotales }) }
}))
