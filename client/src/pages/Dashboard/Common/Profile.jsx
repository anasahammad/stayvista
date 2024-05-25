

import { Helmet } from 'react-helmet-async'
import useAuth from '../../../hooks/useAuth'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { useState } from 'react'
import UpdateProfile from '../../../components/Modal/UpdateProfile'
import PasswordModal from '../../../components/Modal/PasswordModal'


const Profile = () => {
  const { user, loading, updateUserProfile } = useAuth()
  const [role, isLoading] = useRole()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [changePassword, setChangePassword] = useState(true)

 useState(()=>{
    if(user){
        user.providerData.forEach(profile=>{
            if(profile.providerId === 'google.com'){
                setChangePassword(false)
               
            }
        })
    }
 }, [])
  const closeModal = ()=>{
    setIsOpenModal(false)
  }
  const close = ()=>{
    setIsOpen(false)
  }


  if(loading || isLoading) return <LoadingSpinner/>
  return (
    <div className='flex justify-center items-center h-screen'>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className='bg-white shadow-lg rounded-2xl w-3/5'>
        <img
          alt='profile'
          src='https://wallpapercave.com/wp/wp10784415.jpg'
          className='w-full mb-4 rounded-t-lg h-36'
        />
        <div className='flex flex-col items-center justify-center p-4 -mt-16'>
          <a href='#' className='relative block'>
            <img
              alt='profile'
              src={user?.photoURL}
              className='mx-auto object-cover rounded-full h-24 w-24  border-2 border-white '
            />
          </a>

          <p className='p-2  px-4 text-xs text-white bg-pink-500 rounded-full'>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>
          <p className='mt-2 text-xl font-medium text-gray-800 '>
            User Id: {user?.uid}
          </p>
          <div className='w-full p-2 mt-4 rounded-lg'>
            <div className='flex flex-wrap items-center justify-between text-sm text-gray-600 '>
              <p className='flex flex-col'>
                Name
                <span className='font-bold text-black '>
                  {user?.displayName}
                </span>
              </p>
              <p className='flex flex-col'>
                Email
                <span className='font-bold text-black '>{user?.email}</span>
              </p>

              <div>
                <button onClick={()=>setIsOpenModal(true)} className='bg-[#F43F5E] px-10 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053] block mb-1'>
                  Update Profile
                </button>
                <UpdateProfile user={user} updateUserProfile={updateUserProfile} closeModal={closeModal} isOpen={isOpenModal}></UpdateProfile>
                <button disabled={!changePassword}  onClick={()=>setIsOpen(true)}  className='bg-[#F43F5E] px-7 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053]'>
                  Change Password
                </button>
              <PasswordModal user={user} isOpen={isOpen} closeModal={close}></PasswordModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile