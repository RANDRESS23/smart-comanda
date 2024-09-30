import { SearchIcon } from '../icons/SearchIcon'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Spinner } from '@nextui-org/react'
import { useCallback } from 'react'
import { PDFGenerator } from '@/components/PDFGenerator'
import { type Mesero } from '@/types/meseros'

const STATUS_OPTIONS = [
  { name: 'Activo', uid: 'Activo' },
  { name: 'Inactivo', uid: 'Inactivo' }
]

const COLUMNS = [
  { name: 'USUARIO', uid: 'usuario', sortable: true },
  { name: 'NOMBRE', uid: 'nombre', sortable: true },
  { name: 'DOCUMENTO', uid: 'documento', sortable: true },
  { name: 'CORREO', uid: 'correo', sortable: true },
  { name: 'CELULAR', uid: 'celular' },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

interface TopContentTableProps {
  meserosCount: number
  filterValue: string
  statusFilter: any
  visibleColumns: any
  loadingMeseros: boolean
  totalMeseros: Mesero[]
  setVisibleColumns: (value: any) => void
  setStatusFilter: (value: any) => void
  setFilterValue: (value: string) => void
  setPage: (page: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
}

export const TopContentTable = ({ meserosCount, filterValue, statusFilter, visibleColumns, loadingMeseros, totalMeseros, setVisibleColumns, setStatusFilter, setFilterValue, setPage, setRowsPerPage }: TopContentTableProps) => {
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3 lg:items-end">
        <div className='relative overflow-hidden p-[1px] rounded w-full sm:max-w-[44%]'>
          <Input
            isClearable
            label='Documento'
            className="w-full"
            placeholder="Buscar por número de documento..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => { onClear() }}
            onValueChange={onSearchChange}
            type='number'
            radius='sm'
            isDisabled={loadingMeseros}
          />
        </div>
        <div className="flex justify-evenly gap-3">
          {
            loadingMeseros
              ? <Spinner color='secondary' />
              : totalMeseros.length !== 0
                ? (
                  <PDFGenerator
                    fileName='Meseros-Registro-SmartComanda'
                    contactLabel='Tabla Registros de:'
                    contactName='Meseros'
                    invoiceHeader={[
                      {
                        title: '#',
                        style: {
                          width: 10
                        }
                      },
                      {
                        title: 'Documento',
                        style: {
                          width: 30
                        }
                      },
                      {
                        title: 'Nombre Completo',
                        style: {
                          width: 60
                        }
                      },
                      {
                        title: 'Correo',
                        style: {
                          width: 50
                        }
                      },
                      {
                        title: 'Celular',
                        style: {
                          width: 30
                        }
                      },
                      {
                        title: 'Estado',
                        style: {
                          width: 30
                        }
                      }
                    ]}
                    invoiceTable={totalMeseros.map((mesero, index) => [
                      index + 1,
                      mesero.numero_documento,
                      `${mesero.primer_nombre[0]?.toUpperCase() ?? ''}${mesero.primer_nombre?.slice(1) ?? ''} ${mesero.segundo_nombre[0]?.toUpperCase() ?? ''}${mesero.segundo_nombre?.slice(1) ?? ''} ${mesero.primer_apellido[0]?.toUpperCase() ?? ''}${mesero.primer_apellido?.slice(1) ?? ''} ${mesero.segundo_apellido[0]?.toUpperCase() ?? ''}${mesero.segundo_apellido?.slice(1) ?? ''}`,
                      mesero.correo,
                      mesero.celular,
                      mesero.estado
                    ])}
                    orientationLandscape={false}
                  />
                  )
                : null
            }
          <Dropdown>
            <DropdownTrigger className="flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                Estados
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {STATUS_OPTIONS.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className="flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                Columas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {COLUMNS.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name.charAt(0).toUpperCase() + column.name.slice(1)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {meserosCount} meseros registrados</span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    </div>
  )
}
