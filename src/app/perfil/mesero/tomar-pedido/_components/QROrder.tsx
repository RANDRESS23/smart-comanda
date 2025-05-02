import api from '@/libs/api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import QRCode from 'react-qr-code'
import { Button } from '@/components/Button'

interface QROrderProps {
  idMesa: string
  onClose3: () => void
}

export const QROrder = ({ idMesa, onClose3 }: QROrderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [urlComanda, setUrlComanda] = useState('')

  useEffect(() => {
    const getComandaId = async () => {
      try {
        setIsLoading(true)

        const response = await api.get(`/comanda/mesa/${idMesa}`)

        if (response.status === 200) {
          const comandaId = response.data.idComanda as string
          const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://smart-comanda.vercel.app'
          const urlComanda = `${baseURL}/comanda/${comandaId}`

          setUrlComanda(urlComanda)
        }
      } catch (error: any) {
        if (error.response?.data !== undefined) {
          const errorsMessages = Object.values(error.response.data as Record<string, string>)
          let errorsMessagesString = ''

          errorsMessages.forEach((message: any) => {
            errorsMessagesString += `${message} ${'\n'}`
          })

          return toast.error(errorsMessagesString)
        }

        console.error({ error })
      } finally {
        setIsLoading(false)
      }
    }

    getComandaId()
  }, [])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <span className='text-lg font-bold'>Cargando código QR...</span>
      </div>
    )
  }

  return (
    <div>
      <QRCode
        value={urlComanda}
        className='w-full'
      />
      <div className='flex flex-col justify-center items-center mt-10 gap-y-3 mb-3'>
        <Button
          type="button"
          text='Cerrar'
          disabled={false}
          onClick={onClose3}
        />
      </div>
    </div>
  )
}
