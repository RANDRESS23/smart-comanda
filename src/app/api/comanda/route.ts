import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { type MenuComanda } from '@/types/menus'
import { NextResponse } from 'next/server'

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
      idMesa,
      cantidadPersonas,
      comanda
    }: { idMesa: string, cantidadPersonas: number, comanda: MenuComanda[] } = body

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    let cantidadProductos = 0
    let precioTotal = 0

    comanda.forEach(({ cantidad, precio }) => {
      cantidadProductos += cantidad
      precioTotal += precio
    })

    const newComanda = await db.comandas.create({
      data: {
        cantidad_productos: cantidadProductos,
        precio_total: precioTotal,
        id_mesa: idMesa,
        cantidad_personas: cantidadPersonas,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    comanda.forEach(async ({ id_menu: idMenu, cantidad, precio }) => {
      await db.comandas_Menus.create({
        data: {
          id_comanda: newComanda.id_comanda,
          id_menu: idMenu,
          cantidad,
          precio_total: precio,
          createdAt: currentDate,
          updatedAt: currentDate
        }
      })
    })

    const estadoMesa = await db.estados_Mesas.findUnique({
      where: {
        id_mesa: idMesa
      }
    })
    const estados = await db.estados.findMany()

    await db.estados_Mesas.update({
      where: {
        id_estado_mesa: estadoMesa?.id_estado_mesa
      },
      data: {
        id_estado: estados[1].id_estado
      }
    })

    const estadosMesasDB = await db.estados_Mesas.findMany()
    const estadosMesas = estadosMesasDB.map((estadoMesa) => ({
      id_estado_mesa: estadoMesa.id_estado_mesa,
      id_mesa: estadoMesa.id_mesa,
      id_estado: estadoMesa.id_estado,
      createdAt: estadoMesa.createdAt,
      updatedAt: estadoMesa.updatedAt,
      estado: estados.find((estado) => estado.id_estado === estadoMesa.id_estado)?.estado
    }))

    return NextResponse.json(
      { estadosMesas, message: 'Comanda saved successfully!' },
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
