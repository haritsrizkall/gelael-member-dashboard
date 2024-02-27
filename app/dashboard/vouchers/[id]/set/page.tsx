"use client"

import memberAPI from "@/api/member";
import voucherAPI, { InputSetVoucherMembers } from "@/api/voucher";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import AsyncSelect from 'react-select/async';

const Members = () => {
  const [selectedMembers, setSelectedMembers] = useState<{label: string, value: number}[]>([]);
  const { data: session, status } = useSession();
  const params = useParams();

  const loadOptions = (inputValue: string) => {
    return memberAPI.getMemberList(session?.user?.token as string, 1, 15, inputValue).then((members) => {
      let memberOptions = members.map(member => {
        return {
          label: `${member.name} - ${member.email}`,
          value: member.id
        }
      })
      return memberOptions
    })
  }

  const handleSubmit = async () => {
    try {
      const memberIds = selectedMembers.map(member => member.value)
      const token = session?.user?.token as string;
      const input: InputSetVoucherMembers = {
        voucher_id: parseInt(params.id as string),
        member_ids: memberIds
      }
      const resp = await voucherAPI.setVoucherMembers(token, input);
      console.log("resp", resp);
      alert("Voucher given successfully");
    } catch (error) {
      console.log("error", error);
      alert("Failed to give voucher");
    }
  }

  return (
    <>
      <Breadcrumb
        pageName="Give voucher to member"
        parent={{ name: "Vouchers", link: "/dashboard/vouchers" }}
      />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Give Voucher
            </h3>
          </div>
          <div>
            <div className="p-6.5">
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
              
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              >
                Give voucher
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Members