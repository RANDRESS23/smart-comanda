/* ➡ Interfaz con los tipos de las propiedades de las categorías de los menús */
export interface CategoriaMenu {
  id_categoria_menu: string
  categoria: string
  createdAt: Date
  updatedAt: Date
}

/* ➡ Interfaz con los tipos de las propiedades de los Menus */
export interface Menu {
  id_menu: string
  producto: string
  descripcion: string
  precio: number
  id_categoria_menu: string
  categoria: string
  createdAt: Date
  updatedAt: Date
}

export interface MenuComanda {
  id_menu: string
  precio: number
  cantidad: number
}
