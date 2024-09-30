import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react'
import Image from 'next/image'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { useConfetti } from '@/hooks/useConfetti'
import { FormEditWaiter } from './FormEditWaiter'
import logoSmartComandaDark from '@/assets/logo-smart-comanda-dark.webp'
import logoSmartComandaLight from '@/assets/logo-smart-comanda-light.webp'

interface ModalRegisterWaiterProps {
  isOpen: boolean
  onClose: () => void
  supabaseUrl: string
  serviceRolKey: string
}

export const ModalEditWaiter = ({
  isOpen, onClose, supabaseUrl, serviceRolKey
}: ModalRegisterWaiterProps) => {
  const { onInitHandler, onShoot } = useConfetti()

  return (
    <>
      <Modal placement='top' backdrop='blur' size='xl' isOpen={isOpen} onClose={onClose} className='border border-color-background-dark dark:border-color-background-light font-inter-sans'>
        <ModalContent>
          {(onClose) => (
            <>
              <div className='relative dark:bg-color-background-2-dark bg-color-background-2-light'>
                <ModalHeader className="flex justify-between items-center gap-1">
                  <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-left font-extrabold text-[30px] z-10 pb-7 w-full bg-green-400 pt-5'>
                    Editar <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>Mesero</span>
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
                <ModalBody className='mb-3'>
                  <hr className='-mt-2 mb-3 border-black dark:border-white z-10' />
                  <FormEditWaiter
                    onClose={onClose}
                    onShoot={onShoot}
                    supabaseUrl={supabaseUrl}
                    serviceRolKey={serviceRolKey}
                  />
                </ModalBody>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      <Realistic onInit={onInitHandler} />
    </>
  )
}
