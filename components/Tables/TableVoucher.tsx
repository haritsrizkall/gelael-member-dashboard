"use client"

import { Voucher } from "@/types/voucher"
import { cn, isExpired, statusString } from "@/utils/utils"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { FaEdit } from "react-icons/fa"
import Pagination from "../Pagination"
import { Meta } from "@/types/meta"
import { formatCurrency } from "@/utils/formatter"

const columns = [
  {
    title: "No",
    width: "50px"
  },
  {
    title: "Title",
    width: "50px"
  },
  {
    title: "Type",
    width: "50px"
  },
  {
    title: "Amount",
    width: "50px"
  },
  {
    title: "Image",
    width: "50px"
  },
  {
    title: "Status",
    width: "50px"
  },
  {
    title: "Start At",
    width: "50px"
  },
  {
    title: "Expired At",
    width: "50px"
  },
  {
    title: "Created At",
    width: "50px"
  },
  {
    title: "Actions",
    width: "50px"
  }
]

interface TableVoucherProps {
  vouchers: Voucher[]
  meta: Meta
  nextFn: () => void
  prevFn: () => void
  query: string
  setQuery: (query: string) => void
  type?: "POS" | "MEMBER"
}

const TableVoucher = ({vouchers, meta, nextFn, prevFn, query, setQuery, type = "MEMBER"}: TableVoucherProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    {/* Search bar */}
    <div className="flex justify-between items-center mb-4">
      <div className="w-full flex items-center">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
      </div>
      </div>
    {/* Search bar */}
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
          {vouchers && vouchers.map((voucher: Voucher, key) => (
            <tr key={key}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
              <p className="text-black dark:text-white">
                {key + 1 + (meta.current_page - 1) * meta.page_size}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.title}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.type}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {formatCurrency(voucher.amount)}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={voucher.image}
                    loader={() => voucher.image}
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div className={cn("bg-primary py-1 px-2 rounded-full text-center", statusString(voucher.start_at, voucher.expired_at) == "Expired" ? "bg-danger" : statusString(voucher.start_at, voucher.expired_at) == "Upcoming" ? "bg-warning" : "bg-success"  )}>
                <span className="text-white font-medium text-sm">{statusString(voucher.start_at, voucher.expired_at)}</span>
              </div>
            </td>
            
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(voucher.expired_at).format("DD MMM YYYY")}
              </p>
            </td>

            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(voucher.start_at).format("DD MMM YYYY")}
              </p>
            </td>

            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(voucher.created_at).format("DD MMM YYYY")}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button>
                      <Link href={
                        type == "POS" ? `/dashboard/voucherpos/${voucher.id}` : `/dashboard/vouchers/${voucher.id}`
                      }>
                        <FaEdit className="text-primary" />
                      </Link>
                    </button>
                  </div>
                </td>
              </tr>
          ))}
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

export default TableVoucher
