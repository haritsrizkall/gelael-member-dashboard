"use client"

import notificationAPI from "@/api/notification";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableNotification from "@/components/Tables/TableNotification";
import { Notification } from "@/types/notification";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Notifications = () => {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const getNotifications = async () => {
    const resp = await notificationAPI.getNotifications(session?.user?.token as string)
    setNotifications(resp)
  }

  useEffect(() => {
    getNotifications()
  },[])

  return (
    <>
      <Breadcrumb pageName="Notifications" />
      <Link href={"/dashboard/notifications/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add notification
        </button>
      </Link>
      <TableNotification notifications={notifications} />
    </>
  );
}

export default Notifications;
