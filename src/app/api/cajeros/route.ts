import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { cajerosDataSchema, cajerosSchema } from './schema'
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

    const cajerosTotal = await db.cajeros.findMany()
    const totalCajeros = await Promise.all(cajerosTotal.map(async cajero => {
      const estadoCajero = await db.estados_Cajeros.findFirst({
        where: { id_cajero: cajero.id_cajero },
        select: { id_estado: true }
      })

      const estado = await db.estados.findUnique({
        where: { id_estado: estadoCajero?.id_estado },
        select: { estado: true }
      })

      return { ...cajero, estado: estado?.estado ?? '' }
    }))

    const cajeros = cajerosTotal.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const cajerosBD = await Promise.all(cajeros.map(async (cajero) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: cajero.id_sexo },
        select: { sexo: true }
      })

      const estadoCajeroPromise = await db.estados_Cajeros.findFirst({
        where: { id_cajero: cajero.id_cajero },
        select: { id_estado: true }
      })

      const [
        sexo,
        estado
      ] = await Promise.all([
        sexoPromise,
        estadoCajeroPromise
      ])

      const estadoCajero = await db.estados.findUnique({
        where: { id_estado: estado?.id_estado },
        select: { estado: true }
      })

      return {
        ...cajero, sexo: sexo?.sexo, estado: estadoCajero?.estado
      }
    }))

    return NextResponse.json({
      cajeros: cajerosBD,
      totalCajeros,
      cajerosCount: cajerosTotal.length
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
      id_cajero: idCajero,
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
    } = cajerosSchema.parse(body)

    const existingCajeroDocumento = await db.cajeros.findUnique({
      where: { numero_documento: numeroDocumento },
      select: { numero_documento: true }
    })

    if (existingCajeroDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingCajeroEmail = await db.cajeros.findUnique({
      where: { correo },
      select: { correo: true }
    })

    if (existingCajeroEmail !== null) {
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

    const rolCajero = await db.roles.findUnique({
      where: { rol: 'Cajero' },
      select: { id_rol: true }
    })

    const tiposDocumento = await db.tipos_Documento.findMany()

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    const newCajero = await db.cajeros.create({
      data: {
        id_cajero: idCajero,
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
        id_rol: rolCajero?.id_rol ?? '',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const estados = await db.estados.findMany()

    await db.estados_Cajeros.create({
      data: {
        id_cajero: newCajero.id_cajero,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: newCajero.id_sexo },
      select: { sexo: true }
    })

    const estadoCajero = await db.estados_Cajeros.findFirst({
      where: { id_cajero: newCajero.id_cajero },
      select: { id_estado: true }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoCajero?.id_estado },
      select: { estado: true }
    })

    const cajerosAux = await db.cajeros.findMany()
    const cajeros = await Promise.all(cajerosAux.map(async (cajero) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: cajero.id_sexo },
        select: { sexo: true }
      })

      const estadoCajeroPromise = await db.estados_Cajeros.findFirst({
        where: { id_cajero: cajero.id_cajero },
        select: { id_estado: true }
      })

      const [
        sexo,
        estadoCajero
      ] = await Promise.all([
        sexoPromise,
        estadoCajeroPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoCajero?.id_estado },
        select: { estado: true }
      })

      const [
        estado
      ] = await Promise.all([
        estadoPromise
      ])

      return { ...cajero, sexo: sexo?.sexo, estado: estado?.estado }
    }))

    const { clave: _, ...cajero } = newCajero

    return NextResponse.json(
      {
        cajero: { ...cajero, sexo: sexo?.sexo, estado: estado?.estado },
        cajeros,
        message: '¡Cajero registrado exitosamente!'
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
      id_cajero: idCajero,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      celular
    } = cajerosDataSchema.parse(body)

    const currentCajero = await db.cajeros.findUnique({
      where: { id_cajero: idCajero },
      select: { numero_documento: true, correo: true, celular: true }
    })

    if (currentCajero?.numero_documento !== numeroDocumento) {
      const existingCajeroDocumento = await db.cajeros.findUnique({
        where: { id_cajero: idCajero, numero_documento: numeroDocumento },
        select: { numero_documento: true }
      })

      if (existingCajeroDocumento !== null) {
        return NextResponse.json(
          { messsage: '¡El número de documento ya existe en la base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentCajero?.correo !== correo) {
      const existingCajeroEmail = await db.cajeros.findUnique({
        where: { correo },
        select: { correo: true }
      })

      if (existingCajeroEmail !== null) {
        return NextResponse.json(
          { messsage: '¡El correo electrónico ya existe en la base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentCajero?.celular !== celular) {
      const existingCajeroCelular = await db.cajeros.findUnique({
        where: { celular },
        select: { celular: true }
      })

      if (existingCajeroCelular !== null) {
        return NextResponse.json(
          { messsage: '¡El número de celular ya existe en nuestra base de datos!' },
          { status: 400 }
        )
      }
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const updatedCajero = await db.cajeros.update({
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
      where: { id_cajero: idCajero }
    })

    const estados = await db.estados.findMany()

    await db.estados_Cajeros.updateMany({
      data: {
        id_cajero: updatedCajero.id_cajero,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      where: { id_cajero: idCajero }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: updatedCajero.id_sexo },
      select: { sexo: true }
    })

    const estadoCajero = await db.estados_Cajeros.findFirst({
      where: { id_cajero: updatedCajero.id_cajero },
      select: { id_estado: true }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoCajero?.id_estado },
      select: { estado: true }
    })

    const cajerosAux = await db.cajeros.findMany()
    const cajeros = await Promise.all(cajerosAux.map(async (cajero) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: cajero.id_sexo },
        select: { sexo: true }
      })

      const estadoCajeroPromise = await db.estados_Cajeros.findFirst({
        where: { id_cajero: cajero.id_cajero },
        select: { id_estado: true }
      })

      const [
        sexo,
        estadoCajero
      ] = await Promise.all([
        sexoPromise,
        estadoCajeroPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoCajero?.id_estado },
        select: { estado: true }
      })

      const [
        estado
      ] = await Promise.all([
        estadoPromise
      ])

      return { ...cajero, sexo: sexo?.sexo, estado: estado?.estado }
    }))

    const { clave: _, ...cajero } = updatedCajero

    return NextResponse.json(
      {
        cajero: { ...cajero, sexo: sexo?.sexo, estado: estado?.estado },
        cajeros,
        message: '¡Cajero actualizado exitosamente!'
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
