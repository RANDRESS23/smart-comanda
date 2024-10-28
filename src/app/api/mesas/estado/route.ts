import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const estadosMesasDB = await db.estados_Mesas.findMany()
    const estados = await db.estados.findMany()
    const estadosMesas = estadosMesasDB.map((estadoMesa) => ({
      id_estado_mesa: estadoMesa.id_estado_mesa,
      id_mesa: estadoMesa.id_mesa,
      id_estado: estadoMesa.id_estado,
      createdAt: estadoMesa.createdAt,
      updatedAt: estadoMesa.updatedAt,
      estado: estados.find((estado) => estado.id_estado === estadoMesa.id_estado)?.estado
    }))

    return NextResponse.json({ estadosMesas })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
