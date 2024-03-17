"use client"

import storeAPI from "@/api/store";
import storeImageAPI from "@/api/storeImage";
import uploadAPI from "@/api/upload";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddStoreImageModal from "@/components/Modals/AddStoreImageModal";
import Loader from "@/components/common/Loader";
import { Store, StoreImage } from "@/types/store";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

const Store = () => {
  const [store, setStore] = useState<Store>({} as Store)
  const [editMode, setEditMode] = useState(false)
  const [editModeManager, setEditModeManager] = useState(false)
  const [addStoreImageMode, setAddStoreImageMode] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [loadingEditManager, setLoadingEditManager] = useState(false)
  const [deletingId, setDeletingId] = useState<number>(0)
  const [storeManagerImage, setStoreManagerImage] = useState<File | undefined>(undefined)
  const [dutyManager1Image, setDutyManager1Image] = useState<File | undefined>(undefined)
  const [dutyManager2Image, setDutyManager2Image] = useState<File | undefined>(undefined)

  const params = useParams();
  const { data: session, status } = useSession()

  const getStore = async () => {
    // fetch store by id
    try {
      const token = session?.user?.token as string
      const response = await storeAPI.getStore(token, parseInt(params.id as string))
      setStore(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getStore()
  }, [params.id])

  const handleDeleteImage = async (id: number) => {
    try {
      const token = session?.user?.token as string
      setDeletingId(id)
      const response = await storeImageAPI.delete(token, id)
      const newStoreImages = store?.store_images?.filter((image) => image.store_image_id !== id)
      setStore({...store, store_images: newStoreImages})
      setDeletingId(0)
      alert("Success delete image")
    } catch (error) {
      alert("Failed to delete image")
      console.log(error)
    }
  }

  const handleUpdateManagerImage = async () => {
    try {
      setLoadingEditManager(true)
      const token = session?.user?.token as string
      let input = {
        id: store.store_id,
        name: store.name,
        address: store.address,
        phone_number: store.phone_number,
        store_manager: store.store_manager,
        store_manager_image: store.store_manager_image.split("/").pop() as string,
        duty_manager_1: store.duty_manager_1,
        duty_manager_1_image: store.duty_manager_1_image.split("/").pop() as string,
        duty_manager_2: store.duty_manager_2,
        duty_manager_2_image: store.duty_manager_2_image.split("/").pop() as string
      }

      if (storeManagerImage !== undefined) {
        const respStoreMgrImage = await uploadAPI.upload(token, { file: storeManagerImage as File })
        input.store_manager_image = respStoreMgrImage.data.filename.split("/").pop() as string
      }

      if (dutyManager1Image !== undefined) {
        const respDutyMgr1Image = await uploadAPI.upload(token, { file: dutyManager1Image as File })
        input.duty_manager_1_image = respDutyMgr1Image.data.filename.split("/").pop() as string
      }

      if (dutyManager2Image !== undefined) {
        const respDutyMgr2Image = await uploadAPI.upload(token, { file: dutyManager2Image as File })
        input.duty_manager_2_image = respDutyMgr2Image.data.filename.split("/").pop() as string
      }

      const response = await storeAPI.updateStore(token, input)
      const newStore = {
        ...store,
        store_manager: response.store_manager,
        store_manager_image: response.store_manager_image,
        duty_manager_1: response.duty_manager_1,
        duty_manager_1_image: response.duty_manager_1_image,
        duty_manager_2: response.duty_manager_2,
        duty_manager_2_image: response.duty_manager_2_image
      }

      setStore(newStore)
      setEditModeManager(false)
      alert("Success update store")
    }catch (error) {
      alert("Failed to update store")
      console.log(error)
    }finally {
      setLoadingEditManager(false)
    }
  }

  const handleEditDetail = async () => {
    try {
      setLoadingDetail(true)
      const token = session?.user?.token as string
      const input = {
        id: store.store_id,
        name: store.name,
        address: store.address,
        phone_number: store.phone_number,
        store_manager: store.store_manager,
        store_manager_image: store.store_manager_image.split("/").pop() as string,
        duty_manager_1: store.duty_manager_1,
        duty_manager_1_image: store.duty_manager_1_image.split("/").pop() as string,
        duty_manager_2: store.duty_manager_2,
        duty_manager_2_image: store.duty_manager_2_image.split("/").pop() as string
      }
      const response = await storeAPI.updateStore(token, input)
      const newStore = {
        ...store,
        name: response.name,
        address: response.address,
        phone_number: response.phone_number,
        store_manager: response.store_manager,
        store_manager_image: response.store_manager_image,
        duty_manager_1: response.duty_manager_1,
        duty_manager_1_image: response.duty_manager_1_image,
        duty_manager_2: response.duty_manager_2,
        duty_manager_2_image: response.duty_manager_2_image
      }
      setStore(newStore)
      setLoadingDetail(false)
      setEditMode(false)
      alert("Success update store")
    } catch (error) {
      alert("Failed to update store")
      setLoadingDetail(false)
      console.log(error)
    }
  }

  
  return (
    <>
    <AddStoreImageModal
      isOpen={addStoreImageMode}
      onClose={() => setAddStoreImageMode(false)}
      storeId={parseInt(params.id as string)}
      setStore={setStore}
    />
    <Breadcrumb
      pageName="Store Detail"
      parent={{ name: "Stores", link: "/dashboard/stores" }}
    />
    <div className="flex flex-col gap-9 mb-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          <h3 className="font-medium text-black dark:text-white mr-3">
            Store Detail
          </h3>
        </div>
        
      <div className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Title
          </label>
          <input
            required
            disabled={!editMode}
            type="text"
            value={store?.name}
            onChange={(e) =>  setStore({...store, name: e.target.value})}
            placeholder="Gelael MT"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Address
          </label>
          <textarea
            required
            disabled={!editMode}
            value={store?.address}
            onChange={(e) =>  setStore({...store, address: e.target.value})}
            placeholder="Gelael MT"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Phone
          </label>
          <input
            required
            disabled={!editMode}
            type="text"
            value={store?.phone_number}
            onChange={(e) =>  setStore({...store, phone_number: e.target.value})}
            placeholder="Gelael MT"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="p-6.5 flex justify-end">
        {
          editMode ? (
            <>
            <button
              onClick={() => setEditMode(false)}
              className="px-8 py-3 rounded-md border border-primary text-primary font-medium transition hover:bg-primary hover:text-white dark:border-form-strokedark dark:text-white dark:hover:bg-primary dark:hover:text-white mr-4.5"
            >
              Cancel
            </button>
            <button
            onClick={handleEditDetail}
            className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingDetail ? "bg-gray text-primary" : "")}
          >
            <span>{loadingDetail ? "Loading..." : "Save"}</span>
          </button>
          </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-8 py-3 rounded-md bg-primary text-white font-medium transition hover:bg-opacity-90"
            >
              Edit
            </button>
          )
        }
      </div>
      </div>
    </div>

    <div className="flex flex-col gap-9 mb-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          <h3 className="font-medium text-black dark:text-white mr-3">
            Managers
          </h3>
        </div>
        
      <div className="p-6.5">
        <div className="mb-4.5 flex w-full">
          <div className="mr-4.5">
            <Image
              src={store?.store_manager_image}
              loader={() => store?.store_manager_image}
              alt="voucher"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="grow">
            <div>
              <div className="mb-4 5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Store Manager
                </label>
                <input
                  required
                  disabled={!editModeManager}
                  type="text"
                  value={store?.store_manager}
                  onChange={(e) =>  setStore({...store, store_manager: e.target.value})}
                  placeholder="Gelael MT"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Store Manager Image (Kosongkan jika tidak ingin update image)
                </label>
                <input
                  disabled={!editModeManager}
                  required
                  type="file"
                  onChange={(e) => setStoreManagerImage(e.target.files?.[0])}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />  
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4.5 flex w-full">
          <div className="mr-4.5">
            <Image
              src={store?.duty_manager_1_image}
              loader={() => store?.duty_manager_1_image}
              alt="voucher"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="grow">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Duty Manager 1
              </label>
              <input
                required
                type="text"
                disabled={!editModeManager}
                value={store?.duty_manager_1}
                onChange={(e) =>  setStore({...store, duty_manager_1: e.target.value})}
                placeholder="Gelael MT"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Duty Manager Image (Kosongkan jika tidak ingin update image)
                </label>
                <input
                  disabled={!editModeManager}
                  required
                  type="file"
                  onChange={(e) => setDutyManager1Image(e.target.files?.[0])}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />  
              </div>
          </div>
        </div>
        <div className="mb-4.5 flex">
          <div className="mr-4.5">
            <Image
              src={store?.duty_manager_2_image}
              loader={() => store?.duty_manager_2_image}
              alt="voucher"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="grow">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Duty Manager 2
              </label>
              <input
                required
                type="text"
                disabled={!editModeManager}
                value={store?.duty_manager_2}
                onChange={(e) =>  setStore({...store, duty_manager_2: e.target.value})}
                placeholder="Gelael MT"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Duty Manager 2 Image (Kosongkan jika tidak ingin update image)
              </label>
              <input
                disabled={!editModeManager}
                required
                type="file"
                onChange={(e) => setDutyManager2Image(e.target.files?.[0])}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />  
            </div>
          </div>
        </div>
      </div>

      <div className="p-6.5 flex justify-end">
        {
          editModeManager ? (
            <>
            <button
              onClick={() => setEditModeManager(false)}
              className="px-8 py-3 rounded-md border border-primary text-primary font-medium transition hover:bg-primary hover:text-white dark:border-form-strokedark dark:text-white dark:hover:bg-primary dark:hover:text-white mr-4.5"
            >
              Cancel
            </button>
            <button
            onClick={handleUpdateManagerImage}
            className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingEditManager ? "bg-gray text-primary" : "")}
          >
            <span>{loadingEditManager ? "Loading..." : "Save"}</span>
          </button>
          </>
          ) : (
            <button
              onClick={() => setEditModeManager(true)}
              className="px-8 py-3 rounded-md bg-primary text-white font-medium transition hover:bg-opacity-90"
            >
              Edit
            </button>
          )
        }
      </div>
      </div>
    </div>

    <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Store Image</h2>
    <button
      className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray"
      onClick={() => setAddStoreImageMode(true)}
    >
        Add Image
    </button>
    <div className="flex flex-col gap-9 mb-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          <h3 className="font-medium text-black dark:text-white mr-3">
            Store Images
          </h3>
        </div>
        
      <div className="p-6.5">
        <div className="flex">
          {
            store?.store_images?.map((image: StoreImage, index) => (
              <div key={index} className="relative mr-4.5">
                {
                  deletingId === image.store_image_id &&
                  <div className="flex items-center justify-center absolute bg-gray opacity-50 w-full h-full rounded">
                    <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                  </div>
                }
                <Image
                  src={image.image}
                  loader={() => image.image}
                  alt="voucher"
                  width={150}
                  height={150}
                  className="rounded"
                />
                <TiDelete 
                  className="fill-current absolute top-0 right-0 text-3xl text-danger cursor-pointer"
                  onClick={() => handleDeleteImage(image.store_image_id)}
                />
              </div>
            ))
          }
        </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default Store

