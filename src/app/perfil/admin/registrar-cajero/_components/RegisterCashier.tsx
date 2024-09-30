'use client'

import { Button, useDisclosure } from '@nextui-org/react'
import { UserIcon } from '../icons/UserIcon'
import { ModalRegisterCashier } from './ModalRegisterCashier'
import { PlusIcon } from '../icons/PlusIcon'

interface RegisterCashierProps {
  supabaseUrl: string
  serviceRolKey: string
}

export const RegisterCashier = ({ supabaseUrl, serviceRolKey }: RegisterCashierProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='w-full flex justify-center lg:justify-start mb-3 font-inter-sans'>
      <Button
        color="success"
        radius='sm'
        variant="bordered"
        startContent={
          <div className='flex justify-center items-center'>
            <UserIcon/>
            <PlusIcon className='-ml-2' />
          </div>
        }
        onClick={onOpen}
      >
        Registrar Nuevo Cajero
      </Button>
      <ModalRegisterCashier
        isOpen={isOpen}
        onClose={onClose}
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
    </div>
  )
}
