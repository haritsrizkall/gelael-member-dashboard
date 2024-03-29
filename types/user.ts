import { Role } from "./role";

export type User = {
  id: number;
  email: string;
  phone_number: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type UserWithRoles = {
  id: number;
  email: string;
  phone_number: string;
  name: string;
  created_at: string;
  updated_at: string;
  roles: Role[]
}