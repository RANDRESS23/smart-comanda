'use client'

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { useMesasTotales } from '@/hooks/useMesas'
import { cn } from '@/libs/utils'
import { useDisclosure } from '@nextui-org/react'
import { ModalTakeOrder } from './ModalTakeOrder'
import { FaPencilAlt } from 'react-icons/fa'
import { useState } from 'react'

interface CardTableProps {
  numeroMesa: number
  idMesa: string
  setEstadosMesas: (value: any) => void
}

export const CardTable = ({ numeroMesa, idMesa, setEstadosMesas }: CardTableProps) => {
  const { estadosMesas } = useMesasTotales()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isEditComanda, setIsEditComanda] = useState(false)

  const handleEditComanda = () => {
    setIsEditComanda(true)
    onOpen()
  }

  return (
    <>
      <CardContainer className={cn('inter-var',
        estadosMesas?.find((mesa) => mesa.id_mesa === idMesa)?.estado === 'Inactivo' ? 'cursor-not-allowed' : 'cursor-pointer'
      )} onClick={estadosMesas?.find((mesa) => mesa.id_mesa === idMesa)?.estado === 'Inactivo' ? undefined : onOpen}>
        <CardBody className={cn(
          'bg-gray-50 relative group/card hover:shadow-[-10px_-10px_30px_4px_rgba(255,51,102,0.438),_10px_10px_30px_4px_rgba(255,51,102,0.438)] dark:hover:shadow-[-10px_-10px_30px_4px_rgba(255,51,102,0.616),_10px_10px_30px_4px_rgba(255,51,102,0.616)] dark:bg-black w-[12rem] h-auto rounded-xl p-6 transition-all bg-grid-black dark:bg-grid-white'
        )}>
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-2-dark bg-color-background-2-light [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
          <CardItem
            translateZ="50"
            className="w-full text-[23px] text-center font-bold text-neutral-600 dark:text-white"
          >
            MESA
          </CardItem>
          <CardItem
            translateZ="50"
            className="w-full text-5xl text-center font-bold text-neutral-600 dark:text-white my-8"
          >
            {numeroMesa}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className={cn('text-center text-sm w-full mt-2 text-white py-2 rounded-xl font-bold',
              estadosMesas?.find((mesa) => mesa.id_mesa === idMesa)?.estado === 'Inactivo' ? 'bg-bg-color-pink-primary-gradient-light dark:bg-bg-color-pink-primary-gradient-dark' : 'bg-green-600 dark:bg-green-600'
            )}
          >
            {
              estadosMesas?.find((mesa) => mesa.id_mesa === idMesa)?.estado === 'Inactivo' ? 'Ocupada' : 'Disponible'
            }
          </CardItem>
          {
            estadosMesas?.find((mesa) => mesa.id_mesa === idMesa)?.estado === 'Inactivo' &&
              (
                <CardItem
                  as="p"
                  translateZ="60"
                  className="absolute top-2 right-2 bg-background flex justify-center items-center rounded-full border border-neutral-600 dark:border-white w-9 h-9 group hover:bg-color-pink-primary-accent-dark cursor-pointer"
                  onClick={handleEditComanda}
                >
                  <FaPencilAlt className='text-neutral-600 dark:text-white group-hover:text-white' />
                </CardItem>
              )
          }
        </CardBody>
      </CardContainer>
      <ModalTakeOrder
        idMesa={idMesa}
        numeroMesa={numeroMesa}
        isOpen={isOpen}
        onClose={onClose}
        setEstadosMesas={setEstadosMesas}
        isEditComanda={isEditComanda}
      />
    </>
  )
}
