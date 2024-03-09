import { Promotion, PromotionWithStoreName } from "@/types/promotion";
import { DeleteResponse } from "@/types/response";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface PromotionAPI {
  getPromotions: (token: string) => Promise<Promotion[]>;
  getPromotionsWithStoreName: (token: string) => Promise<PromotionWithStoreName[]>;
  getById: (token: string, id: number) => Promise<Promotion>;
  createPromotion: (token: string, input: InputCreatePromotion) => Promise<Promotion>;
  deletePromotion: (token: string, id: number) => Promise<DeleteResponse>;
  updatePromotion: (token: string, input: InputUpdatePromotion) => Promise<Promotion>;
}

export type InputCreatePromotion = {
  title: string;
  description: string;
  image: string;
  color: string;
  expired_at: Date;
  store_id: number;
}

export type InputUpdatePromotion = {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
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
  getPromotionsWithStoreName: async (token: string) => {
    const resp = await axios.get(`${getApiUrl()}/promotions/with-store-name`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as PromotionWithStoreName[]
  },
  getById: async (token: string, id: number) => {
    const resp = await axios.get(`${getApiUrl()}/promotions/${id}`, {
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