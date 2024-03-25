"use client"

import AddUserModal from "@/components/Modals/AddUserModal"
import userAPI from "@/api/user"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableUser from "@/components/Tables/TableUser"
import { User, UserWithRoles } from "@/types/user"
import { useSession } from "next-auth/react"
import { debounce } from "lodash"
import { useEffect, useRef, useState } from "react"

const Users = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [addMode, setAddMode] = useState(false)
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 25,
    total: 0,
    total_page: 0
  })
  const [query, setQuery] = useState("")
  const { data: session } = useSession()

  const getData = async (page: number, q?: string) => {
    try {
      const token = session?.user?.token as string
      const response = await userAPI.getUsersWithRoles(token, {
        page: page,
        page_size: metaData.page_size,
        q: q,
        roles: [1, 2]
      })
      setMetaData(response.meta)
      setUsers(response.data)
    }catch (error) {
      console.log(error)
      alert("Failed to fetch data")
    }
  }

  useEffect(() => {
    getData(metaData.current_page, query)
  },[metaData.current_page])

  const debouncedSearch = useRef(
    debounce(async (query:string) => {
      await getData(metaData.current_page, query)
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
      <AddUserModal isOpen={addMode} onClose={() => setAddMode(false)} />
      <Breadcrumb pageName="Users" />
      <button
        onClick={() => setAddMode(true)}
        className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
          Add User
      </button>
      <TableUser 
        users={users} 
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
        meta={metaData}
        query={query}
        setQuery={setQueryDebounced}
      />
    </>
  )
}

export default Users