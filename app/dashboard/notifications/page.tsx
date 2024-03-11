"use client"

import notificationAPI from "@/api/notification";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableNotification from "@/components/Tables/TableNotification";
import { Notification } from "@/types/notification";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Notifications = () => {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })
  const [query, setQuery] = useState("")

  const getNotifications = async (q?: string) => {
    const resp = await notificationAPI.getNotifications(session?.user?.token as string, {
      page: metaData.current_page,
      page_size: metaData.page_size,
      q: q,
    })
    setNotifications(resp.data)
    setMetaData(resp.meta)
  }

  useEffect(() => {
    getNotifications()
  },[metaData.current_page])

  const debouncedSearch = useRef(
    debounce(async (query:string) => {
      await getNotifications(query)
    }, 500)
  ).current

  const setQueryDebounced = async (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }
  
  useEffect(() => {
    debouncedSearch.cancel()
  }, [debouncedSearch]);

  return (
    <>
      <Breadcrumb pageName="Notifications" />
      <Link href={"/dashboard/notifications/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add notification
        </button>
      </Link>
      <TableNotification 
        notifications={notifications} 
        meta={metaData}
        setQuery={setQueryDebounced}
        query={query}
        nextFn={() => {
          if (metaData.current_page < metaData.total_page) {
            setMetaData({...metaData, current_page: metaData.current_page + 1})
          }
        }}
        prevFn={() => {
          if (metaData.current_page > 1) {
            setMetaData({...metaData, current_page: metaData.current_page - 1})
          }
        }}
      />
    </>
  );
}

export default Notifications;
