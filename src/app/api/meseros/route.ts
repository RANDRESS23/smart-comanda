import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { meserosDataSchema, meserosSchema } from './schema'
import { NextResponse } from 'next/server'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function GET (request: Request) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (!isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page')
    const rows = searchParams.get('rows')

    if (page === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "page" es requerido!' },
        { status: 400 }
      )
    }

    if (rows === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "rows" es requerido!' },
        { status: 400 }
      )
    }

    const meserosTotal = await db.meseros.findMany()
    const totalMeseros = await Promise.all(meserosTotal.map(async mesero => {
      const estadoMesero = await db.estados_Meseros.findFirst({
        where: { id_mesero: mesero.id_mesero },
        select: { id_estado: true }
      })

      const estado = await db.estados.findUnique({
        where: { id_estado: estadoMesero?.id_estado },
        select: { estado: true }
      })

      return { ...mesero, estado: estado?.estado ?? '' }
    }))

    const meseros = meserosTotal.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const meserosBD = await Promise.all(meseros.map(async (mesero) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: mesero.id_sexo },
        select: { sexo: true }
      })

      const estadoMeseroPromise = await db.estados_Meseros.findFirst({
        where: { id_mesero: mesero.id_mesero },
        select: { id_estado: true }
      })

      const [
        sexo,
        estado
      ] = await Promise.all([
        sexoPromise,
        estadoMeseroPromise
      ])

      const estadoMesero = await db.estados.findUnique({
        where: { id_estado: estado?.id_estado },
        select: { estado: true }
      })

      return {
        ...mesero, sexo: sexo?.sexo, estado: estadoMesero?.estado
      }
    }))

    return NextResponse.json({
      meseros: meserosBD,
      totalMeseros,
      meserosCount: meserosTotal.length
    })
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
      id_mesero: idMesero,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      clave,
      clave_2: clave2,
      id_sexo: idSexo,
      celular
    } = meserosSchema.parse(body)

    const existingMeseroDocumento = await db.meseros.findUnique({
      where: { numero_documento: numeroDocumento },
      select: { numero_documento: true }
    })

    if (existingMeseroDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingMeseroEmail = await db.meseros.findUnique({
      where: { correo },
      select: { correo: true }
    })

    if (existingMeseroEmail !== null) {
      return NextResponse.json(
        { messsage: '¡El correo electrónico ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    if (clave !== clave2) {
      return NextResponse.json(
        { messsage: '¡Las contraseñas no coinciden!' },
        { status: 400 }
      )
    }

    const rolMesero = await db.roles.findUnique({
      where: { rol: 'Mesero' },
      select: { id_rol: true }
    })

    const tiposDocumento = await db.tipos_Documento.findMany()

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    const newMesero = await db.meseros.create({
      data: {
        id_mesero: idMesero,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        id_tipo_documento: tiposDocumento[0].id_tipo_documento,
        numero_documento: numeroDocumento,
        correo,
        clave: hashedPassword,
        id_sexo: idSexo,
        celular,
        id_rol: rolMesero?.id_rol ?? '',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const estados = await db.estados.findMany()

    await db.estados_Meseros.create({
      data: {
        id_mesero: newMesero.id_mesero,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: newMesero.id_sexo },
      select: { sexo: true }
    })

    const estadoMesero = await db.estados_Meseros.findFirst({
      where: { id_mesero: newMesero.id_mesero },
      select: { id_estado: true }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoMesero?.id_estado },
      select: { estado: true }
    })

    const meserosAux = await db.meseros.findMany()
    const meseros = await Promise.all(meserosAux.map(async (mesero) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: mesero.id_sexo },
        select: { sexo: true }
      })

      const estadoMeseroPromise = await db.estados_Meseros.findFirst({
        where: { id_mesero: mesero.id_mesero },
        select: { id_estado: true }
      })

      const [
        sexo,
        estadoMesero
      ] = await Promise.all([
        sexoPromise,
        estadoMeseroPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoMesero?.id_estado },
        select: { estado: true }
      })

      const [
        estado
      ] = await Promise.all([
        estadoPromise
      ])

      return { ...mesero, sexo: sexo?.sexo, estado: estado?.estado }
    }))

    const { clave: _, ...mesero } = newMesero

    return NextResponse.json(
      {
        mesero: { ...mesero, sexo: sexo?.sexo, estado: estado?.estado },
        meseros,
        message: '¡Mesero registrado exitosamente!'
      },
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

export async function PUT (request: Request) {
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
      id_mesero: idMesero,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      celular
    } = meserosDataSchema.parse(body)

    const currentMesero = await db.meseros.findUnique({
      where: { id_mesero: idMesero },
      select: { numero_documento: true, correo: true, celular: true }
    })

    if (currentMesero?.numero_documento !== numeroDocumento) {
      const existingMeseroDocumento = await db.meseros.findUnique({
        where: { id_mesero: idMesero },
        select: { numero_documento: true }
      })

      if (existingMeseroDocumento !== null) {
        return NextResponse.json(
          { messsage: '¡El número de documento ya existe en la base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentMesero?.correo !== correo) {
      const existingMeseroEmail = await db.meseros.findUnique({
        where: { correo },
        select: { correo: true }
      })

      if (existingMeseroEmail !== null) {
        return NextResponse.json(
          { messsage: '¡El correo electrónico ya existe en la base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentMesero?.celular !== celular) {
      const existingMeseroCelular = await db.meseros.findUnique({
        where: { celular },
        select: { celular: true }
      })

      if (existingMeseroCelular !== null) {
        return NextResponse.json(
          { messsage: '¡El número de celular ya existe en nuestra base de datos!' },
          { status: 400 }
        )
      }
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const updatedMesero = await db.meseros.update({
      data: {
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        numero_documento: numeroDocumento,
        correo,
        celular,
        updatedAt: currentDate
      },
      where: { id_mesero: idMesero }
    })

    const estados = await db.estados.findMany()

    await db.estados_Meseros.updateMany({
      data: {
        id_mesero: updatedMesero.id_mesero,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      where: { id_mesero: idMesero }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: updatedMesero.id_sexo },
      select: { sexo: true }
    })

    const estadoMesero = await db.estados_Meseros.findFirst({
      where: { id_mesero: updatedMesero.id_mesero },
      select: { id_estado: true }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoMesero?.id_estado },
      select: { estado: true }
    })

    const meserosAux = await db.meseros.findMany()
    const meseros = await Promise.all(meserosAux.map(async (mesero) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: mesero.id_sexo },
        select: { sexo: true }
      })

      const estadoMeseroPromise = await db.estados_Meseros.findFirst({
        where: { id_mesero: mesero.id_mesero },
        select: { id_estado: true }
      })

      const [
        sexo,
        estadoMesero
      ] = await Promise.all([
        sexoPromise,
        estadoMeseroPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoMesero?.id_estado },
        select: { estado: true }
      })

      const [
        estado
      ] = await Promise.all([
        estadoPromise
      ])

      return { ...mesero, sexo: sexo?.sexo, estado: estado?.estado }
    }))

    const { clave: _, ...mesero } = updatedMesero

    return NextResponse.json(
      {
        mesero: { ...mesero, sexo: sexo?.sexo, estado: estado?.estado },
        meseros,
        message: '¡Mesero actualizado exitosamente!'
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
