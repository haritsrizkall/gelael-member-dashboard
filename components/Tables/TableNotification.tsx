import { Notification } from "@/types/notification"
import moment from "moment"

const columns = [
  {
    title: "No",
    width: "50px"
  },
  {
    title: "Title",
    width: "50px"
  },
  {
    title: "Message",
    width: "50px"
  },
  {
    title: "Type",
    width: "50px"
  },
  {
    title: "Created At",
    width: "50px"
  },
  {
    title: "Updated At",
    width: "50px"
  }
]

interface TableNotificationProps {
  notifications: Notification[]
}

const TableNotification = ({notifications}: TableNotificationProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {columns.map((column, key) => (
              <th key={key} className={`min-w-[${column.width}] py-4 px-4 font-medium text-black dark:text-white`}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification: Notification, key) => (
            <tr key={key}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
              <p className="text-black dark:text-white">
                {key + 1}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {notification.title}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {notification.message}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {notification.type}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(notification.created_at).format("DD MMM YYYY")}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {moment(notification.updated_at).format("DD MMM YYYY")}
              </p>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default TableNotification

