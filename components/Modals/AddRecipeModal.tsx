"use client"

import { useState } from "react"
import Modal, { ModalProps } from "./Modal"
import Button from "../Button"
import { Recipe } from "@/types/recipe"
import { useSession } from "next-auth/react"
import recipeAPI from "@/api/recipe"
import uploadAPI from "@/api/upload"

interface AddRecipeModalProps extends ModalProps{
  setRecipes: (recipes: any) => void
}

const AddRecipeModal = (props: AddRecipeModalProps) => {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<File | undefined>(undefined)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const token = session?.user?.token as string
      const recipe = {
        title,
        image: "",
        url
      }
      const uploadResp = await uploadAPI.upload(token, {file: image as File})
      recipe.image = uploadResp.data.filename.split("/").pop() as string
      
      const resp = await recipeAPI.create(token, recipe)

      props.setRecipes((prev: any) => {
        if (prev) {
          return [...prev, resp]
        }else {
          return [resp]
        }
      })

      alert("Recipe added successfully")
      setTitle("")
      setImage(undefined)
      setUrl("")
      props.onClose()
    } catch (error) {
      setLoading(false)
      alert("Failed to add recipe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal {...props} size="md">
      <>
      <div className="">
        <h1 className="text-center text-xl font-medium mb-10">Add Recipe</h1>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Name
          </label>
          <input
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Ayam"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Image
          </label>
          <input
            required
            onChange={(e) => setImage(e.target.files?.[0])}
            type="file"
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />  
        </div>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            URL
          </label>
          <input
            required
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            type="text"
            placeholder="https://google.com"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
      </div>
      <div>
        <Button
          text="Add Promotion Item"
          onClick={handleSubmit}
          isLoading={loading}
        />
      </div>
      </>
    </Modal>
  )
}

export default AddRecipeModal
