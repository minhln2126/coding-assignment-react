import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LOADING_STATUS } from "client/src/types";
import {
  addTicket,
  getAllTickets,
  setTicketFilter,
  TicketFilter,
  useTicketsStore,
} from "client/src/states/tickets";

import TicketList from "client/src/components/ticket-list";
import Loading from "client/src/components/loading";
import Filter from "client/src/components/ticket-filter";
import AddIcon from "@mui/icons-material/Add";

import styles from "./tickets.module.css";
import { Button } from "@mui/material";
import NewTicketPopup from "client/src/components/new-ticket-popup";
import { Ticket } from "@acme/shared-models";
import { getAllUsers, useUsersStore } from "client/src/states/users";
import { uniques } from "client/src/utils";

const Tickets: FunctionComponent = () => {
  const filteredTicket = useTicketsStore((state) => state.filteredTickets);
  const ticketFilter = useTicketsStore((state) => state.ticketFilter);
  const ticketsLoadingStatus = useTicketsStore(
    (state) => state.ticketsLoadingStatus
  );

  const users = useUsersStore((state) => state.users);
  const usersLoadingStatus = useUsersStore((state) => state.usersLoadingStatus);

  const [showCreateTicketPopup, setShowCreateTicketPopup] = useState(false);

  const loadingStatus = useMemo(() => {
    const status = uniques([usersLoadingStatus, ticketsLoadingStatus]);
    if (status.length !== 1) {
      if (status.includes(LOADING_STATUS.FAIL)) return LOADING_STATUS.FAIL;
      return LOADING_STATUS.LOADING;
    }
    return usersLoadingStatus;
  }, [usersLoadingStatus, ticketsLoadingStatus]);

  useEffect(() => {
    if (ticketsLoadingStatus !== LOADING_STATUS.IDLE) return;
    getAllTickets();
  }, []);

  useEffect(() => {
    if (usersLoadingStatus !== LOADING_STATUS.IDLE) return;
    getAllUsers();
  }, []);

  const onFilterChange = useCallback((value: TicketFilter) => {
    setTicketFilter(value);
  }, []);

  const onShowCreateTicketPopup = useCallback(() => {
    setShowCreateTicketPopup(true);
  }, []);

  const onHideCreateTicketPopup = useCallback(() => {
    setShowCreateTicketPopup(false);
  }, []);

  const onCreateNewTicket = useCallback(
    async (ticket: Pick<Ticket, "description">) => {
      await addTicket(ticket);
    },
    []
  );

  return (
    <div className={styles["tickets"]}>
      {loadingStatus === LOADING_STATUS.LOADING && <Loading />}
      {loadingStatus === LOADING_STATUS.SUCCESS && (
        <Fragment>
          <h1 className={styles["title"]}>All tickets</h1>
          <Filter filter={ticketFilter} onFilterChange={onFilterChange} />
          <TicketList tickets={filteredTicket} users={users} />
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onShowCreateTicketPopup}
          >
            New ticket
          </Button>
        </Fragment>
      )}
      {loadingStatus === LOADING_STATUS.FAIL}
      {showCreateTicketPopup && (
        <NewTicketPopup
          onClose={onHideCreateTicketPopup}
          onSubmit={onCreateNewTicket}
        />
      )}
    </div>
  );
};

export default Tickets;
