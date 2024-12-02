'use client'

import { useComandas } from '@/hooks/useComandas'
import { CardComanda } from './CardComanda'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { useEffect } from 'react'

export const ListOfComandas = () => {
  const { comandas, getComandas, setComandas } = useComandas()
  const { onInitHandler, onShoot } = useConfetti()

  useEffect(() => {
    const interval = setInterval(() => {
      getComandas()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <section className='w-full z-10 flex flex-row flex-wrap justify-start items-center gap-10 pb-10'>
        {comandas.map((comanda, index) => (
          <CardComanda
            key={comanda.id_comanda}
            comanda={comanda}
            numeroComanda={index + 1}
            onShoot={onShoot}
            comandas={comandas}
            setComandas={setComandas}
          />
        ))}
      </section>
      <Realistic onInit={onInitHandler} />
    </>
  )
}
