'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/libs/utils'
import symbolSmartComanda from '@/assets/symbol-smart-comanda.webp'
import { useAdministrador } from '@/hooks/useAdministrador'
import { useMesero } from '@/hooks/useMesero'
import { useCajero } from '@/hooks/useCajero'

interface SideBarProps {
  children: ReactNode
  items: LinkProps[]
}

interface LinkProps {
  label: string
  href: string
  icon: React.JSX.Element
}

export default function SideBar ({ children, items }: SideBarProps) {
  const [open, setOpen] = useState(false)
  const { administrador } = useAdministrador()
  const { mesero } = useMesero()
  const { cajero } = useCajero()
  const userActive = administrador.id_administrador !== ''
    ? administrador
    : mesero.id_mesero !== ''
      ? mesero
      : cajero.id_cajero !== ''
        ? cajero
        : null

  const firstName = `${userActive?.primer_nombre[0]?.toUpperCase() ?? ''}${userActive?.primer_nombre?.slice(1) ?? ''}`
  const lastName = `${userActive?.primer_apellido[0]?.toUpperCase() ?? ''}${userActive?.primer_apellido?.slice(1) ?? ''}`

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden',
        'fixed top-0 left-0 h-full pt-[65px] font-inter-sans'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-color-sidebar-light dark:bg-color-sidebar-dark">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {items.map((link, idx) => (
                <SidebarLink key={idx} link={link} className='text-red-600 group' />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${firstName} ${lastName}`,
                href: '/',
                icon: (
                  <Image
                    src={userActive?.sexo === 'Masculino' ? 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980427/svgs/male-icon_hmnyeh.svg' : 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980438/svgs/female-icon_zktpzk.svg'}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                )
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  )
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 group"
    >
      <Image
        src={symbolSmartComanda}
        alt='Icono SmartComanda'
        width={130}
        height={130}
        className='flex w-5'
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre group-hover:text-color-pink-primary-light dark:group-hover:text-color-pink-primary-dark transition-colors duration-300"
      >
        INICIO
      </motion.span>
    </Link>
  )
}
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={symbolSmartComanda}
        alt='Icono SmartComanda'
        width={130}
        height={130}
        className='flex w-5'
      />
    </Link>
  )
}
