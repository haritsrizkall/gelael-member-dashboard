"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal, { ModalProps } from "./Modal"
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import memberAPI from "@/api/member";
import voucherAPI, { InputSetVoucherMembers } from "@/api/voucher";
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import { GiveVoucherType, Voucher, VoucherStats } from "@/types/voucher";
import Button from "../Button";
import storeAPI from "@/api/store";
import { VoucherMember, VoucherMemberWithNameAndEmail } from "@/types/voucherMember";

interface CreateVoucherMemberModal extends ModalProps {
  voucherID: number
}

const CreateVoucherMemberModal = (props: CreateVoucherMemberModal) => {
  const [selectedMembers, setSelectedMembers] = useState<{label: string, value: number}[]>([]);
  const [storeOptions, setStoreOptions] = useState<{label: string, value: number}[]>([]);
  const [selectedStores, setSelectedStores] = useState<{label: string, value: number}[]>([]);
  const [giveVoucherType, setGiveVoucherType] = useState<GiveVoucherType>(GiveVoucherType.ALL);
  const [loading, setLoading] = useState(false);
  const [voucherId, setVoucherId] = useState(0);
  const { data: session, status } = useSession();
  const params = useParams();

  const loadOptions = (inputValue: string) => {
    return memberAPI.getMemberList(session?.user?.token as string, 1, 5, inputValue).then((members) => {
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
      const storeIds = selectedStores.map(store => store.value)
      const token = session?.user?.token as string;
      const input: InputSetVoucherMembers = {
        voucher_id: voucherId,
        type: giveVoucherType,
        member_ids: memberIds,
        store_ids: storeIds
      }
      const resp = await voucherAPI.setVoucherMembers(token, input);
      console.log("resp", resp);
      setSelectedMembers([]);
      alert("Voucher given successfully");
      location.reload();
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
      setVoucherId(resp.voucher_data.id)
    } catch (error) {
      console.log("error", error);
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

  useEffect(() => {
    getVoucherDetail();
    setVoucherId(props.voucherID)
    getStores();
  }, [props.voucherID])

  return (
    <Modal {...props}>
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
                  Give Type
                </label>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" value={giveVoucherType} onChange={(e) => setGiveVoucherType(e.target.value as GiveVoucherType)}>
                    <option value={GiveVoucherType.ALL}>ALL</option>
                    <option value={GiveVoucherType.MEMBER}>Member</option>
                    <option value={GiveVoucherType.STORE}>Store</option>
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
                giveVoucherType === GiveVoucherType.MEMBER && (
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
                )
              }
              {
                giveVoucherType === GiveVoucherType.STORE && (
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
              <Button
                onClick={handleSubmit}
                text="Give Voucher"
                isLoading={loading}
              />
            </div>
          </div>
        </div>
    </Modal>
  )
}

export default CreateVoucherMemberModal;
