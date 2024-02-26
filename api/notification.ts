import { InputCreateNotification, Notification } from "@/types/notification";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface NotificationAPI {
  getNotifications: (token: string) => Promise<Notification[]>;
  createNotification: (token: string, input: InputCreateNotification) => Promise<Notification>;
}

const notificationAPI: NotificationAPI = {
  getNotifications: async (token: string, page?: string, pageSize?: string) => {
    const url = new URL(`${getApiUrl()}/notifications`)
    if (page) {
      url.searchParams.append("page", page)
    }
    if (pageSize) {
      url.searchParams.append("pageSize", pageSize)
    }
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Notification[]
  },
  createNotification: async (token: string, input: InputCreateNotification) => {
    const resp = await axios.post(`${getApiUrl()}/notifications`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })  
    return resp.data.data as Notification
  }
}

export default notificationAPI
