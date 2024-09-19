/* ➡ Interfaz con los tipos de las propiedades del Cajero */
export interface Cajero {
  id_cajero: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_tipo_documento: string
  tipo_documento: string
  numero_documento: string
  correo: string
  id_sexo: string
  sexo: string
  celular: string
  estado: string
  createdAt: Date
  updatedAt: Date
}
