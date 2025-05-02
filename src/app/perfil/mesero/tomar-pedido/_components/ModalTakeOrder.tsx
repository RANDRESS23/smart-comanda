import { useConfetti } from '@/hooks/useConfetti'
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react'
import Image from 'next/image'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import logoSmartComandaDark from '@/assets/logo-smart-comanda-dark.webp'
import logoSmartComandaLight from '@/assets/logo-smart-comanda-light.webp'
import { FormTakeOrder } from './FormTakeOrder'
import { ModalResumeOrder } from './ModalResumeOrder'
import { useState } from 'react'
import { type MenuComanda } from '@/types/menus'

interface ModalTakeOrderProps {
  idMesa: string
  isOpen: boolean
  isEditComanda: boolean
  numeroMesa: number
  onClose: () => void
  onOpen3: () => void
  setEstadosMesas: (value: any) => void
  setIsEditComanda: (value: any) => void
}

export const ModalTakeOrder = ({ idMesa, isOpen, isEditComanda, numeroMesa, onClose, onOpen3, setEstadosMesas, setIsEditComanda }: ModalTakeOrderProps) => {
  const { onInitHandler, onShoot } = useConfetti()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const [comandaResume, setComandaResume] = useState(null)
  const [comanda, setComanda] = useState<MenuComanda[]>([])

  return (
    <>
      <Modal placement='top' backdrop='blur' size='xl' isOpen={isOpen} onClose={onClose} className='border border-color-background-dark dark:border-color-background-light font-inter-sans'>
        <ModalContent>
          {(onClose) => (
            <>
              <div className='relative dark:bg-color-background-2-dark bg-color-background-2-light'>
                <ModalHeader className="flex justify-between items-center gap-1">
                  <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-left font-extrabold text-[30px] z-10 pb-7 w-full bg-green-400 pt-5'>
                    {isEditComanda ? 'Actualizar' : 'Tomar'} <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Pedido</span>
                  </span>
                  <Image
                    src={logoSmartComandaLight}
                    alt='logo SmartComanda'
                    width={130}
                    height={130}
                    className='flex dark:hidden w-14 z-10'
                  />
                  <Image
                    src={logoSmartComandaDark}
                    alt='logo SmartComanda'
                    width={130}
                    height={130}
                    className='hidden dark:flex w-14 z-10'
                  />
                </ModalHeader>
                <hr className='-mt-2 mb-3 w-[88%] mx-auto border-black dark:border-white z-10' />
                <ModalBody className='mb-3 max-h-[70vh] overflow-y-auto'>
                  <FormTakeOrder
                    idMesa={idMesa}
                    numeroMesa={numeroMesa}
                    isEditComanda={isEditComanda}
                    comanda={comanda}
                    onOpen2={onOpen2}
                    onClose={onClose}
                    setComandaResume={setComandaResume}
                    setComanda={setComanda}
                  />
                </ModalBody>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      <Realistic onInit={onInitHandler} />
      <ModalResumeOrder
        idMesa={idMesa}
        isOpen={isOpen2}
        isEditComanda={isEditComanda}
        onClose2={onClose2}
        onClose={onClose}
        onOpen3={onOpen3}
        onShoot={onShoot}
        comandaResume={comandaResume}
        comanda={comanda}
        setEstadosMesas={setEstadosMesas}
        setIsEditComanda={setIsEditComanda}
      />
    </>
  )
}
