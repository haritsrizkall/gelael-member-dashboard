"use client"

import { Voucher } from "@/types/voucher"
import { isExpired } from "@/utils/utils"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { FaEdit } from "react-icons/fa"

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
}

const TableVoucher = ({vouchers}: TableVoucherProps) => {
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
          {vouchers.map((voucher: Voucher, key) => (
            <tr key={key}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
              <p className="text-black dark:text-white">
                {key + 1}
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
                {voucher.amount}
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
              <p className="text-black dark:text-white">
                {moment(voucher.expired_at).format("DD MMM YYYY")}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {isExpired(voucher.expired_at) ? "Expired" : "Active"}
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
                      <Link href={`/dashboard/vouchers/${voucher.id}`}>
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
    </div>
  )
}

export default TableVoucher
