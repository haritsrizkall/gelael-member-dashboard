import { StoreList } from "@/types/store";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface StoreAPI {
  getStoresList: (token: string) => Promise<StoreList[]>;
}

const storeAPI: StoreAPI = {
  getStoresList: async (token: string) => {
    const url = getApiUrl()
    const resp = await axios.get(`${url}/stores`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as StoreList[]
  }
}

export default storeAPI
