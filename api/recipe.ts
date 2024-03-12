import { Meta } from "@/types/meta";
import { Recipe } from "@/types/recipe";
import { DeleteResponse } from "@/types/response";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";


interface RecipeAPI {
  getRecipes: (token: string, params: getRecipesParams) => Promise<RecipePaginationResponse>;
  update: (token: string, input: InputUpdateRecipe) => Promise<Recipe>;
  delete: (token: string, id: number) => Promise<DeleteResponse>;
  create: (token: string, input: InputCreateRecipe) => Promise<Recipe>;
}

type RecipePaginationResponse = {
  data: Recipe[];
  meta: Meta;
}

type getRecipesParams = {
  page?: number;
  q?: string;
  page_size?: number;
}

type InputCreateRecipe = {
  title: string;
  image: string;
  url: string;
}

type InputUpdateRecipe = {
  recipe_id: number;
  title: string;
  image: string;
  url: string;
}

const recipeAPI: RecipeAPI = {
  getRecipes: async (token: string, params: getRecipesParams) => {
    let url = new URL(`${getApiUrl()}/recipes`)
    if (params.page) url.searchParams.append("page", params.page.toString())
    if (params.q) url.searchParams.append("q", params.q)
    if (params.page_size) url.searchParams.append("page_size", params.page_size.toString())
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as RecipePaginationResponse
  },
  update: async (token: string, input: InputUpdateRecipe) => {
    const resp = await axios.put(`${getApiUrl()}/recipes/${input.recipe_id}`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Recipe
  },
  delete: async (token: string, id: number) => {
    const resp = await axios.delete(`${getApiUrl()}/recipes/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as DeleteResponse
  },
  create: async (token: string, input: InputCreateRecipe) => {
    const resp = await axios.post(`${getApiUrl()}/recipes`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Recipe
  }
}

export default recipeAPI;