import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const cajeros = await db.cajeros.findMany()
    const emailsCajeros = cajeros.map((cajero) => cajero.correo)

    return NextResponse.json({ emailsCajeros })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
