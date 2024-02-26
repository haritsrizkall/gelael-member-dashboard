import { MemberList } from "@/types/member";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface MemberAPI {
  getMembers: (token: string, page: number, pageSize: number, q?: string) => Promise<MemberList[]>;
}

const memberAPI: MemberAPI = {
  getMembers: async (token: string, page: number, pageSize: number, q?: string) => {
    const url = new URL(`${getApiUrl()}/members`)
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