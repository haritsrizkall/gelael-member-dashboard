export type MemberList = {
  id: number;
  name: string;
  email: string;
}

export type Member = {
  id: number;
  user_id: number;
  store_id: number;
  name: string;
  point: number;
  avatar: string;
  created_at: string;
  updated_at: string;
  birth_date: string;
}

export type MemberWithStoreName = {
  id: number;
  user_id: number;
  store_id: number;
  name: string;
  point: number;
  avatar: string;
  created_at: string;
  updated_at: string;
  store_name: string;
  birth_date: string;
}