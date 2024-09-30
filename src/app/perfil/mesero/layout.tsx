import SideBar from '@/components/SideBar'
import { menuItemsMesero } from '@/constants/itemsNavBar'

export default function MeseroLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <SideBar items={menuItemsMesero}>
        {children}
      </SideBar>
    </main>
  )
}
