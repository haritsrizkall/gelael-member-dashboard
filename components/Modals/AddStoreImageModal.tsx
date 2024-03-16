import { Dispatch, SetStateAction, useState } from "react"
import Button from "../Button"
import Modal, { ModalProps } from "./Modal"
import { useSession } from "next-auth/react"
import { Store } from "@/types/store"
import storeImageAPI from "@/api/storeImage"


interface AddStoreImageModalProps extends ModalProps {
  storeId: number
  setStore: Dispatch<SetStateAction<Store>>
}

const AddStoreImageModal = (props: AddStoreImageModalProps) => {
  const [image, setImage] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  

  const handleSubmit = async () => {
    try {
      setLoading(true)
      console.log("IMAGE", image)
      console.log("STORE ID", props.storeId)
      const resp = await storeImageAPI.storeImage(session?.user?.token as string, {
        store_id: props.storeId,
        image: image as File
      })

      props.setStore((prev) => {
        return {
          ...prev,
          store_images: [...prev.store_images, resp]
        }
      })
      
      alert("Store image added successfully")
      setImage(undefined)
      props.onClose()
    } catch (error) {
      alert("Failed to add store image")
      console.log("ERROR", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal {...props} size="md">
      <>
      <div className="">
        <h1 className="text-center text-xl font-medium mb-10">Add Store Image</h1>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Image
          </label>
          <input
            required
            onChange={(e) => setImage(e.target.files?.[0])}
            type="file"
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />  
        </div>
      </div>
      <div>
        <Button
          text="Add Store Image"
          onClick={handleSubmit}
          isLoading={loading}
        />
      </div>
      </>
    </Modal>
  )
}

export default AddStoreImageModal