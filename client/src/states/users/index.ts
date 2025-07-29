import { create } from "zustand";
import { LOADING_STATUS, LoadingStatus, Nullable } from "client/src/types";
import { logError } from "client/src/utils/logger";
import { apiGetUsers } from "client/src/api/users";
import { User } from "@acme/shared-models";

type UsersStore = {
  users: User[];
  usersLoadingStatus: LoadingStatus;
};

export const useUsersStore = create<UsersStore>(() => ({
  users: [],
  usersLoadingStatus: LOADING_STATUS.IDLE,
}));

export async function getAllUsers() {
  try {
    useUsersStore.setState({ usersLoadingStatus: LOADING_STATUS.LOADING });
    const users = await apiGetUsers();
    useUsersStore.setState({
      users,
      usersLoadingStatus: LOADING_STATUS.SUCCESS,
    });
  } catch (e) {
    logError(e);
    useUsersStore.setState({ usersLoadingStatus: LOADING_STATUS.FAIL });
  }
}

export function getUserLoadingStatus() {
  return useUsersStore.getState().usersLoadingStatus;
}

export function getUserById(userId: number): Nullable<User> {
  const users = useUsersStore.getState().users;
  const user = users.find((usr) => usr.id === userId);
  return user || null;
}
