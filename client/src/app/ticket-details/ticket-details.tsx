import { useParams } from "react-router-dom";
import { MenuItem, Select, SelectChangeEvent, Snackbar } from "@mui/material";

import styles from "./ticket-details.module.css";
import { getAllUsers, useUsersStore } from "client/src/states/users";
import { Fragment, useEffect, useMemo, useState } from "react";
import { LOADING_STATUS, Nullable } from "client/src/types";
import {
  assignTicketToUser,
  changeTicketStatus,
  getTicketById,
  useTicketsStore,
} from "client/src/states/tickets";
import { uniques } from "client/src/utils";
import Loading from "client/src/components/loading";

export function TicketDetails() {
  const { id: idParam } = useParams();
  const [assignee, setAssignee] = useState<Nullable<number>>(null);
  const [completed, setCompleted] = useState<Nullable<boolean>>(null);
  const [showNoti, setShowNoti] = useState(false);
  const [notiMsg, setNotiMsg] = useState("");

  const users = useUsersStore((state) => state.users);
  const usersLoadingStatus = useUsersStore((state) => state.usersLoadingStatus);
  const ticket = useTicketsStore((state) => state.ticketById);
  const updateTicketLoadingStatus = useTicketsStore(
    (state) => state.updateTicketLoadingStatus
  );
  const ticketByIdStatus = useTicketsStore(
    (state) => state.ticketByIdLoadingStatus
  );

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

  useEffect(() => {
    if (updateTicketLoadingStatus === LOADING_STATUS.LOADING) {
      setShowNoti(true);
      setNotiMsg("Updating!!");
      return;
    }
    if (updateTicketLoadingStatus === LOADING_STATUS.SUCCESS) {
      setShowNoti(true);
      setNotiMsg("Update ticket success!");
      return;
    }
    if (updateTicketLoadingStatus === LOADING_STATUS.FAIL) {
      setShowNoti(true);
      setNotiMsg("Update ticket failed!");
      return;
    }
  }, [updateTicketLoadingStatus]);

  const loadingStatus = useMemo(() => {
    const status = uniques([usersLoadingStatus, ticketByIdStatus]);
    if (status.length !== 1) {
      if (status.includes(LOADING_STATUS.FAIL)) return LOADING_STATUS.FAIL;
      return LOADING_STATUS.LOADING;
    }
    return usersLoadingStatus;
  }, [usersLoadingStatus, ticketByIdStatus]);

  const onChangeAssignee = (e: SelectChangeEvent) => {
    let userId = parseInt(e.target.value);
    if (!id) return;
    setAssignee(userId);
    assignTicketToUser(id, userId);
  };

  const onChangeTicketStatus = (e: SelectChangeEvent) => {
    if (!id) return;
    let completed = e.target.value === "true" ? true : false;
    setCompleted(completed);
    changeTicketStatus(id, completed);
  };

  const onHideNote = () => {
    setShowNoti(false);
  };

  return (
    <div className={styles["wrap"]}>
      {loadingStatus === LOADING_STATUS.LOADING && !ticket && <Loading />}
      {loadingStatus === LOADING_STATUS.FAIL && (
        <div className={styles["notFound"]}>
          <h1>Ticket not found!</h1>
        </div>
      )}
      {ticket && ticket.id === id && (
        <Fragment>
          <h1 className={styles["title"]}>Ticket {id}</h1>
          <div className={styles["dataRow"]}>
            <div className={styles["lb"]}>Assignee</div>
            <Select
              value={`${assignee}`}
              onChange={onChangeAssignee}
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
              value={`${completed}`}
              onChange={onChangeTicketStatus}
              className={styles["input"]}
            >
              <MenuItem value="false">Not completed</MenuItem>
              <MenuItem value="true"> Completed</MenuItem>
            </Select>
          </div>
          <div className={styles["dataRow"]}>
            <div className={styles["lb"]}>Description</div>
          </div>
          <div className={styles["ticketDescription"]}>
            {ticket?.description}
          </div>
        </Fragment>
      )}
      <Snackbar
        open={showNoti}
        autoHideDuration={3000}
        onClose={onHideNote}
        message={notiMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default TicketDetails;
