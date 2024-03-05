"use client"

import voucherAPI from "@/api/voucher"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableVoucher from "@/components/Tables/TableVoucher"
import { Voucher } from "@/types/voucher"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

const Vouchers = () => {
  const { data: session, status } = useSession()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  
  const getVouchers = async () => {
    const vouchers = await voucherAPI.getVouchers(session?.user?.token as string, 1, 30)
    setVouchers(vouchers)
  }

  useEffect(() => {
    getVouchers()
  },[])


  return (
    <>
      <Breadcrumb pageName="Vouchers" />
      <Link href={"/dashboard/vouchers/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add Voucher
        </button>
      </Link>
      <TableVoucher vouchers={vouchers} />
    </>
  )
}

export default Vouchers