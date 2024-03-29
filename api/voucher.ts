import { Meta } from "@/types/meta";
import { DeleteResponse, SuccessResponse } from "@/types/response";
import { GiveVoucherType, Voucher, VoucherDetailResponse } from "@/types/voucher";
import { VoucherMemberWithNameAndEmail } from "@/types/voucherMember";
import { getApiUrl } from "@/utils/utils";
import axios from "axios";

interface VoucherAPI {
  getVouchers: (token: string, params: getVouchersParams) => Promise<VoucherPaginationRepsonse>;
  getVoucherMemberByVoucherId: (token: string, voucherId: number) => Promise<getVoucherMemberByVoucherIdResponse>;
  getById: (token: string, id: number) => Promise<Voucher>;
  createVoucher: (token: string, input: InputCreateVoucher) => Promise<Voucher>;
  deleteVoucher: (token: string, id: number) => Promise<DeleteResponse>;
  updateVoucher: (token: string, input: InputUpdateVoucher) => Promise<Voucher>;
  setVoucherMembers: (token: string, input: InputSetVoucherMembers) => Promise<SuccessResponse>;
  getDetail: (token: string, id: number) => Promise<VoucherDetailResponse>;
}

type getVouchersParams = {
  page?: number;
  q?: string;
  page_size?: number;
  is_expired?: boolean;
  voucher_type?: string;
}

export type VoucherPaginationRepsonse = {
  data: Voucher[];
  meta: Meta;
}

export type InputCreateVoucher = {
  title: string;
  description: string;
  type: string;
  amount: number;
  image: string;
  expired_at: Date;
  start_at: Date;
  count: number;
}

export type InputUpdateVoucher = {
  id: number;
  title: string;
  description: string;
  image: string;
  expired_at: Date;
  start_at: Date;
}

export type InputSetVoucherMembers = {
  voucher_id: number;
  type: GiveVoucherType;
  store_ids?: number[];
  member_ids?: number[];
}

export type getVoucherMemberByVoucherIdResponse = {
  data: VoucherMemberWithNameAndEmail[]
  meta: Meta
}


const voucherAPI: VoucherAPI = {
  getDetail: async (token: string, id: number) => {
    const resp = await axios.get(`${getApiUrl()}/vouchers/${id}/detail`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data.data as VoucherDetailResponse
  },
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
  getVouchers: async (token: string, params: getVouchersParams) => {
    const url = new URL(`${getApiUrl()}/vouchers`)
    url.searchParams.append("page", (params.page || 1).toString())
    url.searchParams.append("page_size", (params.page_size || 10).toString())
    if (params.q) url.searchParams.append("q", params.q)
    if (params.is_expired) url.searchParams.append("is_expired", params.is_expired.toString())
    if (params.voucher_type) url.searchParams.append("voucher_type", params.voucher_type)
    const resp = await axios.get(url.toString(), {
      headers: {
        Authorization: "Bearer " + token
      }
    })

    return resp.data as VoucherPaginationRepsonse
  },
  getVoucherMemberByVoucherId: async (token: string, voucherId: number) => {
    const resp = await axios.get(`${getApiUrl()}/vouchers/${voucherId}/members`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    return resp.data as getVoucherMemberByVoucherIdResponse
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

