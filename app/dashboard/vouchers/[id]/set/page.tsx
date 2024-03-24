"use client"

import memberAPI from "@/api/member";
import voucherAPI, { InputSetVoucherMembers } from "@/api/voucher";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Button from "@/components/Button";
import { GiveVoucherType, Voucher, VoucherStats } from "@/types/voucher";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AsyncSelect from 'react-select/async';

const Members = () => {
  const [selectedMembers, setSelectedMembers] = useState<{label: string, value: number}[]>([]);
  const [voucher, setVoucher] = useState<Voucher>({
    id: 0,
    title: "",
    description: "",
    type: "",
    amount: 0,
    image: "",
    start_at: "",
    expired_at: "",
    created_at: "",
    updated_at: ""
  });
  const [voucherStats, setVoucherStats] = useState<VoucherStats>({
    voucher_id: 0,
    total_available_vouchers: 0,
    total_unused_vouchers: 0,
    total_used_vouchers: 0,
    total_vouchers: 0
  });
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const memberIds = selectedMembers.map(member => member.value)
      const token = session?.user?.token as string;
      const input: InputSetVoucherMembers = {
        type: GiveVoucherType.MEMBER,
        voucher_id: parseInt(params.id as string),
        member_ids: memberIds
      }
      const resp = await voucherAPI.setVoucherMembers(token, input);
      console.log("resp", resp);
      setSelectedMembers([]);
      alert("Voucher given successfully");
    } catch (error) {
      console.log("error", error);
      alert("Failed to give voucher");
    }finally {
      setLoading(false);
    }
  }

  const getVoucherDetail = async () => {
    try {
      const token = session?.user?.token as string;
      const resp = await voucherAPI.getDetail(token, parseInt(params.id as string));
      console.log("resp", resp);
      setVoucher(resp.voucher_data);
      setVoucherStats(resp.stats);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    getVoucherDetail();
  }, [])

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
                  value={selectedMembers}
                />
              </div>
              
              <Button
                onClick={handleSubmit}
                text="Give Voucher"
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Members