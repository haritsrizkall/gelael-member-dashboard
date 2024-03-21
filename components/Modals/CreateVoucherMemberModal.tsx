"use client"

import { useEffect, useState } from "react";
import Modal, { ModalProps } from "./Modal"
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import memberAPI from "@/api/member";
import voucherAPI, { InputSetVoucherMembers } from "@/api/voucher";
import AsyncSelect from 'react-select/async';
import { Voucher, VoucherStats } from "@/types/voucher";
import Button from "../Button";

interface CreateVoucherMemberModal extends ModalProps {
  voucherID: number
}

const CreateVoucherMemberModal = (props: CreateVoucherMemberModal) => {
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
    console.log("voucherid", voucherId);
    setLoading(true);
    try {
      const memberIds = selectedMembers.map(member => member.value)
      const token = session?.user?.token as string;
      const input: InputSetVoucherMembers = {
        voucher_id: voucherId,
        member_ids: memberIds
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
      setVoucher(resp.voucher_data);
      setVoucherStats(resp.stats);
      setVoucherId(resp.voucher_data.id)
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    getVoucherDetail();
    setVoucherId(props.voucherID)
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
    </Modal>
  )
}

export default CreateVoucherMemberModal;
