import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'

export async function PATCH (request: Request) {
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
      id_cajero: idCajero,
      estadoNuevo
    } = body

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const estado = await db.estados.findFirst({
      where: { estado: estadoNuevo },
      select: { id_estado: true }
    })

    if (estado === null) {
      return NextResponse.json(
        { message: '¡No se encontró el estado a cambiar del cajero!' },
        { status: 400 }
      )
    }

    const cajeroEstadoUpdated = await db.estados_Cajeros.updateMany({
      data: { id_estado: estado.id_estado, updatedAt: currentDate },
      where: { id_cajero: idCajero }
    })

    if (cajeroEstadoUpdated.count === 0) {
      return NextResponse.json(
        { message: '¡No se encontró al cajero para cambiar su estado!' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: '¡El cambio de estado se modificó exitosamente al cajero!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
