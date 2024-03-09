"use client"

import userAPI from "@/api/user"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableUser from "@/components/Tables/TableUser"
import { User } from "@/types/user"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const { data: session } = useSession()

  const getData = async () => {
    const token = session?.user?.token as string
    const users = await userAPI.getUsers(token, {
      page: 1,
      page_size: 10
    })
    setUsers(users)
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <>
      <Breadcrumb pageName="Users" />
      <Link href={"/dashboard/vouchers/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add User
        </button>
      </Link>
      <TableUser users={users} />
    </>
  )
}

export default Users