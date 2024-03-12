import { Member, MemberList, MemberWithStoreName } from "@/types/member";
import { Meta } from "@/types/meta";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface MemberAPI {
  getMembersWithStoreName: (token: string, params: getMembersParams) => Promise<MemberWithStoreNamePaginationResponse>;
  getMembers: (token: string, params: getMembersParams) => Promise<MemberPaginationResponse>;
  getMemberList: (token: string, page: number, pageSize: number, q?: string) => Promise<MemberList[]>;
}

type getMembersParams = {
  page?: number;
  q?: string;
  page_size?: number;
}

type MemberPaginationResponse = {
  data: Member[];
  meta: Meta;
}

type MemberWithStoreNamePaginationResponse = {
  data: MemberWithStoreName[];
  meta: Meta;
}

const memberAPI: MemberAPI = {
  getMembersWithStoreName: async (token: string, params: getMembersParams) => {
    const url = new URL(`${getApiUrl()}/members/with-store-name`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as MemberWithStoreNamePaginationResponse
  },
  getMembers: async (token: string, params: getMembersParams) => {
    const url = new URL(`${getApiUrl()}/members`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.page_size) url.searchParams.append('page_size', params.page_size.toString())
    url.searchParams.append('order_by', "POINT_DESC")

    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as MemberPaginationResponse
  },
  getMemberList: async (token: string, page: number, pageSize: number, q?: string) => {
    const url = new URL(`${getApiUrl()}/members/list`)
    url.searchParams.append("page", page.toString())
    url.searchParams.append("pageSize", pageSize.toString())
    if (q) {
      url.searchParams.append("q", q)
    }
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as MemberList[]
  }
}

export default memberAPI