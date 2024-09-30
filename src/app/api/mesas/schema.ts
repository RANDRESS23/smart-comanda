import { z } from 'zod'

export const totalMesasSchema = z.object({
  total_mesas: z.string().refine(value => Number(value) > 0, {
    message: 'La cantidad de mesas debe ser mayor a 0'
  }).refine(value => Number(value) <= 2000, {
    message: 'La cantidad de mesas debe ser menor o igual a 20'
  })
})
