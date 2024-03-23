import { getApiUrl } from "@/utils/utils"
import axios from "axios"


export type UploadInput = {
  file: File
}

export type UploadWithNameInput = {
  file: File
  filename: string
}

export type UploadResponse = {
  status: number
  message: string
  data: {
    filename: string
  }
}

interface UploadAPI {
  upload: (token: string, input: UploadInput) => Promise<UploadResponse>
  uploadWithName: (token: string, input: UploadWithNameInput) => Promise<UploadResponse>
}


const uploadAPI: UploadAPI = {
  upload: async (token: string, input: UploadInput) => {
    const formData = new FormData()
    formData.append('image', input.file)
    const resp = await axios.post(`${getApiUrl()}/uploads/images`, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
        }
      }
    )
    return resp.data as UploadResponse
  },
  uploadWithName: async (token: string, input: UploadWithNameInput) => {
    const formData = new FormData()
    formData.append('image', input.file)
    formData.append('filename', input.filename)
    const resp = await axios.post(`${getApiUrl()}/uploads/images-with-name`, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
        }
      }
    )
    return resp.data as UploadResponse
  }
}

export default uploadAPI

