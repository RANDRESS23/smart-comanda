import { Button } from '@/components/Button'
import api from '@/libs/api'
import { cn } from '@/libs/utils'
import { type ComandaResume } from '@/types/comandas'
import { type MenuComanda } from '@/types/menus'
import { type EstadoMesa } from '@/types/mesas'
import { useState } from 'react'
import { toast } from 'sonner'

interface ResumeOrderProps {
  comandaResume: ComandaResume | null
  comanda: MenuComanda[]
  idMesa: string
  isEditComanda: boolean
  onClose2: () => void
  onClose: () => void
  onOpen3: () => void
  onShoot: () => void
  setEstadosMesas: (value: any) => void
  setIsEditComanda: (value: any) => void
}

export const ResumeOrder = ({ comandaResume, comanda, idMesa, isEditComanda, onClose, onOpen3, onClose2, onShoot, setEstadosMesas, setIsEditComanda }: ResumeOrderProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const comandaFiltered = comanda.filter(item => item.cantidad > 0)

      if (!isEditComanda) {
        const response = await api.post('/comanda', {
          idMesa,
          cantidadPersonas: 4,
          comanda: comandaFiltered
        })

        if (response.status === 201) {
          setEstadosMesas(response.data.estadosMesas as EstadoMesa[])
          toast.success('¡La comanda fue registrada exitosamente!')
          onShoot()
          onClose2()
          onClose()
          onOpen3()
          return
        }

        toast.error('¡Ocurrió un error al guardar la comanda!')
        console.log({ response })
      } else {
        const response = await api.put('/comanda', {
          idMesa,
          cantidadPersonas: 4,
          comanda: comandaFiltered
        })

        if (response.status === 200) {
          toast.success('¡La comanda fue actualizada exitosamente!')
          setIsEditComanda(false)
          onShoot()
          onClose2()
          onClose()
          onOpen3()
          return
        }

        toast.error('¡Ocurrió un error al actualizar la comanda!')
        console.log({ response })
      }
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

  if (!comandaResume) return null

  return (
    <div className={cn(
      'bg-gray-50 relative group/card dark:bg-black h-auto rounded-xl p-6 transition-all bg-grid-black dark:bg-grid-white w-full'
    )}>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-2-dark bg-color-background-2-light [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
      <div
        className="w-full text-[23px] text-center font-bold text-neutral-600 dark:text-white z-10 relative"
      >
        {isEditComanda ? 'COMANDA ACTUALIZADA' : 'COMANDA NUEVA'}
      </div>
      <div
        className="w-full text-[20px] text-center font-bold -mt-1 italic text-color-pink-primary-accent-dark z-10 relative"
      >
        (MESA {comandaResume.mesa})
      </div>
      <div
        className="w-full text-[16px] text-center font-bold text-neutral-600 dark:text-white my-6 z-10 relative"
      >
        <div className='w-full flex flex-col gap-2 mb-3 border-b-2 border-color-pink-primary-accent-dark pb-3'>
          {
            comandaResume.menu.map((item, index) => (
              <div key={index} className='flex justify-between gap-2'>
                <span className='text-left'><span className='text-color-pink-primary-accent-dark'>◼</span> {item.menu} ($ {item.precio_total})</span>
                <span className='text-right'>x{item.cantidad}</span>
              </div>
            ))
          }
        </div>
        <div className='w-full flex flex-col z-10 relative'>
          <div className='flex justify-between gap-2'>
            <span className='text-left'>TOTAL</span>
            <span className='text-right'>$ {comandaResume.precio_total}</span>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center mt-10 gap-y-3'>
          <Button
            type="button"
            text={isLoading ? 'Cargando...' : isEditComanda ? 'Actualizar Pedido' : 'Confirmar Pedido'}
            disabled={isLoading}
            onClick={onSubmit}
          />
          <Button
            type="button"
            text='Volver'
            disabled={isLoading}
            onClick={onClose2}
          />
        </div>
      </div>
    </div>
  )
}
