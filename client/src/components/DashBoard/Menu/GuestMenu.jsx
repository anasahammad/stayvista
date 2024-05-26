import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItems from './MenuItems'
import useRole from '../../../hooks/useRole'
import HostModal from '../../Modal/HostModal'
import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'


const GuestMenu = () => {
    const [role] = useRole()
    const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const axiosSecure = useAxiosSecure()

  //for modal
  const [isOpenModal, setIsOpenModal] = useState(false)
  const closeModal = ()=>{
    setIsOpenModal(false)
  }

  const modalHandler = async ()=>{
    console.log('Modal asche')
    closeModal()

    try {
      const currentUser = {
        email: user?.email,
        role: 'guest',
        status: 'Requested'
      }
  
      const {data} = await axiosSecure.put(`${import.meta.env.VITE_API_URL}/user`, currentUser)
      if(data.modifiedCount > 0){
        toast.success("Success! Wait for admin approval")
      }
      else{
        toast.success("Please! Wait for admin aproval")
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  return (
    <>
      <MenuItems
        icon={BsFingerprint}
        label='My Bookings'
        address='my-bookings'
      />

      {role === 'guest' && (<button  onClick={()=>setIsOpenModal(true)} className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
        <GrUserAdmin className='w-5 h-5' />

        <span className='mx-4 font-medium'>Become A Host</span>
      </button> 
    )
      }
<HostModal modalHandler={modalHandler} closeModal={closeModal} isOpen={isOpenModal}></HostModal>

    </>
  )
}

export default GuestMenu