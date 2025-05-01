export interface Comanda {
  id_comanda: string
  cantidad_productos: number
  precio_total: number
  id_mesa: string
  mesa: number
  menu: ComandaMenu[]
  createdAt: Date
  updatedAt: Date
}

export interface ComandaMenu {
  id_comanda_menu: string
  id_comanda: string
  id_menu: string
  menu: string
  cantidad: number
  precio_total: number
  createdAt: Date
  updatedAt: Date
}

export interface ComandaResume {
  cantidad_productos: number
  precio_total: number
  mesa: number
  menu: ComandaMenuResume[]
}

export interface ComandaMenuResume {
  menu: string
  cantidad: number
  precio_total: number
}
