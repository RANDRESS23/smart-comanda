import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { fecha: string } }) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (!isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const fecha = new Date(params.fecha)
    const fechaInicioAux = new Date(fecha)
    const fechaFinAux = new Date(fecha.setDate(fechaInicioAux.getDate() + 1))

    const estados = await db.estados.findMany()
    const estadosComandas = await db.estados_Comandas.findMany({
      where: {
        id_estado: estados[0].id_estado,
        createdAt: {
          gte: fechaInicioAux,
          lte: fechaFinAux
        }
      }
    })
    const comandas = await db.comandas.findMany({
      where: {
        id_comanda: { in: estadosComandas.map(({ id_comanda: idComanda }) => idComanda) }
      }
    })

    if (comandas.length === 0) {
      return NextResponse.json(
        {
          almuerzosTotales: null,
          messsage: '¡No se encontraron comandas para la fecha del servicio!'
        },
        { status: 400 }
      )
    }

    const totalComandas = await Promise.all(comandas.map(async (comanda) => {
      const comandasMenuPromise = await db.comandas_Menus.findMany({
        where: { id_comanda: comanda.id_comanda }
      })

      const mesaPromise = await db.mesas.findUnique({
        where: { id_mesa: comanda.id_mesa }
      })

      const [
        comandasMenu,
        mesa
      ] = await Promise.all([
        comandasMenuPromise,
        mesaPromise
      ])

      const totalMenu = await Promise.all(comandasMenu.map(async (comandaMenu) => {
        const menu = await db.menus.findUnique({
          where: { id_menu: comandaMenu.id_menu }
        })

        return { ...comandaMenu, menu: menu?.producto }
      }))

      return {
        ...comanda,
        mesa: mesa?.numero_mesa,
        menu: totalMenu
      }
    }))

    return NextResponse.json({
      comandas: totalComandas
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
