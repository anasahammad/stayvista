
import { BsFillHouseAddFill } from 'react-icons/bs'
import { MdHomeWork, MdOutlineManageHistory } from 'react-icons/md'
import MenuItems from './MenuItems'

const HostMenu = () => {
  return (
    <>
      <MenuItems icon={BsFillHouseAddFill} label='Add Room' address='add-room' />
      <MenuItems icon={MdHomeWork} label='My Listings' address='my-listings' />
      <MenuItems
        icon={MdOutlineManageHistory}
        label='Manage Bookings'
        address='manage-bookings'
      />
    </>
  )
}

export default HostMenu