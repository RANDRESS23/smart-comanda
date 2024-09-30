import SideBar from '@/components/SideBar'
import { menuItemsAdmin } from '@/constants/itemsNavBar'

export default function AdminLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <SideBar items={menuItemsAdmin}>
        {children}
      </SideBar>
    </main>
  )
}
