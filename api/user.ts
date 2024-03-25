import { Meta } from "@/types/meta";
import { User, UserWithRoles } from "@/types/user";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface UserAPI {
  getUsers: (token: string, params: getUsersParams) => Promise<UserPaginationResponse>;
  getUsersWithRoles: (token: string, params: getUsersParams) => Promise<UserWithRolesPaginationResponse>;
  createUser: (token: string, params: createUserParams) => Promise<User>;
  me: (token: string) => Promise<User>;
}

export type UserPaginationResponse = {
  data: User[];
  meta: Meta;
}

export type UserWithRolesPaginationResponse = {
  data: UserWithRoles[];
  meta: Meta;
}

export type createUserParams = {
  email: string;
  name: string;
  password: string;
  roles: number[];
}

export type getUsersParams = {
  page?: number;
  q?: string;
  page_size?: number;
  roles?: number[];
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
    return resp.data as UserPaginationResponse
  },
  getUsersWithRoles: async (token: string, params: getUsersParams) => {
    let url = new URL(`${getApiUrl()}/users/with-roles`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())
    if (params.roles) url.searchParams.append('roles', params.roles.join(','))
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      },
      params: params
    })
    return resp.data as UserWithRolesPaginationResponse
  },
  createUser: async (token: string, params: createUserParams) => {
    const resp = await axios.post(`${getApiUrl()}/users/admin`, params, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as User
  },
  me: async (token: string) => {
    const resp = await axios.get(`${getApiUrl()}/users/me`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as User
  }
}

export default userAPI