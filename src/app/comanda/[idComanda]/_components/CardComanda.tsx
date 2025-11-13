'use client'

import { useState, useEffect } from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { cn } from '@/libs/utils'
import { type Comanda } from '@/types/comandas'
import { format } from '@formkit/tempo'
import { useComandas } from '@/hooks/useComandas'
import { useParams } from 'next/navigation'

export const CardComanda = () => {
  const [chronometer, setChronometer] = useState('00:00:00')
  const [comanda, setComanda] = useState<Comanda | null>(null)
  const [numeroComanda, setNumeroComanda] = useState<number | null>(null)
  const { comandas, loadingComandas } = useComandas()
  const params = useParams<{ idComanda: string }>()

  useEffect(() => {
    const comandaAux = comandas.find((comandaAux) => comandaAux.id_comanda === params.idComanda) ?? null
    const numeroComandaAux = comandas.findIndex((comandaAux) => comandaAux.id_comanda === params.idComanda) + 1

    setNumeroComanda(numeroComandaAux === 0 ? null : numeroComandaAux)
    setComanda(comandaAux)
  }, [comandas])

  useEffect(() => {
    const interval = setInterval(() => {
      const dateAux = new Date()
      // dateAux.setUTCHours(dateAux.getUTCHours() - 5)
      const currentDate = new Date(dateAux.toString())

      const dateAux2 = new Date(comanda?.createdAt ?? 0)
      dateAux2.setUTCHours(dateAux2.getUTCHours() + 5)
      const comandaCreatedAt = new Date(dateAux2.toString())

      const diff = currentDate.getTime() - comandaCreatedAt.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setChronometer(`${hours >= 10 ? hours : `0${hours}`}:${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}`)
    }, 1000)

    return () => { clearInterval(interval) }
  }, [comanda])

  const getHourComanda = () => {
    const dateAux = new Date(comanda?.createdAt ?? 0)
    dateAux.setUTCHours(dateAux.getUTCHours() + 5)
    const hour = new Date(dateAux.toString())

    return format(hour, 'h:mm A', 'es')
  }

  if (loadingComandas) {
    return <div className='w-full h-full flex items-center justify-center text-2xl font-bold z-10 py-32'>Cargando...</div>
  }

  if (!comanda) {
    return <div className='w-full h-full flex items-center justify-center text-2xl font-bold z-10 py-32'>No se encontró la comanda</div>
  }

  return (
    <>
      <CardContainer className={cn('inter-var')}>
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
            className="w-full text-[12px] text-center font-bold -mt-1 italic text-color-pink-primary-accent-dark animate-pulse"
          >
            Preparando...
          </CardItem>
          <CardItem
            translateZ="50"
            className="w-full text-[16px] text-center font-bold text-neutral-600 dark:text-white my-6"
          >
            <div className='w-full flex flex-col gap-2 mb-3 border-b-2 border-color-pink-primary-accent-dark pb-3'>
              {
                comanda.menu.map((item, index) => (
                  <div key={item.id_comanda_menu} className='flex justify-between gap-2'>
                    <span className='text-left'><span className='text-color-pink-primary-accent-dark'>◼</span> {item.menu} ($ {item.precio_total})</span>
                    <span className='text-right'>x{item.cantidad}</span>
                  </div>
                ))
              }
            </div>
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
