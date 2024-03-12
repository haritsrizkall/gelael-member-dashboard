"use client"

import recipeAPI from "@/api/recipe"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import AddRecipeModal from "@/components/Modals/AddRecipeModal"
import TableRecipe from "@/components/Tables/TableRecipe"
import { Recipe } from "@/types/recipe"
import { debounce } from "lodash"
import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [addMode, setAddMode] = useState(false)
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })
  const [query, setQuery] = useState("")
  const { data: session } = useSession()
  
  const getData = async (q?: string) => {
    // get data
    try {
      const token = session?.user?.token as string
      const resp = await recipeAPI.getRecipes(token, {
        page: metaData.current_page,
        page_size: metaData.page_size,
        q: q
      })

      setRecipes(resp.data)
      setMetaData(resp.meta)
    }catch (error) {
      console.log(error)
      alert("Failed to fetch data")
    }
  }

  useEffect(() => {
    getData(query)
  },[metaData.current_page])

  const debouncedSearch = useRef(
    debounce(async (query:string) => {
      await getData(query)
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
      <AddRecipeModal
        isOpen={addMode}
        onClose={() => setAddMode(false)}
        setRecipes={setRecipes}
      />
      <Breadcrumb pageName="Recipes" />
      <button
        onClick={() => setAddMode(true)}
        className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray"
      >
          Add Recipe
      </button>
      <TableRecipe
        setRecipes={setRecipes}
        recipes={recipes}
        meta={metaData}
        query={query}
        setQuery={setQueryDebounced}
        nextFn={() => {
          if (metaData.current_page < metaData.total_page) {
            setMetaData({
              ...metaData,
              current_page: metaData.current_page + 1
            })
          }
        }}
        prevFn={() => {
          if (metaData.current_page > 1) {
            setMetaData({
              ...metaData,
              current_page: metaData.current_page - 1
            })
          }
        }}
      />
    </>
  )
}

export default Recipes