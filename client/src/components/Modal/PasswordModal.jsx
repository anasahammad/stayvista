import { Button, Dialog, DialogPanel, DialogTitle, Field, Input, Label, Transition, TransitionChild } from '@headlessui/react'


import clsx from 'clsx';
import { updatePassword } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
const PasswordModal = ({isOpen, closeModal, user}) => {
   

    const handleChangePassword = (e)=>{
        
        e.preventDefault()
        const newPassword = e.target.password.value;
        console.log(newPassword);

        updatePassword(user, newPassword)
        .then(()=>{
           toast.success("Password Updated")
        })
        .catch(err=>{
            toast.error(err.message)
        })
    }
    return (
        <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={closeModal}>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <DialogTitle as="h3" className="text-lg font-medium text-center leading-6 text-gray-900 mb-6">
                   Change Your Password
                  </DialogTitle>
                  <form onSubmit={handleChangePassword} action=""> <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-gray-900">New Password</Label>
       
        <Input name="password" 
          className={clsx(
            'mt-3 block w-full rounded-lg border border-gray-900 bg-white/5 py-1.5 px-3 text-sm/6 text-gray-900',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black'
          )}
        />
      </Field>
    </div>
                 
                  <div className="mt-4">
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={closeModal}
                    >
                      Change Password
                    </button>
                  </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
};

export default PasswordModal;