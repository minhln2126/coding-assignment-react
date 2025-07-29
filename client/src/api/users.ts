import { apiGet, apiPost } from "./utils";
import { User } from "@acme/shared-models";

export async function apiGetUsers() {
  const response = await apiGet<User[]>("/users");
  return response;
}
