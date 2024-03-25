"use client"
import Pagination from "@/components/Pagination"
import { Member, MemberWithStoreName } from "@/types/member"
import { Meta } from "@/types/meta"
import moment from "moment"
import Image from "next/image"


const columns = [
  {
    title: "No",
    width: "50px"
  },
  {
    title: "Smartsoft ID",
    width: "50px"
  },
  {
    title: "Email",
    width: "50px"
  },
  {
    title: "Phone Number",
    width: "50px"
  },
  {
    title: "Name",
    width: "50px"
  },
  {
    title: "Point",
    width: "50px"
  },
  {
    title: "Avatar",
    width: "50px"
  },
  {
    title: "Store",
    width: "50px"
  },
  {
    title: "Birth Date",
    width: "50px"
  },
  {
    title: "Created At",
    width: "50px"
  },
]

interface TableMemberProps {
  members: MemberWithStoreName[]
  meta: Meta
  nextFn: () => void
  prevFn: () => void
  query: string
  setQuery: (query: string) => void
}

const TableMember = ({members, meta, nextFn, prevFn, query, setQuery}: TableMemberProps) => {
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
          {members?.map((member: MemberWithStoreName, key) => (
            <tr key={member.id}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
              <p className="text-black dark:text-white">
                {key + 1 + (meta.current_page - 1) * meta.page_size}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {member.smartsoft_id || '-'}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {member.email}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {member.phone_number || "-"}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {member.name}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {member.point}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <Image
                src={member.avatar}
                loader={() => member.avatar}
                width={50}
                height={50}
                alt="Product"
              />
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {member.store_name}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(member.birth_date).format("DD MMM YYYY")}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(member.created_at).format("DD MMM YYYY")}
              </p>
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

export default TableMember