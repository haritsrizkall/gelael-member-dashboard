export type Voucher = {
  id: number;
  title: string;
  description: string;
  type: string;
  amount: number;
  image: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
  start_at: string;
}

export type VoucherStats = {
  voucher_id: number;
  total_available_vouchers: number;
  total_used_vouchers: number;
  total_unused_vouchers: number;
  total_vouchers: number;
}

export type VoucherDetailResponse = {
  voucher_data: Voucher;
  stats: VoucherStats;
}

export enum VoucherType {
  UMUM = 'UMUM',
  MEMBER = 'MEMBER',
  GENERATED = 'GENERATED'
}

export function defaultVoucher(): Voucher {
  return {
    id: 0,
    title: "",
    description: "",
    type: "",
    amount: 0,
    image: "",
    expired_at: "",
    created_at: "",
    updated_at: "",
    start_at: ""
  }
}

export function defaultVoucherStats(): VoucherStats {
  return {
    voucher_id: 0,
    total_available_vouchers: 0,
    total_used_vouchers: 0,
    total_unused_vouchers: 0,
    total_vouchers: 0
  }
}

export enum GiveVoucherType {
  ALL = 'ALL',
  MEMBER = 'MEMBER',
  STORE = 'STORE'
}