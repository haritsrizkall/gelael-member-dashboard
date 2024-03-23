"use client"

import { useState } from "react"
import Modal, { ModalProps } from "./Modal"
import Button from "../Button"
import { Recipe } from "@/types/recipe"
import { useSession } from "next-auth/react"
import recipeAPI from "@/api/recipe"
import uploadAPI from "@/api/upload"
import { z } from "zod"
import ErrorText from "../ErrorText"

interface AddRecipeModalProps extends ModalProps{
  setRecipes: (recipes: any) => void
}

const AddRecipeModal = (props: AddRecipeModalProps) => {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<File | undefined>(undefined)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorForm, setErrorForm] = useState({
    title: "",
    image: "",
    url: ""
  })
  const { data: session, status } = useSession()

  const cleanErrorForm = () => {
    setErrorForm({
      title: "",
      image: "",
      url: ""
    })
  }

  const createRecipeSchema = z.object({
    title: z.string().min(1),
    image: z.string(),
    url: z.string().url()
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)
      cleanErrorForm()
      const token = session?.user?.token as string
      const recipe = {
        title,
        image: "",
        url
      }

      const result = createRecipeSchema.safeParse(recipe)
      if (!result.success) {
        const errors = result.error.format()
        setErrorForm({
          title: errors?.title?._errors[0]!,
          image: errors?.image?._errors[0]!,
          url: errors?.url?._errors[0]!
        })
        setLoading(false)
        return
      }

      if (image == undefined) {
        setErrorForm((prev) => {
          return {
            ...prev,
            image: "Image is required"
          }
        })
        setLoading(false)
        return
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
      cleanErrorForm()
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
          <ErrorText>{errorForm.title}</ErrorText>
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Image (jpg, jpeg, png)
          </label>
          <input
            required
            onChange={(e) => setImage(e.target.files?.[0])}
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/JPG, image/JPEG, image/PNG"
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />  
          <ErrorText>{errorForm.image}</ErrorText>
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
          <ErrorText>{errorForm.url}</ErrorText>
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
