import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getApiUrl } from "@/utils/utils"
import axios from "axios"
import { getServerSession } from "next-auth"

interface UserAPI {
  me: (token: string) => Promise<any>
}

const userAPI: UserAPI = {
  me: async (token: string) => {
    const session = await getServerSession(authOptions)
    const resp = await axios.get(`${getApiUrl()}/users/me`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp
  }
}

export default userAPI
