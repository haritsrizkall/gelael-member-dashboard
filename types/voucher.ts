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
}

export type VoucherMember = {
  id: number;
  member_id: number;
  voucher_id: number;
  used: boolean;
  created_at: Date;
  updated_at: Date;
  email: string;
  name: string;
}