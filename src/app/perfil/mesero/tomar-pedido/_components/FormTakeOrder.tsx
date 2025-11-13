'use client'

import { useEffect } from 'react'
import api from '@/libs/api'
import { Button } from '@/components/Button'
import { Accordion, AccordionItem } from '@nextui-org/react'
import { useMenus } from '@/hooks/useMenus'
import { type MenuComanda } from '@/types/menus'
import { toast } from 'sonner'

interface FormTakeOrderProps {
  idMesa: string
  numeroMesa: number
  isEditComanda: boolean
  comanda: MenuComanda[]
  onOpen2: () => void
  onClose: () => void
  setComandaResume: (value: any) => void
  setComanda: (value: any) => void
}

const ICONS_PRODUCTS = {
  PIZZAS: '🍕',
  HAMBURGUESAS: '🍔',
  'PERROS CALIENTES': '🌭',
  BEBIDAS: '🥤',
  PORCIONES: '🍽️',
  SALCHIPAPAS: '🍟',
  'PATACÓN Y MAZORCADAS': '🌽',
  LASAÑAS: '🍲'
} as const

export const FormTakeOrder = ({ idMesa, isEditComanda, numeroMesa, comanda, onOpen2, onClose, setComandaResume, setComanda }: FormTakeOrderProps) => {
  const { menus, categoriasMenus, loadingMenus } = useMenus()

  useEffect(() => {
    if (!isEditComanda) return

    const getComandaMenu = async () => {
      const response = await api.get(`/comanda/mesa/${idMesa}`)

      if (response.status === 200) {
        setComanda(response.data.comandaMenu as MenuComanda[])
      }
    }

    getComandaMenu()
  }, [])

  const onSubmit = () => {
    const menu = comanda.map(comandaMenu => {
      const menuName = menus.find(menu => menu.id_menu === comandaMenu.id_menu)

      return {
        menu: menuName?.producto,
        cantidad: comandaMenu.cantidad,
        precio_total: comandaMenu.precio
      }
    }).filter(comandaMenu => comandaMenu.cantidad > 0)

    const comandaResume = {
      cantidad_productos: comanda.reduce((acc, menu) => acc + menu.cantidad, 0),
      precio_total: comanda.reduce((acc, menu) => acc + menu.precio, 0),
      mesa: numeroMesa,
      menu
    }

    setComandaResume(comandaResume)

    if (comandaResume.cantidad_productos === 0) {
      toast.error('¡No puedes continuar hasta que selecciones algún producto!')
    } else onOpen2()
  }

  const handleComanda = (idMenu: string, price: number, isAddMenu: boolean) => {
    const menuComanda = comanda.find(menu => menu.id_menu === idMenu)

    if ((menuComanda?.cantidad === 0 || !menuComanda) && !isAddMenu) return

    if (menuComanda) {
      const newComanda = comanda.map(menu => {
        if (menu.id_menu === idMenu) {
          return {
            ...menu,
            cantidad: isAddMenu ? menu.cantidad + 1 : menu.cantidad - 1,
            precio: isAddMenu ? menu.precio + price : menu.precio - price
          }
        }

        return menu
      })

      setComanda(newComanda)
    } else {
      setComanda([
        ...comanda,
        {
          id_menu: idMenu,
          precio: price,
          cantidad: 1
        }
      ])
    }
  }

  const getCantidadMenu = (idMenu: string) => {
    const cantidad = comanda.find(menu => menu.id_menu === idMenu)?.cantidad ?? 0
    return cantidad
  }

  const getPrecioMenu = (idMenu: string) => {
    const precio = comanda.find(menu => menu.id_menu === idMenu)?.precio ?? 0
    return `$ ${precio}`
  }

  if (loadingMenus) {
    return <div className='flex justify-center items-center h-screen text-2xl font-semibold'>Cargando...</div>
  }

  return (
    <div className='relative font-inter-sans flex flex-col justify-center items-center'>
      <div className='w-full flex flex-col gap-5'>

        <Accordion>
          {
            categoriasMenus.map((categoriaMenu, index) => (
              <AccordionItem
                key={`${categoriaMenu.id_categoria_menu}_${index}`}
                aria-label={categoriaMenu.categoria}
                title={`${ICONS_PRODUCTS[categoriaMenu.categoria as keyof typeof ICONS_PRODUCTS] || ''} ${categoriaMenu.categoria}`}
              >
                {
                  menus.filter(menu => menu.id_categoria_menu === categoriaMenu.id_categoria_menu).map((menu, index) => (
                    <>
                      <div className='flex justify-between items-center pl-5 mb-2' key={`${menu.id_menu}${index}`}>
                        <div className='flex flex-col justify-center w-[65%]'>
                          <span className='font-semibold'>{ICONS_PRODUCTS[categoriaMenu.categoria as keyof typeof ICONS_PRODUCTS] || ''} {menu.producto} ($ {menu.precio})</span>
                          <span className='text-sm'>{menu.descripcion}</span>
                        </div>
                        <div className='flex flex-col justify-center gap-2'>
                          <span className='font-bold text-center'>{ getPrecioMenu(menu.id_menu) }</span>
                          <div className='flex justify-between items-center gap-5'>
                            <button type='button' className='bg-bg-color-pink-primary-gradient-light dark:bg-bg-color-pink-primary-gradient-dark border-none w-8 h-8 flex justify-center items-center text-center font-bold' onClick={() => { handleComanda(menu.id_menu, menu.precio, false) }}>-</button>
                            <span className='font-bold'>{ getCantidadMenu(menu.id_menu) }</span>
                            <button type='button' className='bg-green-400 border-none w-8 h-8 flex justify-center items-center text-center font-bold' onClick={() => { handleComanda(menu.id_menu, menu.precio, true) }}>+</button>
                          </div>
                        </div>
                      </div>
                      <hr className='mt-3 mb-3 w-[93%] mx-auto border-black dark:border-white z-10' />
                    </>
                  ))
                }
              </AccordionItem>
            ))
          }
        </Accordion>

        <Button
          type="button"
          text={isEditComanda ? 'Actualizar Pedido' : 'Tomar Pedido'}
          disabled={false}
          onClick={onSubmit}
        />
        <Button
          type="button"
          text='Cancelar Pedido'
          disabled={false}
          onClick={onClose}
        />
      </div>
    </div>
  )
}
