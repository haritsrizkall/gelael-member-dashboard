import { PromotionItem } from "@/types/promotionItem";
import { DeleteResponse } from "@/types/response";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";


interface PromotionItemAPI {
  deletePromotionItem: (token: string, id: number) => Promise<DeleteResponse>;
  createPromotionItem: (token: string, input: InputCreatePromotionItem) => Promise<PromotionItem>;
  updatePromotionItem: (token: string, input: InputUpdatePromotionItem) => Promise<PromotionItem>;
}

export type InputCreatePromotionItem = {
  promotion_id: number;
  product_name: string;
  price: number;
  discount: number;
}

export type InputUpdatePromotionItem = {
  id: number;
  product_name: string;
  price: number;
  discount: number;
}

const promotionItemAPI: PromotionItemAPI = {
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