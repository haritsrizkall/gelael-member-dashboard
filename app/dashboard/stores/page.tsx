"use client";
import storeAPI from "@/api/store";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableStore from "@/components/Tables/TableStore"
import { Meta } from "@/types/meta"
import { Store } from "@/types/store"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { useEffect, useState } from "react"

const Stores = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [metaData, setMetaData] = useState<Meta>({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })
  const { data: session, status } = useSession()

  const getData = async () => {
    try {
      const token = session?.user?.token as string
      const response = await storeAPI.getStores(token, {
        page: metaData.current_page,
        page_size: metaData.page_size
      })
      setStores(response.data)
      setMetaData(response.meta)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    getData()
  }, [metaData.current_page])

  return (
    <>
    <Breadcrumb pageName="Stores" />
    <TableStore
      stores={stores}
      meta={metaData}
      nextFn={() => {
        if (metaData.current_page < metaData.total_page) {
          setMetaData({
            ...metaData,
            current_page: metaData.current_page + 1
          })
        }
      }}
      prevFn={() => {
        if (metaData.current_page > 1) {
          setMetaData({
            ...metaData,
            current_page: metaData.current_page - 1
          })
        }
      }}
      query=""
      setQuery={() => {}}
    />
    </>
  )
}

export default Stores