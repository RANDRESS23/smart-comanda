import { FormDefineTables } from './FormDefineTables'
import { TablesCount } from './TablesCount'

export const DefineTables = () => {
  return (
    <section className='w-full z-10 flex flex-col lg:flex-row justify-center items-center gap-10 pt-14 pb-10'>
      <FormDefineTables />
      <TablesCount />
    </section>
  )
}
