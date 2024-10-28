import { type EstadoMesa, type Mesas } from '@/types/mesas'
import { create } from 'zustand'

interface MesasStore {
  mesasTotales: Mesas[]
  estadosMesas: EstadoMesa[]
  setMesasTotales: (mesasTotales: Mesas[]) => void
  setEstadosMesas: (estadosMesas: EstadoMesa[]) => void
}

/* ➡ Configurando el store para los mesas */
export const useMesasStore = create<MesasStore>((set) => ({
  mesasTotales: [],
  estadosMesas: [],
  setMesasTotales: (mesasTotales: Mesas[]) => { set({ mesasTotales }) },
  setEstadosMesas: (estadosMesas: EstadoMesa[]) => { set({ estadosMesas }) }
}))
