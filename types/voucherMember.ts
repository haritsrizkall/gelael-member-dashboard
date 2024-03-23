export type VoucherMember = {
  id: number;
  member_id: number;
  voucher_id: number;
  used: boolean;
  created_at: string;
  updated_at: string;
  voucher_code: string;
  used_at: string | null;
  used_at_store: string | null;
  smartsoft_id: string;
}

export type VoucherMemberWithNameAndEmail = VoucherMember & { email: string; name: string }