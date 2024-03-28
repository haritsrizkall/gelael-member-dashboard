import { Meta } from "@/types/meta";
import { Store, StoreList } from "@/types/store";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface StoreAPI {
  getStoresList: (token: string) => Promise<StoreList[]>;
  getStores: (token: string, params: getStoresParams) => Promise<StorePaginationResponse>;
  getStore: (token: string, id: number) => Promise<Store>;
  updateStore: (token: string, params: updateStoreParams) => Promise<Store>;
}

type updateStoreParams = {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  store_manager: string;
  store_manager_image: string;
  duty_manager_1: string;
  duty_manager_1_image: string;
  duty_manager_2: string;
  duty_manager_2_image: string;
  is_active?: boolean;
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
  updateStore: async (token: string, params: updateStoreParams) => {
    const url = getApiUrl()
    console.log("params ", params)
    const resp = await axios.put(`${url}/stores/${params.id}`, {
      name: params.name,
      address: params.address,
      phone_number: params.phone_number,
      store_manager: params.store_manager,
      store_manager_image: params.store_manager_image,
      duty_manager_1: params.duty_manager_1,
      duty_manager_1_image: params.duty_manager_1_image,
      duty_manager_2: params.duty_manager_2,
      duty_manager_2_image: params.duty_manager_2_image,
      is_active: params.is_active !== undefined ? params.is_active : true
    }, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Store
  },
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
    url.searchParams.append('is_active', 'all')
    const resp = await axios.get(`${url}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as StorePaginationResponse
  }
}

export default storeAPI
