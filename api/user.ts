import { User } from "@/types/user";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface UserAPI {
  getUsers: (token: string, params: getUsersParams) => Promise<User[]>;
}

export type getUsersParams = {
  page?: number;
  q?: string;
  page_size?: number;
}

const userAPI: UserAPI = {
  getUsers: async (token: string, params: getUsersParams) => {
    let url = new URL(`${getApiUrl()}/users`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      },
      params: params
    })
    return resp.data.data as User[]
  }
}

export default userAPI