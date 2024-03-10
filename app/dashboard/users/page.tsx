"use client"

import AddUserModal from "@/api/AddUserModal"
import roleAPI from "@/api/role"
import userAPI from "@/api/user"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableUser from "@/components/Tables/TableUser"
import { Role } from "@/types/role"
import { User, UserWithRoles } from "@/types/user"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

const Users = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [addMode, setAddMode] = useState(false)
  const { data: session } = useSession()

  const getData = async () => {
    try {
      const token = session?.user?.token as string
      const users = await userAPI.getUsersWithRoles(token, {
        page: 1,
        page_size: 10
      })
      setUsers(users)
    }catch (error) {
      console.log(error)
      alert("Failed to fetch data")
    }
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <>
      <AddUserModal isOpen={addMode} onClose={() => setAddMode(false)} />
      <Breadcrumb pageName="Users" />
      <button
        onClick={() => setAddMode(true)}
        className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
          Add User
      </button>
      <TableUser users={users} />
    </>
  )
}

export default Users