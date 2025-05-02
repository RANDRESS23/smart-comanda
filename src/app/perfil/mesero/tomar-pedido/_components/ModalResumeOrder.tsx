import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import Image from 'next/image'
import logoSmartComandaDark from '@/assets/logo-smart-comanda-dark.webp'
import logoSmartComandaLight from '@/assets/logo-smart-comanda-light.webp'
import { ResumeOrder } from './ResumeOrder'
import { type ComandaResume } from '@/types/comandas'
import { type MenuComanda } from '@/types/menus'

interface ModalResumeOrderProps {
  idMesa: string
  isOpen: boolean
  isEditComanda: boolean
  comandaResume: ComandaResume | null
  comanda: MenuComanda[]
  onClose2: () => void
  onClose: () => void
  onOpen3: () => void
  onShoot: () => void
  setEstadosMesas: (value: any) => void
  setIsEditComanda: (value: any) => void
}

export const ModalResumeOrder = ({ idMesa, isOpen, isEditComanda, comandaResume, comanda, onShoot, onClose, onOpen3, onClose2, setEstadosMesas, setIsEditComanda }: ModalResumeOrderProps) => {
  return (
    <>
      <Modal placement='top' backdrop='blur' size='xl' isOpen={isOpen} onClose={onClose2} className='border border-color-background-dark dark:border-color-background-light font-inter-sans'>
        <ModalContent>
          {(onClose2) => (
            <>
              <div className='relative dark:bg-color-background-2-dark bg-color-background-2-light'>
                <ModalHeader className="flex justify-between items-center gap-1">
                  <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-left font-extrabold text-[30px] z-10 pb-7 w-full bg-green-400 pt-5'>
                    Resumen del <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Pedido</span>
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
                  <ResumeOrder
                    idMesa={idMesa}
                    isEditComanda={isEditComanda}
                    onClose2={onClose2}
                    onClose={onClose}
                    onOpen3={onOpen3}
                    onShoot={onShoot}
                    setEstadosMesas={setEstadosMesas}
                    setIsEditComanda={setIsEditComanda}
                    comandaResume={comandaResume}
                    comanda={comanda}
                  />
                </ModalBody>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
