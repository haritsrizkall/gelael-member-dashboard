import { Meta } from "@/types/meta";
import { PromotionItem } from "@/types/promotionItem";
import { DeleteResponse } from "@/types/response";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";


interface PromotionItemAPI {
  getPromotionItemsByPromotionID: (token: string, params: getPromotionItemsParams) => Promise<PromotionItemsPaginationParams>; 
  deletePromotionItem: (token: string, id: number) => Promise<DeleteResponse>;
  createPromotionItem: (token: string, input: InputCreatePromotionItem) => Promise<PromotionItem>;
  updatePromotionItem: (token: string, input: InputUpdatePromotionItem) => Promise<PromotionItem>;
}

type getPromotionItemsParams = {
  page?: number;
  q?: string;
  page_size?: number;
  promotion_id?: number;
}

type PromotionItemsPaginationParams = {
  data: PromotionItem[];
  meta: Meta;
}

export type InputCreatePromotionItem = {
  promotion_id: number;
  product_name: string;
  price: number;
  discount: number;
  image: string;
}

export type InputUpdatePromotionItem = {
  id: number;
  product_name: string;
  price: number;
  discount: number;
}

const promotionItemAPI: PromotionItemAPI = {
  getPromotionItemsByPromotionID: async (token: string, params: getPromotionItemsParams) => {
    let url = new URL(`${getApiUrl()}/promotions/${params.promotion_id}/promotion-items`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())

    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      },
      params: params
    })
    return resp.data as PromotionItemsPaginationParams
  },
  deletePromotionItem: async (token: string, id: number) => {
    const resp = await axios.delete(`${getApiUrl()}/promotion-items/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as DeleteResponse
  },
  createPromotionItem: async (token: string, input: InputCreatePromotionItem) => {
    const resp = await axios.post(`${getApiUrl()}/promotion-items`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as PromotionItem
  },
  updatePromotionItem: async (token: string, input: InputUpdatePromotionItem) => {
    const resp = await axios.put(`${getApiUrl()}/promotion-items/${input.id}`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as PromotionItem
  }
}

export default promotionItemAPI