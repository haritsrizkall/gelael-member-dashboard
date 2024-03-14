import { Meta } from "@/types/meta";
import { Store, StoreList } from "@/types/store";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface StoreAPI {
  getStoresList: (token: string) => Promise<StoreList[]>;
  getStores: (token: string, params: getStoresParams) => Promise<StorePaginationResponse>;
  getStore: (token: string, id: number) => Promise<Store>;
}

type getStoresParams = {
  page?: number;
  page_size?: number;
}

type StorePaginationResponse = {
  data: Store[];
  meta: Meta;
};

const storeAPI: StoreAPI = {
  getStoresList: async (token: string) => {
    const url = getApiUrl()
    const resp = await axios.get(`${url}/stores`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as StoreList[]
  },
  getStore: async (token: string, id: number) => {
    const url = getApiUrl()
    const resp = await axios.get(`${url}/stores/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Store
  },
  getStores: async (token: string, params: getStoresParams) => {
    const url = new URL(`${getApiUrl()}/stores`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())

    const resp = await axios.get(`${url}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as StorePaginationResponse
  }
}

export default storeAPI
