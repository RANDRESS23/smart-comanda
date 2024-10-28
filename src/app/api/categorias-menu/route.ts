import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function GET () {
  try {
    const categoriasMenus = await db.categoria_Menus.findMany()

    return NextResponse.json({ categoriasMenus })
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

    const { categoria } = body

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newCategoriaMenu = await db.categoria_Menus.create({
      data: {
        categoria,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const categoriasMenus = await db.categoria_Menus.findMany()

    return NextResponse.json(
      { newCategoriaMenu, categoriasMenus, message: 'Category menu saved successfully!' },
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
