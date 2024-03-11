import { Meta } from "@/types/meta";
import { InputCreateNotification, Notification } from "@/types/notification";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface NotificationAPI {
  getNotifications: (token: string, params: getNotificationsParams) => Promise<NotificationsPaginationResponse>;
  createNotification: (token: string, input: InputCreateNotification) => Promise<Notification>;
}

type NotificationsPaginationResponse = {
  data: Notification[];
  meta: Meta;
}

type getNotificationsParams = {
  page?: number;
  page_size?: number;
  q?: string;
  type?: string;
}

const notificationAPI: NotificationAPI = {
  getNotifications: async (token: string, params: getNotificationsParams) => {
    const url = new URL(`${getApiUrl()}/notifications`)
    if (params.page) url.searchParams.append('page', params.page.toString())
    if (params.page_size) url.searchParams.append('page_size', params.page_size?.toString())
    if (params.q) url.searchParams.append('q', params.q)
    if (params.type) url.searchParams.append('type', params.type)
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as NotificationsPaginationResponse
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
