"use client"
import { Banner } from "@/types/banner";
import { DeleteResponse } from "@/types/response";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface BannerAPI {
  getBanners: (token: string, page: number, pageSize: number) => Promise<Banner[]>;
  getById: (token: string, id: number) => Promise<Banner>;
  create: (token: string, inputCreateBanner: InputCreateBanner) => Promise<Banner>;
  update: (token: string, inputUpdateBanner: InputUpdateBanner) => Promise<Banner>;
  delete: (token: string, id: number) => Promise<DeleteResponse>;
}

export type InputCreateBanner = {
  image: File
}

export type InputUpdateBanner = {
  id: number
  image: File
}

const bannerAPI: BannerAPI = {
  getBanners: async (token: string, page: number, pageSize: number) => {
    const url = new URL(`${getApiUrl()}/banners`)
    url.searchParams.append("page", page.toString())
    url.searchParams.append("page_size", pageSize.toString())
    console.log("URL", url)
    const resp = await axios.get(`${url}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Banner[]
  },
  getById: async (token: string, id: number) => {
    const resp = await axios.get(`${getApiUrl()}/banners/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Banner
  },
  create: async (token: string, inputCreateBanner: InputCreateBanner) => {
    const formData = new FormData()
    formData.append("image", inputCreateBanner.image)
    const resp = await axios.post(`${getApiUrl()}/banners`, formData, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Banner
  },
  update: async (token: string, inputUpdateBanner: InputUpdateBanner) => {
    const formData = new FormData()
    formData.append("image", inputUpdateBanner.image)
    const resp = await axios.put(`${getApiUrl()}/banners/${inputUpdateBanner.id}`, formData, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Banner
  },
  delete: async (token: string, id: number) => {
    const resp = await axios.delete(`${getApiUrl()}/banners/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as DeleteResponse
  }
}

export default bannerAPI;