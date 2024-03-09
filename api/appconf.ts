import { Appconf } from "@/types/appconf";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface AppconfAPI {
  get: (token: string) => Promise<Appconf>;
  update: (token: string, input: InputUpdateAppconf) => Promise<Appconf>;
  updateSocial: (token: string, input: InputUpdateSocial) => Promise<Appconf>;
  updateContacts: (token: string, input: InputUpdateContacts) => Promise<Appconf>;
}

export type InputUpdateAppconf = {
  slider_interval: number;
}

export type InputUpdateSocial = {
  tiktok: string;
  instagram: string;
}

export type InputUpdateContacts = {
  phones: string[];
  emails: string[];
}

const appconfAPI: AppconfAPI = {
  get: async (token: string) => {
    const resp = await axios.get(`${getApiUrl()}/appconf`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Appconf
  },
  update: async (token: string, input: InputUpdateAppconf) => {
    const resp = await axios.put(`${getApiUrl()}/appconf`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Appconf
  },
  updateSocial: async (token: string, input: InputUpdateSocial) => {
    const resp = await axios.put(`${getApiUrl()}/social-media`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Appconf
  },
  updateContacts: async (token: string, input: InputUpdateContacts) => {
    const resp = await axios.put(`${getApiUrl()}/contacts`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Appconf
  }
}

export default appconfAPI;