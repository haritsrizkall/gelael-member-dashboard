"use client"

import Button from "@/components/Button"
import Modal, { ModalProps } from "@/components/Modals/Modal"
import { useEffect, useState } from "react"
import roleAPI from "./role"
import { useSession } from "next-auth/react"
import Select from "react-select";
import userAPI from "./user"

interface AddUserModal extends ModalProps{
}


const AddUserModal = (props: AddUserModal) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [roleOptions, setRoleOptions] = useState<{label: string, value: number}[]>([])
  const [selectedRoles, setSelecterRoles] = useState<{label: string, value: number}[]>([]) 
  const { data: session } = useSession()
  
  const getData = async () => {
    const token = session?.user?.token as string 
    const roles = await roleAPI.getRoles(token)
    // skip if role.id == 3
    setRoleOptions(roles.filter(role => role.id !== 3).map(role => {
      return {
        label: role.name,
        value: role.id
      }
    }))
  }

  useEffect(() => {
    getData()
  },[])

  const handleSumbit = async () => {
    try {
      setLoading(true)
      const token = session?.user?.token as string
      const roleIds = selectedRoles.map(role => role.value)
      const user = {
        email,
        password,
        name,
        roles: roleIds
      }
      const resp = await userAPI.createUser(token, user)
      setEmail("")
      setPassword("")
      setName("")
      setSelecterRoles([])
      alert("User added successfully")
      props.onClose()
    }catch (error) {
      console.log(error)
      alert("Failed to add user")
    }finally {
      setLoading(false)
    }
  }
  
  return (
    <Modal {...props}>
      <>
      <div className="">
        <h1 className="text-center text-xl font-medium mb-10">Add User</h1>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Email
          </label>
          <input
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="admin@gmail.com"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Password
          </label>
          <input
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="password"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Name
          </label>
          <input
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Budi"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
    
        <div className="mb-4 5">
          <label className="mb-3 block text-black dark:text-white">
            Role
          </label>
          <Select
            options={roleOptions}
            onChange={(data) => {
              let newSelectedRole = [
                {
                  label: data?.label as string,
                  value: data?.value as number
                }
              ]
              setSelecterRoles(newSelectedRole)
            }}
            placeholder="Select Role"
          />
        </div>
      </div>
      <div>
        <Button
          text="Add User"
          onClick={handleSumbit}
          isLoading={loading}
        />
      </div>
      </>
    </Modal>
  )
}

export default AddUserModal