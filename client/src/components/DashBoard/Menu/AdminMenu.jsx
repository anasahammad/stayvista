
import { FaUserCog } from 'react-icons/fa'
import MenuItems from './MenuItems'



const AdminMenu = () => {
  return (
    <>
      <MenuItems icon={FaUserCog} label='Manage Users' address='manage-users' />
    </>
  )
}

export default AdminMenu