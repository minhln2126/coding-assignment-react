import { useParams } from "react-router-dom";

import styles from "./ticket-details.module.css";
import { getAllUsers, useUsersStore } from "client/src/states/users";
import { Fragment, useEffect, useMemo, useState } from "react";
import { LOADING_STATUS, Nullable } from "client/src/types";
import {
  assignTicketToUser,
  changTicketStatus,
  getTicketById,
  useTicketsStore,
} from "client/src/states/tickets";
import { uniques } from "client/src/utils";
import Loading from "client/src/components/loading";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

/* eslint-disable-next-line */
export interface TicketDetailsProps {}

export function TicketDetails() {
  const { id: idParam } = useParams();
  const [assignee, setAssignee] = useState<Nullable<number>>(null);
  const [completed, setCompleted] = useState<Nullable<boolean>>(null);

  const users = useUsersStore((state) => state.users);
  const usersLoadingStatus = useUsersStore((state) => state.usersLoadingStatus);
  const ticket = useTicketsStore((state) => state.ticketById);
  const ticketByIdStatus = useTicketsStore((state) => state.ticketByIdStatus);

  const id: Nullable<number> = useMemo(() => {
    if (!idParam) return null;
    return parseInt(idParam);
  }, [idParam]);

  useEffect(() => {
    if (usersLoadingStatus !== LOADING_STATUS.IDLE) return;
    getAllUsers();
  }, []);

  useEffect(() => {
    if (!id) return;
    getTicketById(id);
  }, [id]);

  useEffect(() => {
    if (!ticket) return;
    setAssignee(ticket.assigneeId);
    setCompleted(ticket.completed);
  }, [ticket]);

  const loadingStatus = useMemo(() => {
    const status = uniques([usersLoadingStatus, ticketByIdStatus]);
    if (status.length !== 1) {
      if (status.includes(LOADING_STATUS.FAIL)) return LOADING_STATUS.FAIL;
      return LOADING_STATUS.LOADING;
    }
    return usersLoadingStatus;
  }, [usersLoadingStatus, ticketByIdStatus]);

  const handleChangeAssignee = (e: SelectChangeEvent) => {
    let userId = parseInt(e.target.value);
    if (!id) return;
    setAssignee(userId);
    assignTicketToUser(id, userId);
  };

  const handleCompletedTicket = (e: SelectChangeEvent) => {
    if (!id) return;
    let status = e.target.value === "true" ? true : false;
    setCompleted(status);
    changTicketStatus(id, status);
  };

  return (
    <div className={styles["container"]}>
      {loadingStatus === LOADING_STATUS.LOADING && <Loading />}
      {loadingStatus === LOADING_STATUS.SUCCESS && (
        <div className={styles["wrap"]}>
          <h1 className={styles["title"]}>Ticket {id}</h1>
          <div className={styles["dataRow"]}>
            <div className={styles["lb"]}>Assignee</div>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={`${assignee}`}
              onChange={handleChangeAssignee}
              className={styles["input"]}
            >
              {users.map((user) => {
                return (
                  <MenuItem value={`${user.id}`} key={user.id}>
                    {user.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div className={styles["dataRow"]}>
            <div className={styles["lb"]}>Status</div>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={`${completed}`}
              onChange={handleCompletedTicket}
              className={styles["input"]}
            >
              <MenuItem value="false">Not completed</MenuItem>
              <MenuItem value="true"> Completed</MenuItem>
            </Select>
          </div>
          <div className={styles["dataRow"]}>
            <div className={styles["lb"]}>Description</div>
          </div>
          <div className={styles["ticket-description"]}>
            {ticket?.description}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketDetails;
