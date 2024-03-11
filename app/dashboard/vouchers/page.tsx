"use client"

import voucherAPI from "@/api/voucher"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableVoucher from "@/components/Tables/TableVoucher"
import { Voucher } from "@/types/voucher"
import { debounce } from "lodash"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const Vouchers = () => {
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })
  const [query, setQuery] = useState("")
  const { data: session, status } = useSession()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  
  const getVouchers = async (q?: string) => {
    try {
      const response = await voucherAPI.getVouchers(session?.user?.token as string,{
        page: metaData.current_page,
        page_size: metaData.page_size,
        q: q
      })
      setVouchers(response.data)
      setMetaData(response.meta) 
    } catch (error) {
      console.log(error)
      alert("Failed to fetch data")
    }
  }

  useEffect(() => {
    getVouchers()
  },[metaData.current_page])

  
  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      await getVouchers(value)
    }, 500)
  ).current

  const setQueryDebounced = async (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }
  
  useEffect(() => {
    debouncedSearch.cancel()
  }, [debouncedSearch]);

  return (
    <>
      <Breadcrumb pageName="Vouchers" />
      <Link href={"/dashboard/vouchers/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add Voucher
        </button>
      </Link>
      <TableVoucher 
        vouchers={vouchers} 
        meta={metaData}
        nextFn={() => {
          if (metaData.current_page < metaData.total_page) {
            setMetaData({...metaData, current_page: metaData.current_page + 1})
          }
        }}
        prevFn={() => {
          if (metaData.current_page > 1) {
            setMetaData({...metaData, current_page: metaData.current_page - 1})
          }
        }}
        query={query}
        setQuery={setQueryDebounced}
      />
    </>
  )
}

export default Vouchers