import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET () {
  try {
    const meseros = await db.meseros.findMany()
    const emailsMeseros = meseros.map((mesero) => mesero.correo)

    return NextResponse.json({ emailsMeseros })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
