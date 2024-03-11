import AddUserModal from "@/api/AddUserModal";
import { User, UserWithRoles } from "@/types/user";
import { rolesToString } from "@/utils/utils";
import moment from "moment";
import { useState } from "react";
import Pagination from "../Pagination";
import { Meta } from "@/types/meta";

const columns = [
  {
    title: "No",
    width: "50px"
  },
  {
    title: "Email",
    width: "50px"
  },
  {
    title: "Name",
    width: "50px"
  },
  {
    title: "Roles",
    width: "50px"
  },
  {
    title: "Created At",
    width: "50px"
  }
]

interface TableUserProps {
  users: UserWithRoles[]
  meta: Meta
  nextFn: () => void
  prevFn: () => void
  query: string
  setQuery: (query: string) => void
}

const TableUser = ({users, meta, nextFn, prevFn, query, setQuery}: TableUserProps) => {
  return (
    <>
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
        <button 
          className="flex items-center justify-center rounded-md bg-primary py-3 px-5 ml-3 font-medium text-white"
        >
          Search
        </button>
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
          {users && users.map((user, key) => (
            <tr key={key}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">
                  {meta.current_page * meta.page_size - meta.page_size + key + 1}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {user.email}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {user.name || "-"}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {rolesToString(user.roles)}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {moment(user.created_at).format("DD MMM YYYY")}
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
    </>
  )
}

export default TableUser;

