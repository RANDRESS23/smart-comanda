'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { MdPhoneIphone } from 'react-icons/md'
import { HiIdentification } from 'react-icons/hi2'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { createClient } from '@supabase/supabase-js'
import { cajerosDataSchema } from '@/app/api/cajeros/schema'
import { useCajero } from '@/hooks/useCajero'
import { InputControlled } from '@/components/Input/InputControlled'
import { useCajeros } from '@/hooks/useCajeros'
import { type Cajero } from '@/types/cajeros'

interface FormRegisterCashierProps {
  onClose: () => void
  onShoot: () => void
  supabaseUrl: string
  serviceRolKey: string
}

export const FormEditCashier = ({ onClose, onShoot, supabaseUrl, serviceRolKey }: FormRegisterCashierProps) => {
  const { cajero, loadingCajero } = useCajero()
  const { setCajeros } = useCajeros({})
  const [isLoading, setIsLoading] = useState(false)

  if (loadingCajero) return null

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      id_cajero: cajero.id_cajero,
      primer_nombre: cajero.primer_nombre,
      segundo_nombre: cajero.segundo_nombre,
      primer_apellido: cajero.primer_apellido,
      segundo_apellido: cajero.segundo_apellido,
      numero_documento: cajero.numero_documento,
      correo: cajero.correo,
      celular: cajero.celular
    },
    resolver: zodResolver(cajerosDataSchema)
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    try {
      setIsLoading(true)

      const isPossibleSubmit = data.primer_nombre !== cajero.primer_nombre ||
        data.segundo_nombre !== cajero.segundo_nombre ||
        data.primer_apellido !== cajero.primer_apellido ||
        data.segundo_apellido !== cajero.segundo_apellido ||
        data.numero_documento !== cajero.numero_documento ||
        data.correo !== cajero.correo ||
        data.celular !== cajero.celular

      if (!isPossibleSubmit) {
        onClose()

        return toast.success('¡Los datos siguen igual, por lo tanto no se ha realizado ningún cambio!')
      }

      const response = await api.put('/cajeros', data)

      if (response.status === 200) {
        const isModifiedEmail = data.correo !== cajero.correo

        if (isModifiedEmail) {
          const supabase = createClient(supabaseUrl, serviceRolKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })

          const { error } = await supabase.auth.admin.updateUserById(
            data.id_cajero as string,
            { email: data.correo }
          )

          if (error) {
            console.log({ error })

            return toast.error('¡Ocurrió un error al modificar el correo del cajero, verifica los datos!.')
          }
        }

        setCajeros(response.data.cajeros as Cajero[])
        onClose()
        onShoot()
        toast.success('¡Datos del cajero actualizados exitosamente!')
      }
    } catch (error: any) {
      if (error.response?.data !== undefined) {
        const errorsMessages = Object.values(error.response.data as Record<string, string>)
        let errorsMessagesString = ''

        errorsMessages.forEach((message: any) => {
          errorsMessagesString += `${message} ${'\n'}`
        })

        return toast.error(errorsMessagesString)
      }

      console.error({ error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative font-inter-sans flex flex-col justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-5'>
        <InputControlled
          type="text"
          label="Primer nombre"
          isRequired
          name="primer_nombre"
          control={control}
          disabled={isLoading}
          errors={errors}
        />

        <InputControlled
          type="text"
          label="Segundo nombre"
          isRequired={false}
          name="segundo_nombre"
          control={control}
          disabled={isLoading}
          errors={errors}
        />

        <InputControlled
          type="text"
          label="Primer apellido"
          isRequired
          name="primer_apellido"
          control={control}
          disabled={isLoading}
          errors={errors}
        />

        <InputControlled
          type="text"
          label="Segundo apellido"
          isRequired={false}
          name="segundo_apellido"
          control={control}
          disabled={isLoading}
          errors={errors}
        />

        <InputControlled
          type="number"
          label="Número de documento"
          isRequired
          name="numero_documento"
          control={control}
          disabled={isLoading}
          endContent={
            <div className="h-full flex justify-center items-center gap-1">
              <HiIdentification className="text-2xl text-default-400 pointer-events-none" />
              <div className="pointer-events-none flex items-center h-full">
                <span className="text-default-400 font-semibold text-small">C.C</span>
              </div>
            </div>
          }
          errors={errors}
        />

        <InputControlled
          type="text"
          label="Celular"
          isRequired
          name="celular"
          control={control}
          disabled={isLoading}
          endContent={
            <div className="h-full flex justify-center items-center">
              <MdPhoneIphone className="text-2xl text-default-400 pointer-events-none" />
            </div>
          }
          errors={errors}
        />

        <InputControlled
          type="email"
          label="Correo"
          isRequired
          name="correo"
          control={control}
          disabled={isLoading}
          errors={errors}
        />

        <Button
          type="submit"
          text={isLoading ? 'Cargando...' : 'Modificar Cajero'}
          disabled={isLoading}
        />
        <Button
          type="button"
          text='Cancelar Modificación'
          disabled={isLoading}
          onClick={onClose}
        />
      </form>
    </div>
  )
}
