'use client'

import { useState, useEffect } from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { cn } from '@/libs/utils'
import { type Comanda } from '@/types/comandas'
import { format } from '@formkit/tempo'
import { toast } from 'sonner'
import api from '@/libs/api'

interface CardComandaProps {
  comanda: Comanda
  numeroComanda: number
  onShoot: () => void
  comandas: Comanda[]
  setComandas: (newComandas: Comanda[]) => void
}

export const CardComanda = ({ comanda, numeroComanda, onShoot, comandas, setComandas }: CardComandaProps) => {
  const [chronometer, setChronometer] = useState('00:00:00')

  useEffect(() => {
    const interval = setInterval(() => {
      const dateAux = new Date()
      dateAux.setUTCHours(dateAux.getUTCHours() - 5)
      const currentDate = new Date(dateAux.toString())
      const diff = currentDate.getTime() - new Date(comanda.createdAt).getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setChronometer(`${hours >= 10 ? hours : `0${hours}`}:${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}`)
    }, 1000)

    return () => { clearInterval(interval) }
  }, [])

  const getHourComanda = () => {
    const dateAux = new Date(comanda.createdAt)
    dateAux.setUTCHours(dateAux.getUTCHours() + 5)
    const hour = new Date(dateAux.toString())

    return format(hour, 'h:mm A', 'es')
  }

  const handleFinishComanda: any = () => {
    toast(`¿Deseas finalizar la comanda #${numeroComanda}?`, {
      action: {
        label: 'Finalizar',
        onClick: () => { finishComanda() }
      }
    })
  }

  const finishComanda = async () => {
    try {
      const response = await api.put('/comanda/estado', { idComanda: comanda.id_comanda })

      if (response.status === 200) {
        const newComandas: Comanda[] = comandas.filter((comandaAux) => comandaAux.id_comanda !== comanda.id_comanda)

        setComandas(newComandas)
        toast.success('¡La comanda fue terminada exitosamente!')
        onShoot()
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
    }
  }

  return (
    <>
      <CardContainer className={cn('inter-var cursor-pointer')} onClick={handleFinishComanda}>
        <CardBody className={cn(
          'bg-gray-50 relative group/card hover:shadow-[-10px_-10px_30px_4px_rgba(255,51,102,0.438),_10px_10px_30px_4px_rgba(255,51,102,0.438)] dark:hover:shadow-[-10px_-10px_30px_4px_rgba(255,51,102,0.616),_10px_10px_30px_4px_rgba(255,51,102,0.616)] dark:bg-black w-[22rem] h-auto rounded-xl p-6 transition-all bg-grid-black dark:bg-grid-white'
        )}>
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-2-dark bg-color-background-2-light [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
          <CardItem
            translateZ="50"
            className="w-full text-[23px] text-center font-bold text-neutral-600 dark:text-white"
          >
            COMANDA # {numeroComanda}
          </CardItem>
          <CardItem
            translateZ="50"
            className="w-full text-[20px] text-center font-bold -mt-1 italic text-color-pink-primary-accent-dark"
          >
            (MESA {comanda.mesa})
          </CardItem>
          <CardItem
            translateZ="50"
            className="w-full text-[16px] text-center font-bold text-neutral-600 dark:text-white my-6"
          >
            <div className='w-full flex flex-col gap-2'>
              {
                comanda.menu.map((item, index) => (
                  <div key={item.id_comanda_menu} className='flex justify-between gap-2'>
                    <span className='text-left'><span className='text-color-pink-primary-accent-dark'>◼</span> {item.menu} ($ {item.precio_total})</span>
                    <span className='text-right'>x{item.cantidad}</span>
                  </div>
                ))
              }
            </div>
            <hr className='my-3'/>
            <div className='w-full flex flex-col'>
              <div className='flex justify-between gap-2'>
                <span className='text-left'>TOTAL</span>
                <span className='text-right'>$ {comanda.precio_total}</span>
              </div>
            </div>
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className={cn('text-center w-full mt-2 text-neutral-600 dark:text-white py-2 rounded-xl font-bold text-[18px]')}
          >
            <div className='w-full flex flex-col gap-1'>
              <div className='w-full flex items-center justify-between gap-2'>
                <span className='text-left'>Hora Comanda</span>
                <span className='font-orbitron-sans text-right'>
                  {getHourComanda()}
                </span>
              </div>
              <div className='w-full flex items-center justify-between gap-2'>
                <span className='text-left'>Tiempo Transcurrido</span>
                <span className='font-orbitron-sans text-right'>
                  { chronometer }
                </span>
              </div>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </>
  )
}
