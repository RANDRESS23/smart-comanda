'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/Input'
import { IoEyeOff } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'
import { Button } from '@/components/Button'
import { signInSchema } from '@/app/api/administradores/schema'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import api from '@/libs/api'
import { type Mesero } from '@/types/meseros'
import { type Cajero } from '@/types/cajeros'
import { createClient } from '@/utils/supabase/client'
import { useEmailsAdmin } from '@/hooks/useEmailsAdmin'
import { useEmailsMeseros } from '@/hooks/useEmailsMeseros'
import { useEmailsCajeros } from '@/hooks/useEmailsCajeros'
import { useAdministrador } from '@/hooks/useAdministrador'
import { useMesero } from '@/hooks/useMesero'
import { useCajero } from '@/hooks/useCajero'
import { type Administrador } from '@/types/administradores'
import Image from 'next/image'
import logoSmartComandaDark from '@/assets/logo-smart-comanda-dark.webp'
import logoSmartComandaLight from '@/assets/logo-smart-comanda-light.webp'

/* ➡ Este componente es el que se renderiza el formulario principal de la pagina "Iniciar Sesión" del aplicativo */
export const FormSignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmResponse, setIsConfirmResponse] = useState(false)
  const { emailsAdmin } = useEmailsAdmin()
  const { emailsMeseros } = useEmailsMeseros()
  const { emailsCajeros } = useEmailsCajeros()
  const { setAdministrador } = useAdministrador()
  const { setMesero } = useMesero()
  const { setCajero } = useCajero()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      correo: '',
      clave: ''
    },
    resolver: zodResolver(signInSchema)
  })

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: data.correo,
        password: data.clave
      })

      if (error) {
        console.log({ error })

        return toast.error('!El correo electrónico o la contraseña son incorrectos!')
      }

      const isAdmin = emailsAdmin.includes(data.correo as string)
      const isMesero = emailsMeseros.includes(data.correo as string)
      const isCajero = emailsCajeros.includes(data.correo as string)

      if (isMesero) {
        const response = await api.post('/meseros/info', {
          correo: data.correo
        })

        setMesero(response.data.mesero as Mesero)
        setIsConfirmResponse(true)

        toast.success('¡Inicio de sesión exitosamente!')
        router.push('/perfil/mesero/inicio')
        router.refresh()
      } else if (isCajero) {
        const response = await api.post('/cajeros/info', {
          correo: data.correo
        })

        setCajero(response.data.cajero as Cajero)
        setIsConfirmResponse(true)

        toast.success('¡Inicio de sesión exitosamente!')
        router.push('/perfil/cajero/inicio')
        router.refresh()
      } else if (isAdmin) {
        const response = await api.post('/administradores/info', {
          correo: data.correo
        })

        setAdministrador(response.data.administrador as Administrador)
        setIsConfirmResponse(true)

        toast.success('¡Inicio de sesión exitosamente!')
        router.push('/perfil/admin/inicio')
        router.refresh()
      }
    } catch (error: any) {
      return toast.error('!El correo electrónico o la contraseña son incorrectos!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative bg-grid-black dark:bg-grid-white py-10 font-inter-sans flex flex-col justify-center items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-dark bg-color-background-light [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-[590px] mx-auto w-11/12 flex flex-col gap-5 bg-color-background-2-light dark:bg-color-background-2-dark px-5 py-10 md:px-10 border border-gray-400 dark:border-gray-600 my-10 rounded z-10'>

      <div className='w-full mb-2 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4'>
        <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-center font-extrabold text-3xl'>Iniciar Sesión en</span>
        <Image
          src={logoSmartComandaLight}
          alt='logo SmartComanda'
          width={130}
          height={130}
          className='flex dark:hidden w-20 md:w-14'
        />
        <Image
          src={logoSmartComandaDark}
          alt='logo SmartComanda'
          width={130}
          height={130}
          className='hidden dark:flex w-20 md:w-14'
        />
      </div>

        <Input
          type="email"
          label="Correo electrónico"
          isRequired
          name="correo"
          register={register}
          disabled={isLoading}
          endContent={
            <div className="pointer-events-none flex items-center h-full">
              <MdAlternateEmail className="text-2xl text-default-400 pointer-events-none" />
            </div>
          }
          errors={errors}
        />

        <Input
          type={passwordVisible ? 'text' : 'password'}
          label="Contraseña"
          isRequired
          name="clave"
          register={register}
          disabled={isLoading}
          endContent={
            <button className="focus:outline-none h-full" type="button" onClick={toggleVisibility}>
              {passwordVisible
                ? (
                <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )
                : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
            </button>
          }
          errors={errors}
        />
        <div className='flex justify-start items-center mb-4 z-10'>
          {/* <Link
            href="/forgot-password"
            className='text-sm text-primary hover:opacity-80 cursor-pointer transition-all'
          >
            ¿Has olvidado tu contraseña?
          </Link> */}
        </div>

        <Button
          type="submit"
          text={isLoading || isConfirmResponse ? 'Cargando...' : 'Iniciar sesión'}
          disabled={isLoading || isConfirmResponse}
        />
      </form>
    </div>
  )
}
