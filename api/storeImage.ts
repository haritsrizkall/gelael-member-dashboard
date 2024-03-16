"use client"

import { DeleteResponse } from "@/types/response";
import { StoreImage } from "@/types/store";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface StoreImageAPI {
  storeImage: (token: string, input: StoreImageParams) => Promise<StoreImage>;
  delete: (token: string, id: number) => Promise<DeleteResponse>;
}

type StoreImageParams = {
  store_id: number;
  image: File;
}

const storeImageAPI: StoreImageAPI = {
  storeImage: async (token: string, input: StoreImageParams) => {
    const formData = new FormData()
    formData.append("image", input.image)
    formData.append("store_id", input.store_id.toString())
    const resp = await axios.post(`${getApiUrl()}/store-images`, formData, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as StoreImage
  },
  delete: async (token: string, id: number) => {
    const resp = await axios.delete(`${getApiUrl()}/store-images/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as DeleteResponse
  }
}

export default storeImageAPI