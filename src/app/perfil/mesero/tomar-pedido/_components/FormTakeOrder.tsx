'use client'

import { useState } from 'react'
import api from '@/libs/api'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { Accordion, AccordionItem } from '@nextui-org/react'
import { useMenus } from '@/hooks/useMenus'
import { type MenuComanda } from '@/types/menus'
import { type EstadoMesa } from '@/types/mesas'

interface FormTakeOrderProps {
  idMesa: string
  onClose: () => void
  onShoot: () => void
  setEstadosMesas: (value: any) => void
}

export const FormTakeOrder = ({ idMesa, onClose, onShoot, setEstadosMesas }: FormTakeOrderProps) => {
  const { menus, categoriasMenus, loadingMenus } = useMenus()
  const [isLoading, setIsLoading] = useState(false)
  const [comanda, setComanda] = useState<MenuComanda[]>([])

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const response = await api.post('/comanda', {
        idMesa,
        cantidadPersonas: 4,
        comanda
      })

      if (response.status === 201) {
        setEstadosMesas(response.data.estadosMesas as EstadoMesa[])
        toast.success('¡La comanda fue registrada exitosamente!')
        onShoot()
        onClose()
        return
      }

      toast.error('¡Ocurrió un error al guardar la comanda!')
      console.log({ response })
    } catch (error: any) {
      if (error.response?.data !== undefined) {
        const errorsMessages = Object.values(error.response.data as Record<string, string>)
        let errorsMessagesString = ''

        errorsMessages.forEach((message: any) => {
          errorsMessagesString += `${message} ${'\n'}`
        })

        return toast.error(errorsMessagesString)
      }

      console.error({ error })
    } finally {
      setIsLoading(false)
    }
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
            categoriasMenus.map(categoriaMenu => (
              <AccordionItem
                key={categoriaMenu.id_categoria_menu}
                aria-label={categoriaMenu.categoria}
                title={categoriaMenu.categoria}
              >
                {
                  menus.filter(menu => menu.id_categoria_menu === categoriaMenu.id_categoria_menu).map((menu, index) => (
                    <>
                      <div className='flex justify-between items-center pl-5 mb-2' key={`${menu.id_menu}${index}`}>
                        <div className='flex flex-col justify-center w-[65%]'>
                          <span className='font-semibold'>{menu.producto} ($ {menu.precio})</span>
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
          text={isLoading ? 'Cargando...' : 'Tomar Pedido'}
          disabled={isLoading}
          onClick={onSubmit}
        />
        <Button
          type="button"
          text='Cancelar Pedido'
          disabled={isLoading}
          onClick={onClose}
        />
      </div>
    </div>
  )
}
