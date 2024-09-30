'use client'

import { useEffect, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { FaSortAmountUpAlt } from 'react-icons/fa'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { totalMesasSchema } from '@/app/api/mesas/schema'
import { type Mesas } from '@/types/mesas'
import { useMesasTotales } from '@/hooks/useMesas'
import { Skeleton } from '@nextui-org/react'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { ButtonLitUpBorders } from '@/components/Button/ButtonLitUpBoders'
import { InputControlled } from '@/components/Input/InputControlled'

export const FormDefineTables = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { mesasTotales, loadingMesasTotales, setMesasTotales } = useMesasTotales()
  const [editAmount, setEditAmount] = useState(true)
  const { onInitHandler, onShoot } = useConfetti()

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      total_mesas: mesasTotales.length === 0 ? '' : mesasTotales.length.toString()
    },
    resolver: zodResolver(totalMesasSchema)
  })

  useEffect(() => {
    setEditAmount(mesasTotales.length === 0)

    if (mesasTotales.length !== 0) {
      setValue('total_mesas', mesasTotales.length.toString(), {
        shouldValidate: true,
        shouldDirty: true
      })
    }
  }, [mesasTotales])

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    try {
      setIsLoading(true)

      if (mesasTotales.length !== 0) {
        const isPossibleSubmit = mesasTotales.length !== Number(data.total_mesas)

        if (!isPossibleSubmit) {
          return toast.success('¡La cantidad de mesas sigue igual, por lo tanto no se ha realizado ningún cambio!')
        }

        const response = await api.put('/mesas', {
          total_mesas: data.total_mesas
        })

        if (response.status === 201) {
          const { mesasTotales } = response.data

          setMesasTotales(mesasTotales as Mesas[])

          toast.success('¡Cantidad de mesas actualizada exitosamente!')
          onShoot()
        }
      } else {
        const response = await api.post('/mesas', {
          total_mesas: data.total_mesas
        })

        if (response.status === 201) {
          const { mesasTotales } = response.data

          setMesasTotales(mesasTotales as Mesas[])

          toast.success('¡Cantidad de mesas asignada exitosamente!')
          onShoot()
        }
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
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
      setEditAmount(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full lg:w-[420px] flex flex-col justify-center items-center font-inter-sans mb-3 bg-color-background-2-light dark:bg-color-background-2-dark px-5 py-10 rounded'>
        {
          !loadingMesasTotales
            ? (
                <div className='flex flex-col justify-center items-center gap-5'>
                  <InputControlled
                    type="number"
                    control={control}
                    label="Cantidad de Mesas"
                    isRequired
                    name="total_mesas"
                    disabled={isLoading || !editAmount}
                    endContent={
                      <div className="h-full flex justify-center items-center">
                        <FaSortAmountUpAlt className="text-2xl text-default-400 pointer-events-none" />
                      </div>
                    }
                    errors={errors}
                  />

                  <Button
                    type="submit"
                    text={
                      isLoading
                        ? 'Cargando...'
                        : mesasTotales.length !== 0
                          ? 'Actualizar Cantidad'
                          : 'Registrar Cantidad'
                    }
                    disabled={isLoading || !editAmount}
                  />

                  {
                    (mesasTotales.length !== 0 && !editAmount) && (
                      <Button
                        type="button"
                        text='Editar cantidad de mesas'
                        disabled={false}
                        onClick={() => { setEditAmount(true) }}
                      />
                    )
                  }

                  {
                    (mesasTotales.length !== 0 && editAmount) && (
                      <ButtonLitUpBorders
                        type="button"
                        text='Cancelar'
                        disabled={isLoading}
                        onClick={() => { setEditAmount(false) }}
                      />
                    )
                  }
                </div>
              )
            : (
                <div className='w-full flex flex-col justify-center items-center gap-5'>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                </div>
              )
        }
      </form>
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
