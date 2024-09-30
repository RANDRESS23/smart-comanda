'use client'

import { useCajero } from '@/hooks/useCajero'
import Image from 'next/image'
import logoSmartComandaDark from '@/assets/logo-smart-comanda-dark.webp'
import logoSmartComandaLight from '@/assets/logo-smart-comanda-light.webp'

export const WelcomeCajero = () => {
  const { cajero } = useCajero()

  const firstName = `${cajero.primer_nombre[0]?.toUpperCase() ?? ''}${cajero.primer_nombre?.slice(1) ?? ''}`
  const lastName = `${cajero.primer_apellido[0]?.toUpperCase() ?? ''}${cajero.primer_apellido?.slice(1) ?? ''}`

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className='w-full flex flex-col justify-center items-center gap-4 -mt-[60px]'>
        <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-center font-extrabold text-5xl'>
          Bienvenido <span className='bg-clip-text text-transparent bg-gradient-to-b from-color-pink-primary-dark to-color-pink-primary-accent-dark'>{firstName} {lastName}</span> a
        </span>
        <Image
          src={logoSmartComandaLight}
          alt='logo SmartComanda'
          width={130}
          height={130}
          className='flex dark:hidden w-52'
        />
        <Image
          src={logoSmartComandaDark}
          alt='logo SmartComanda'
          width={130}
          height={130}
          className='hidden dark:flex w-52'
        />
      </div>
    </div>
  )
}
