'use client'

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { useMesasTotales } from '@/hooks/useMesas'
import { cn } from '@/libs/utils'

export const TablesCount = () => {
  const { mesasTotales } = useMesasTotales()

  return (
    <CardContainer className="inter-var">
      <CardBody className={cn(
        'bg-gray-50 relative group/card hover:shadow-[-10px_-10px_30px_4px_rgba(255,51,102,0.438),_10px_10px_30px_4px_rgba(255,51,102,0.438)] dark:hover:shadow-[-10px_-10px_30px_4px_rgba(255,51,102,0.616),_10px_10px_30px_4px_rgba(255,51,102,0.616)] dark:bg-black w-auto sm:w-[25rem] h-auto rounded-xl p-6 transition-all bg-grid-black dark:bg-grid-white'
      )}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-2-dark bg-color-background-2-light [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
        <CardItem
          translateZ="50"
          className="w-full text-2xl text-center font-bold text-neutral-600 dark:text-white"
        >
          CANTIDAD DISPONIBLE DE MESAS
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-center text-sm w-full mt-2 text-p-light dark:text-p-dark"
        >
          Cantidad actual de las mesas para el restaurante.
        </CardItem>
        <CardItem
          translateZ="50"
          className="w-full text-6xl text-center font-bold text-neutral-600 dark:text-white my-11"
        >
          {mesasTotales.length}
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}
