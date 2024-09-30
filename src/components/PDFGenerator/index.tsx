import { BsFileEarmarkPdfFill } from 'react-icons/bs'
import jsPDFInvoiceTemplate, { OutputType, type jsPDF } from 'jspdf-invoice-template'
import { toast } from 'sonner'

interface PDFGeneratorProps {
  fileName: string
  contactLabel: string
  contactName: string
  invoiceLabel?: string
  invoiceNum?: number
  invoiceInvDate?: string
  invoiceInvGenDate?: string
  invoiceHeader: Array<{ title: string, style: { width: number } }>
  invoiceTable: Array<Array<string | number>>
  orientationLandscape: boolean
}

/* ➡ Componente que se encarga de generar los PDFS de los reportes */
export const PDFGenerator = ({ fileName, contactLabel, contactName, invoiceLabel, invoiceNum, invoiceInvDate, invoiceInvGenDate, invoiceHeader, invoiceTable, orientationLandscape }: PDFGeneratorProps) => {
  const getProps = () => {
    return {
      outputType: OutputType.Save,
      onJsPDFDocCreation: (jsPDFDoc: jsPDF) => { console.log(jsPDFDoc) },
      returnJsPDFDocObject: true,
      fileName,
      orientationLandscape,
      compress: true,
      logo: {
        src: 'https://i.postimg.cc/FzVdDvkP/image-removebg-preview-3-edit.png',
        type: 'PNG',
        width: 40,
        height: 28,
        margin: {
          top: 0,
          left: 0
        }
      },
      stamp: {
        inAllPages: true,
        src: 'https://i.postimg.cc/vTHJw8G9/qr-code-smart-comanda.png',
        type: 'JPG',
        width: 20,
        height: 20,
        margin: {
          top: 0,
          left: 0
        }
      },
      business: {
        name: 'REPORTE',
        address: 'Cra. 1ª #18, El Espinal, Tolima',
        phone: '(+57) 315 3090045',
        email: 'team@smartcomanda.vercel.app',
        email_1: 'team2@smartcomanda.vercel.app',
        website: 'www.smartcomanda.vercel.app'
      },
      contact: {
        label: contactLabel,
        name: contactName,
        address: '',
        phone: '',
        email: '',
        otherInfo: ''
      },
      invoice: {
        label: invoiceLabel,
        num: invoiceNum,
        invDate: invoiceInvDate,
        invGenDate: invoiceInvGenDate,
        headerBorder: false,
        tableBodyBorder: false,
        header: invoiceHeader,
        table: invoiceTable,
        additionalRows: [],
        invDescLabel: '',
        invDesc: ''
      },
      footer: {
        text: 'Gracias por confiar en SmartComanda, no dudes en contactarnos por cualquier inquietud.',
        style: {
          fontSize: 8,
          alignment: 'center'
        }
      },
      pageEnable: true,
      pageLabel: 'Page '
    }
  }

  const generatePDF = () => {
    toast('¿Deseas descargar el PDF con el registro completo?', {
      action: {
        label: 'Descargar',
        onClick: () => {
          const props = getProps()
          jsPDFInvoiceTemplate(props)
        }
      }
    })
  }

  return (
    <button className='flex justify-center items-center transition-all text-4xl text-red-600 hover:text-red-500 hover:scale-85' onClick={generatePDF}>
      <BsFileEarmarkPdfFill />
    </button>
  )
}
