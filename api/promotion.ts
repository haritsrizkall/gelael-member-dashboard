import { Meta } from "@/types/meta";
import { Promotion, PromotionWithStoreName } from "@/types/promotion";
import { DeleteResponse } from "@/types/response";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface PromotionAPI {
  getPromotions: (token: string) => Promise<Promotion[]>;
  getPromotionsWithStoreName: (token: string, params: getPromotionsParams) => Promise<PromotionWithStoreNamePagination>;
  getById: (token: string, id: number) => Promise<Promotion>;
  createPromotion: (token: string, input: InputCreatePromotion) => Promise<Promotion>;
  deletePromotion: (token: string, id: number) => Promise<DeleteResponse>;
  updatePromotion: (token: string, input: InputUpdatePromotion) => Promise<Promotion>;
}

type PromotionWithStoreNamePagination = {
  data: PromotionWithStoreName[];
  meta: Meta;
}

export type getPromotionsParams = {
  page?: number;
  q?: string;
  page_size?: number;
  is_expired?: boolean;
  store_id?: number;
  order_by?: string;
}

export type InputCreatePromotion = {
  title: string;
  description: string;
  image: string;
  background_color: string;
  color: string;
  start_at: Date;
  expired_at: Date;
  store_id: number;
}

export type InputUpdatePromotion = {
  id: number;
  title: string;
  description: string;
  image: string;
  background_color: string;
  color: string;
  start_at: Date;
  expired_at: Date;
  store_id: number;
}

const promotionAPI: PromotionAPI = {
  getPromotions: async (token: string) => {
    console.log("URL", getApiUrl())
    const resp = await axios.get(`${getApiUrl()}/promotions`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Promotion[]
  },
  getPromotionsWithStoreName: async (token: string, params: getPromotionsParams) => {
    let url = new URL(`${getApiUrl()}/promotions/with-store-name`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())
    if (params.is_expired) url.searchParams.append('is_expired', params.is_expired.toString())
    if (params.store_id) url.searchParams.append('store_id', params.store_id.toString())
    if (params.order_by) url.searchParams.append('order_by', params.order_by)
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as PromotionWithStoreNamePagination
  },
  getById: async (token: string, id: number) => {
    const resp = await axios.get(`${getApiUrl()}/promotions/${id}?with_item=true`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Promotion
  },
  createPromotion: async (token: string, input: InputCreatePromotion) => {
    const resp = await axios.post(`${getApiUrl()}/promotions`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })  
    return resp.data.data as Promotion
  },
  deletePromotion: async (token: string, id: number) => {
    const resp = await axios.delete(`${getApiUrl()}/promotions/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as DeleteResponse
  },
  updatePromotion: async (token: string, input: InputUpdatePromotion) => {
    const resp = await axios.put(`${getApiUrl()}/promotions/${input.id}`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Promotion
  }
}

export default promotionAPI