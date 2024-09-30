'use client'

import { FaUserPlus } from 'react-icons/fa'
import { MdTableBar } from 'react-icons/md'

/* ➡ Items del NavBar sin loguearse ningún rol */
export const menuItems = [
]

/* ➡ Items del NavBar del administrador */
export const menuItemsAdmin = [
  {
    label: 'Registrar Mesero',
    href: '/perfil/admin/registrar-mesero',
    icon: (
      <FaUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    )
  },
  {
    label: 'Registrar Cajero',
    href: '/perfil/admin/registrar-cajero',
    icon: (
      <FaUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    )
  },
  {
    label: 'Definir Mesas',
    href: '/perfil/admin/definir-mesas',
    icon: (
      <MdTableBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    )
  }
]

/* ➡ Items del NavBar del mesero */
export const menuItemsMesero = [
]

/* ➡ Items del NavBar del cajero */
export const menuItemsCajero = [
]
