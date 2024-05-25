import { Button, Description, Dialog, DialogPanel, DialogTitle, Field, Label, Transition, TransitionChild, Input } from "@headlessui/react";

import clsx from 'clsx'
import { ImageUpload } from "../../api/utils";
import toast from "react-hot-toast";

const UpdateProfile = ({isOpen, closeModal, user, updateUserProfile}) => {

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const image = form.image.files[0]

        const image_url = await ImageUpload(image)
        const updateInfo = {
            displayName: name, email : email, photoURL : image_url
        }
        console.log(updateInfo);
        try{
           
           await updateUserProfile(
                 name,
                 image_url
            )
            toast.success("Profile Updated Successfully")

        }
        catch (err){
            toast.error(err.message)
        }
    }
    return (
        <div>
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-medium text-center leading-6 text-gray-900 mb-6">
                    Update Your Profile
                  </DialogTitle>
                 <form action="" onSubmit={handleSubmit}>

                 <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-gray-900">Name</Label>
       
        <Input name="name" defaultValue={user?.displayName}
          className={clsx(
            'mt-3 block w-full rounded-lg border border-gray-900 bg-white/5 py-1.5 px-3 text-sm/6 text-gray-900',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black'
          )}
        />
      </Field>
    </div>
   
                  <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-gray-900">Email</Label>
       
        <Input name="email" defaultValue={user?.email} disabled
          className={clsx(
            'mt-3 block w-full rounded-lg border border-gray-900 bg-white/5 py-1.5 px-3 text-sm/6 text-gray-900',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black'
          )}
        />
      </Field>
    </div>
    <div className="w-full max-w-md px-4">
          <Field>
          <Label className="text-sm/6 font-medium text-gray-900">Photo</Label>
        <input name="image" type="file"   className={clsx(
            'mt-3 block w-full rounded-lg  bg-white/5 py-1.5 px-3 text-sm/6 text-gray-900'
           
          )}/>
          </Field>

    </div>

                  <div className="mt-4">
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={closeModal}
                    >
                     Update Profile
                    </button>
                  </div>
                 </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
        </div>
    );
};

export default UpdateProfile;