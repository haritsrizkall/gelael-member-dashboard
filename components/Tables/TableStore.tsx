"use client";
import { Meta } from "@/types/meta"
import { Store } from "@/types/store"
import Pagination from "../Pagination"
import Link from "next/link"
import { FaEdit } from "react-icons/fa"
import SwitcherThree from "../Switchers/SwitcherThree"
import storeAPI from "@/api/store";
import { useSession } from "next-auth/react";
import { useState } from "react";

const columns = [
  {
    "title": "No",
    "width": "50px"
  },
  {
    "title": "Smartsoft ID",
    "width": "50px"
  },
  {
    "title": "Name",
    "width": "50px"
  },
  {
    "title": "Address",
    "width": "50px"
  },
  {
    "title": "Phone",
    "width": "50px"
  },
  {
    "title": "Store Manager",
    "width": "50px"
  },
  {
    "title": "Duty Manager 1",
    "width": "50px"
  },
  {
    "title": "Duty Manager 2",
    "width": "50px"
  },
  {
    "title": "Active",
    "width": "50px"
  },
  {
    "title": "Action",
    "width": "50px"
  }
]

interface TableStoreProps {
  stores: Store[]
  setStores: (stores: Store[]) => void
  meta: Meta
  nextFn: () => void
  prevFn: () => void
  query: string
  setQuery: (query: string) => void
}  

const TableStore = ({ stores, meta, nextFn, prevFn, query, setQuery, setStores }: TableStoreProps) => {
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: session } = useSession()

  const handleToggleActive = async (store_id: number) => {
    try {
      setLoading(true)
      setSelectedId(store_id)
      const store = stores.find((store) => store.store_id === store_id)
      if (!store) {
        return
      }
      console.log("active ", !store.is_active)
      const token = session?.user?.token as string
      const resp = await storeAPI.updateStore(token, {
        id: store_id,
        name: store.name,
        address: store.address,
        phone_number: store.phone_number,
        store_manager: store.store_manager,
        store_manager_image: store.store_manager_image.split("/").pop() as string,
        duty_manager_1: store.duty_manager_1,
        duty_manager_1_image: store.duty_manager_1_image.split("/").pop() as string,
        duty_manager_2: store.duty_manager_2,
        duty_manager_2_image: store.duty_manager_2_image.split("/").pop() as string,
        is_active: !store.is_active
      })

      const newStores = stores.map((store) => {
        if (store.store_id === store_id) {
          return resp
        }
        return store
      })
      setStores(newStores)
    } catch (error) {
      console.log(error)
    } finally {
      setSelectedId(null)
      setLoading(false)
    }
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {columns.map((column, key) => (
              <th key={key} className={`min-w-[${column.width}] py-4 px-4 font-medium text-black dark:text-white`}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stores?.map((store: Store, key) => {
            return (
              <tr key={store.store_id}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">
                  {key + 1 + (meta.current_page - 1) * meta.page_size}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.smartsoft_id}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.name}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.address}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.phone_number}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.store_manager}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.duty_manager_1}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {store.duty_manager_2}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <SwitcherThree
                  id={store.store_id.toString()} 
                  enabled={store.is_active}
                  setEnabled={() => {
                    handleToggleActive(store.store_id)
                  }}
                  loading={
                    loading && selectedId === store.store_id
                  }
                />
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex items-center space-x-3.5">
                  <button>
                    <Link href={`/dashboard/stores/${store.store_id}`}>
                      <FaEdit className="text-primary" />
                    </Link>
                  </button>
                </div>
              </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    <div className="my-4 flex flex-col items-end">
      <Pagination
        currentPage={meta.current_page}
        totalData={meta.total}
        pageSize={meta.page_size}
        nextFn={nextFn}
        prevFn={prevFn}
      />
    </div>
    </div>
  )
}

export default TableStore