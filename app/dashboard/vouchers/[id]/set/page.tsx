"use client"

import memberAPI from "@/api/member";
import voucherAPI, { InputSetVoucherMembers } from "@/api/voucher";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { Voucher, VoucherStats } from "@/types/voucher";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
              Voucher Detail
            </h3>
          </div>
          <div>
            <div className="p-6.5 flex">
              <div className="mr-10 flex-none">
                <Image
                  src={voucher?.image}
                  loader={() => voucher.image}
                  alt="voucher"
                  width={300}
                  height={300}
                />
              </div>
              <div className="flex-1 grow">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="title"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                    <input
                      required
                      type="text"
                      placeholder="description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Type
                  </label>
                    <input
                      required
                      type="text"
                      placeholder="text"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amount
                  </label>
                    <input
                      required
                      type="currency"
                      placeholder="amount"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Expired at
                  </label>
                  <div className="relative">
                    <input
                      required
                      // onChange={(e) => setExpiredAt(e.target.value)}
                      // value={expiredAt}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Start at
                  </label>
                  <div className="relative">
                    <input
                      required
                      // onChange={(e) => setExpiredAt(e.target.value)}
                      // value={expiredAt}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
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