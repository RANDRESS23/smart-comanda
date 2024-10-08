import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const { correo } = body

    const mesero = await db.meseros.findUnique({
      where: { correo }
    })

    if (mesero === null) {
      return NextResponse.json(
        { message: '¡El correo ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: mesero.id_tipo_documento },
      select: { tipo_documento: true }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: mesero.id_sexo },
      select: { sexo: true }
    })

    const { clave: _, ...meseroWithoutClave } = mesero

    return NextResponse.json(
      {
        mesero: { ...meseroWithoutClave, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo },
        message: '¡Datos validados correctamente!'
      },
      { status: 200 }
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
