'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar'
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt
} from '@tabler/icons-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/libs/utils'
import symbolSmartComanda from '@/assets/symbol-smart-comanda.webp'

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
  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: 'Profile',
      href: '#',
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: 'Settings',
      href: '#',
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: 'Logout',
      href: '#',
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    }
  ]
  const [open, setOpen] = useState(false)

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
                label: 'Manu Arora',
                href: '#',
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
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
