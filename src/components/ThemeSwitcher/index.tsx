'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MdWbSunny } from 'react-icons/md'
import { TbMoonFilled } from 'react-icons/tb'

/* ➡ Componente que renderiza el switch para cambiar el tema del aplicativo (light | dark) */
export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      {
        theme === 'dark'
          ? (
              <button onClick={() => { setTheme('light') }} className='text-2xl text-white hover:text-color-pink-primary-light dark:hover:text-color-pink-primary-dark flex justify-center items-center transition-all'>
                <MdWbSunny />
              </button>
            )
          : (
              <button onClick={() => { setTheme('dark') }} className='text-2xl text-white hover:text-color-pink-primary-light dark:hover:text-color-pink-primary-dark flex justify-center items-center transition-all'>
                <TbMoonFilled />
              </button>
            )
      }
    </div>
  )
}
