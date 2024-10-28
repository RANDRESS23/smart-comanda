import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'
import { totalMesasSchema } from './schema'
import { db } from '@/libs/prismaDB'

export async function GET () {
  try {
    const mesasTotales = await db.mesas.findMany()

    return NextResponse.json({ mesasTotales })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const isValidateAccessAPI = await validateAccessAPI()

    if (!isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const {
      total_mesas: totalMesas
    } = totalMesasSchema.parse(body)

    const estadosMesas = await db.estados_Mesas.findMany()
    const estados = await db.estados.findMany()
    let isValidUpdateMesas = true

    estadosMesas.forEach(({ id_estado: idEstado }) => {
      if (idEstado !== estados[0].id_estado) {
        isValidUpdateMesas = false
      }
    })

    if (!isValidUpdateMesas) {
      return NextResponse.json(
        { messsage: '¡No puedes actualizar la cantidad de mesas cuando hay mesas ocupadas en este momento!' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    let mesas = await db.mesas.findMany({
      orderBy: {
        numero_mesa: 'asc'
      }
    })

    if (mesas.length === Number(totalMesas)) {
      return NextResponse.json(
        { messsage: '¡La cantidad de mesas sigue igual, por lo tanto no se ha realizado ningún cambio!' },
        { status: 400 }
      )
    }

    if (mesas.length > Number(totalMesas)) {
      const mesasToDelete = mesas.slice(Number(totalMesas))

      for (const mesa of mesasToDelete) {
        await db.mesas.delete({
          where: {
            id_mesa: mesa.id_mesa
          }
        })
      }
    } else {
      const initialIndex = mesas.length === 0 ? 1 : mesas.length + 1

      for (let index = initialIndex; index <= Number(totalMesas); index++) {
        const newMesa = await db.mesas.create({
          data: {
            numero_mesa: index,
            createdAt: currentDate,
            updatedAt: currentDate
          }
        })

        await db.estados_Mesas.create({
          data: {
            id_mesa: newMesa.id_mesa,
            id_estado: estados[0].id_estado,
            createdAt: currentDate,
            updatedAt: currentDate
          }
        })
      }
    }

    mesas = await db.mesas.findMany({
      orderBy: {
        numero_mesa: 'asc'
      }
    })

    return NextResponse.json(
      { mesasTotales: mesas, message: 'Mesas updated successfully!' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error({ error })

    if (error?.errors !== null) {
      const errorsMessages: Record<string, string> = {}
      const { errors } = error

      errors.forEach(
        ({ message, path }: { message: string, path: string[] }) => {
          if (!Object.values(errorsMessages).includes(message)) {
            errorsMessages[path.join('')] = message
          }
        }
      )

      return NextResponse.json(errorsMessages, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
