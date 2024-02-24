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
    const resp = await axios.post('http://103.250.11.32/api/auth/login', input)

    return resp
  } 
}

export default authAPI