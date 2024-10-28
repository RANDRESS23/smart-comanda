/* ➡ Interfaz con los tipos de las propiedades del objeto Mesas */
export interface Mesas {
  id_mesa: string
  numero_mesa: number
  createdAt: Date
  updatedAt: Date
}

export interface EstadoMesa {
  id_estado_mesa: string
  id_mesa: string
  id_estado: string
  estado: string
  createdAt: Date
  updatedAt: Date
}
