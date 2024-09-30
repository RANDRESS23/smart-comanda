import SideBar from '@/components/SideBar'
import { menuItemsCajero } from '@/constants/itemsNavBar'

export default function CajeroLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <SideBar items={menuItemsCajero}>
        {children}
      </SideBar>
    </main>
  )
}
