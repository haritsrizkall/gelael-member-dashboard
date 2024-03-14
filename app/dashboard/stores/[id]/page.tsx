"use client"

import storeAPI from "@/api/store";
import { Store } from "@/types/store";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Store = () => {
  const [store, setStore] = useState<Store>({} as Store)
  const [editMode, setEditMode] = useState(false)
  const [editModeManager, setEditModeManager] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
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

  
  return (
    <>
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
            onClick={() => {}}
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
            onClick={() => {}}
            className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingDetail ? "bg-gray text-primary" : "")}
          >
            <span>{loadingDetail ? "Loading..." : "Save"}</span>
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
    </>
  )
}

export default Store

