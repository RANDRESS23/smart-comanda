import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { idMesa: string } }) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (!isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const { idMesa }: { idMesa: string } = params

    const comanda = await db.comandas.findMany({
      where: { id_mesa: idMesa },
      orderBy: { createdAt: 'desc' },
      take: 1,
      select: { id_comanda: true }
    })

    if (comanda.length === 0) {
      return NextResponse.json(
        { message: 'No hay comanda registrada para esta mesa.' },
        { status: 404 }
      )
    }

    const comandaMenus = await db.comandas_Menus.findMany({
      where: { id_comanda: comanda[0]?.id_comanda },
      select: {
        id_menu: true,
        cantidad: true,
        precio_total: true
      }
    })

    const comandaMenu = comandaMenus.map((menu) => ({
      id_menu: menu.id_menu,
      cantidad: menu.cantidad,
      precio: menu.precio_total
    }))

    return NextResponse.json({ comandaMenu, idComanda: comanda[0].id_comanda }, { status: 200 })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
