import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import axios from "axios"
import { getServerSession } from "next-auth"

interface UserAPI {
  me: (token: string) => Promise<any>
}

const userAPI: UserAPI = {
  me: async (token: string) => {
    const session = await getServerSession(authOptions)
    const resp = await axios.get('http://103.250.11.32/api/users/me', {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp
  }
}

export default userAPI
