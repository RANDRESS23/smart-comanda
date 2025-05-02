import { type Metadata } from 'next'
import { CardComanda } from './_components/CardComanda'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'SmartComanda | Seguimiento de comanda'
  }
}

export default async function ComandaPage () {
  return (
    <main className='pt-36 pb-10 px-9 relative w-full font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center overflow-y-auto overflow-x-hidden'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-color-background-dark bg-color-background-light [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <CardComanda />
    </main>
  )
}
