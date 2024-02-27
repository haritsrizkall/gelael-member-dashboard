import { DeleteResponse, SuccessResponse } from "@/types/response";
import { Voucher, VoucherMember } from "@/types/voucher";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface VoucherAPI {
  getVouchers: (token: string, page: number, pageSize: number, isExpired?: boolean) => Promise<Voucher[]>;
  getVoucherMemberByVoucherId: (token: string, voucherId: number) => Promise<VoucherMember[]>;
  getById: (token: string, id: number) => Promise<Voucher>;
  createVoucher: (token: string, input: InputCreateVoucher) => Promise<Voucher>;
  deleteVoucher: (token: string, id: number) => Promise<DeleteResponse>;
  updateVoucher: (token: string, input: InputUpdateVoucher) => Promise<Voucher>;
  setVoucherMembers: (token: string, input: InputSetVoucherMembers) => Promise<SuccessResponse>;
}

export type InputCreateVoucher = {
  title: string;
  description: string;
  type: string;
  amount: number;
  image: string;
  expired_at: Date;
}

export type InputUpdateVoucher = {
  id: number;
  title: string;
  description: string;
  image: string;
  expired_at: Date;
}

export type InputSetVoucherMembers = {
  voucher_id: number;
  member_ids: number[];
}


const voucherAPI: VoucherAPI = {
  setVoucherMembers: async (token: string, input: InputSetVoucherMembers) => {
    const resp = await axios.post(`${getApiUrl()}/vouchers/set-vouchers`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as SuccessResponse
  },
  updateVoucher: async (token: string, input: InputUpdateVoucher) => {
    const resp = await axios.put(`${getApiUrl()}/vouchers/${input.id}`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Voucher
  },
  getVouchers: async (token: string, page: number, pageSize: number, isExpired?: boolean) => {
    const url = new URL(`${getApiUrl()}/vouchers`)
    url.searchParams.append("page", page.toString())
    url.searchParams.append("pageSize", pageSize.toString())
    if (isExpired) {
      url.searchParams.append("isExpired", "true")
    }
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })

    return resp.data.data as Voucher[]
  },
  getVoucherMemberByVoucherId: async (token: string, voucherId: number) => {
    const resp = await axios.get(`${getApiUrl()}/vouchers/${voucherId}/members`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as VoucherMember[]
  },
  getById: async (token: string, id: number) => {
    const resp = await axios.get(`${getApiUrl()}/vouchers/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Voucher
  },
  createVoucher: async (token: string, input: InputCreateVoucher) => {
    const resp = await axios.post(`${getApiUrl()}/vouchers`, input, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as Voucher
  },
  deleteVoucher: async (token: string, id: number) => {
    const resp = await axios.delete(`${getApiUrl()}/vouchers/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as DeleteResponse
  }
}

export default voucherAPI

