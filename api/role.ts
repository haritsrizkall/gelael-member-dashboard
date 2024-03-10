import { Role } from "@/types/role";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface RoleAPI {
  getRoles: (token: string) => Promise<Role[]>;
}

const roleAPI: RoleAPI = {
  getRoles: async (token: string) => {
    const resp = await axios.get(`${getApiUrl()}/roles`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Role[]
  }
}

export default roleAPI