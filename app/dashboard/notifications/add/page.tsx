"use client"

import notificationAPI from "@/api/notification";
import storeAPI from "@/api/store";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InputCreateNotification, NotificationSenderType, NotificationType } from "@/types/notification";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { z } from "zod";
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import memberAPI from "@/api/member";
import Button from "@/components/Button";
import ErrorText from "@/components/ErrorText";

const AddNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>(NotificationType.INFO);
  const [senderType, setSenderType] = useState<NotificationSenderType>(NotificationSenderType.ALL);
  const [storeOptions, setStoreOptions] = useState<{label: string, value: number}[]>([]); 
  const [selectedStores, setSelectedStores] = useState<{label: string, value:number}[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<{label: string, value: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorForm, setErrorForm] = useState({
    title: "",
    message: "",
  });
  const cleanErrorForm = () => {
    setErrorForm({
      title: "",
      message: "",
    });
  }
  const { data: session } = useSession();

  const createNotification = z.object({
    title: z.string().min(1),
    message: z.string().min(1),
    type: z.string(),
    sender_type: z.string(),
    store_ids: z.array(z.number()),
    member_ids: z.array(z.number())
  })

  const handleSubmit = async () => {
    try {
      setLoading(true);
      cleanErrorForm();
      const storeIds = selectedStores.map(store => store.value);
      const memberIds = selectedMembers.map(member => member.value);
      const input: InputCreateNotification = {
        title,
        message,
        type,
        sender_type: senderType,
        store_ids: storeIds,
        member_ids: memberIds
      } 

      const result = createNotification.safeParse(input);
      if (!result.success) {
        const errors = result.error.format();
        setErrorForm({
          title: errors?.title?._errors[0]!,
          message: errors?.message?._errors[0]!
        })
        setLoading(false);
        return;
      }

      const token = session?.user?.token as string;
      const resp = await notificationAPI.createNotification(token, input);

      console.log(resp);

      alert("notification added successfully");

      setTitle("");
      setMessage("");
      setType(NotificationType.INFO);
      setSenderType(NotificationSenderType.ALL);
      setSelectedStores([]);
      setSelectedMembers([]);
      cleanErrorForm();
    } catch (error) {
      console.log("error", error);
      alert("failed to add notification");
    }finally {
      setLoading(false);
    }
  }

  const getStores = async () => {
    const token = session?.user?.token as string;
    const resp = await storeAPI.getStoresList(token);

    let storeOptions = resp.map(store => {
      return {
        label: store.name,
        value: store.store_id
      }
    })

    setStoreOptions(storeOptions);
  }

  const loadOptions = (inputValue: string) => {
    return memberAPI.getMemberList(session?.user?.token as string, 1, 15, inputValue).then(resp => {
      let memberOptions = resp.map(member => {
        return {
          label: `${member.name} - ${member.email}`,
          value: member.id
        }
      })
      return memberOptions;
    })
  }

  useEffect(() => {
    getStores();
  }, [])

  return (
    <>
      <Breadcrumb 
        pageName="Add Notification"
        parent={{name: "Notifications", link: "/dashboard/notifications"}}
      />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Add Notifications
          </h3>
        </div>
        <div>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Title
              </label>
              <input
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="title"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorText>{errorForm.title}</ErrorText>
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Message
              </label>
              <input
                required
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
                placeholder="message"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorText>{errorForm.message}</ErrorText>
            </div>
            <div className="mb-4.5">
              <label className="mb-3 block text-black dark:text-white">
                Send To Type
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" value={senderType} onChange={(e) => setSenderType(e.target.value as NotificationSenderType)}>
                  <option value={NotificationSenderType.ALL}>ALL</option>
                  <option value={NotificationSenderType.MEMBER}>Member</option>
                  <option value={NotificationSenderType.STORE}>Store</option>
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill="#637381"
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            {
              senderType === NotificationSenderType.STORE && (
                <div className="mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Store 
                  </label>
                  <Select
                    options={storeOptions}
                    onChange={(data) => {
                      setSelectedStores(data as {label: string, value: number}[])
                    }}
                    isMulti
                  />
                </div>
              )
            }
            {
              senderType === NotificationSenderType.MEMBER && (
                <div className="mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Members 
                  </label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                    onChange={(data) => {
                      setSelectedMembers(data as {label: string, value: number}[])
                    }}
                    isMulti
                  />
                </div>
              )
            }
            <Button
              isLoading={loading}
              onClick={handleSubmit}
              text="Add Notification"
              className="w-full"
            />
          </div>
        </div>  
      </div>      
    </>
  )
}

export default AddNotification;