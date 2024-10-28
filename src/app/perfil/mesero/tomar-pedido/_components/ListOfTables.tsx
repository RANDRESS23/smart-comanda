'use client'

import { useMesasTotales } from '@/hooks/useMesas'
import { CardTable } from './CardTable'

export const ListOfTables = () => {
  const { mesasTotales, setEstadosMesas } = useMesasTotales()

  return (
    <section className='w-full z-10 flex flex-row flex-wrap justify-center items-center gap-10 pb-10'>
      {
        mesasTotales.map((mesa, index) => (
          <CardTable
            key={index}
            numeroMesa={mesa.numero_mesa}
            idMesa={mesa.id_mesa}
            setEstadosMesas={setEstadosMesas}
          />
        ))
      }
    </section>
  )
}
