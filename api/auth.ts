import { getApiUrl } from "@/utils/utils"
import axios from "axios"


export type LoginInput = {
  email: string, 
  password: string
}

interface AuthAPI {
  login: (input: LoginInput) => Promise<any>
}

const authAPI: AuthAPI = {
  login: async (input: LoginInput) => {
    const resp = await axios.post(`${getApiUrl()}/auth/login`, input)
    console.log(resp)
    return resp
  } 
}

export default authAPI