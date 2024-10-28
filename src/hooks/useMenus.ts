import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type CategoriaMenu, type Menu } from '@/types/menus'

/* ➡ Hook para manejar los datos de los menus */
export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([])
  const [categoriasMenus, setCategoriasMenus] = useState<CategoriaMenu[]>([])
  const [loadingMenus, setLoadingMenus] = useState(false)

  useEffect(() => {
    const getMenus = async () => {
      try {
        setLoadingMenus(true)

        const response = await api.get('/menus')
        const response2 = await api.get('/categorias-menu')

        setMenus(response.data.menus as Menu[])
        setCategoriasMenus(response2.data.categoriasMenus as CategoriaMenu[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingMenus(false)
      }
    }

    getMenus()
  }, [])

  return { menus, categoriasMenus, loadingMenus }
}
