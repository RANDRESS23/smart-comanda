'use client'

import { useEffect, useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu } from '@nextui-org/react'
import { Link } from 'next-view-transitions'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { menuItems, menuItemsAdmin, menuItemsMesero, menuItemsCajero } from '@/constants/itemsNavBar'
import { cn } from '@/libs/utils'
import { NavBarMobile } from './NavBarMobile'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useAdministrador } from '@/hooks/useAdministrador'
import { ADMINISTRADOR_INITIAL_VALUES } from '@/initial-values/administrador'
import { useMesero } from '@/hooks/useMesero'
import { useCajero } from '@/hooks/useCajero'
import { MESERO_INITIAL_VALUES } from '@/initial-values/mesero'
import { CAJERO_INITIAL_VALUES } from '@/initial-values/cajero'
import logoHeaderSmartComanda from '@/assets/logo-header-smart-comanda.webp'
import { Button } from '../Button'

interface NavBarAppProps {
  user: any
  isAdmin: boolean
  isMesero: boolean
  isCajero: boolean
}

/* ➡ Componente que renderiza la parte principal del NavBar */
export const NavBarApp = ({ user, isAdmin, isMesero, isCajero }: NavBarAppProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSignOutButton, setShowSignOutButton] = useState(false)
  const [isSignOut, setIsSignOut] = useState(false)
  const { setAdministrador } = useAdministrador()
  const { setMesero } = useMesero()
  const { setCajero } = useCajero()
  const router = useRouter()

  const supabase = createClient()

  const signOut = async () => {
    try {
      setIsSignOut(true)

      await supabase.auth.signOut()

      setAdministrador(ADMINISTRADOR_INITIAL_VALUES)
      setMesero(MESERO_INITIAL_VALUES)
      setCajero(CAJERO_INITIAL_VALUES)

      toast.success('¡Cierre de sesión exitosamente!')
      router.push('/sign-in')
      router.refresh()
    } catch (error) {
      console.log({ error })
    } finally {
      setIsSignOut(false)
    }
  }

  const pathname = usePathname()

  useEffect(() => {
    if (user) setShowSignOutButton(true)
    else setShowSignOutButton(false)
  }, [user])

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className='fixed font-inter-sans bg-color-header-light dark:bg-color-header-dark' isBordered id='navBar'>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            href='/'
            className='flex justify-center items-center'
          >
            <Image
              src={logoHeaderSmartComanda}
              alt='logo SmartComanda'
              width={130}
              height={130}
              className='flex w-28'
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className='gap-2'>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {
          showSignOutButton
            ? (
                <NavbarItem className="hidden lg:flex">
                  <Button
                    type="button"
                    text={isSignOut ? 'CERRANDO..' : 'CERRAR SESIÓN'}
                    disabled={isSignOut}
                    onClick={signOut}
                  />
                </NavbarItem>
              )
            : (
                <>
                  <NavbarItem className="hidden lg:flex">
                    <Link
                      href="/sign-in"
                      className={cn(
                        'flex text-sm h-full w-full px-3 py-2.5 rounded-lg transition-colors duration-300 text-white font-semibold hover:text-color-pink-primary-light dark:hover:text-color-pink-primary-dark'
                      )}
                    >
                      INICIAR SESIÓN
                    </Link>
                  </NavbarItem>
                </>
              )
        }
      </NavbarContent>
      <NavbarMenu>
        {
          (pathname.includes('/perfil/mesero'))
            ? <NavBarMobile
                items={menuItemsMesero}
                pathname={pathname}
                setIsMenuOpen={setIsMenuOpen}
                isMenuItemsGeneral={false}
              />
            : (pathname.includes('/perfil/cajero'))
                ? <NavBarMobile
                    items={menuItemsCajero}
                    pathname={pathname}
                    setIsMenuOpen={setIsMenuOpen}
                    isMenuItemsGeneral={false}
                  />
                : (pathname.includes('/profile/admin'))
                    ? <NavBarMobile
                        items={menuItemsAdmin}
                        pathname={pathname}
                        setIsMenuOpen={setIsMenuOpen}
                        isMenuItemsGeneral={false}
                      />
                    : <NavBarMobile
                        items={menuItems}
                        pathname={pathname}
                        setIsMenuOpen={setIsMenuOpen}
                        isMenuItemsGeneral={true}
                      />
        }
      </NavbarMenu>
    </Navbar>
  )
}
