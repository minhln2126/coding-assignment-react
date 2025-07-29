import { create } from "zustand";
import { Ticket, User } from "@acme/shared-models";
import {
  apiGetTickets,
  apiAddTicket,
  apiGetTicketsById,
  apiAssignUserToTicket,
  apiMarkTicketComplete,
  apiMarkTicketIncomplete,
} from "client/src/api/tickets";
import { LOADING_STATUS, LoadingStatus } from "client/src/types";
import { logError, logWarn } from "client/src/utils/logger";
import { getObjectKeys } from "client/src/utils";
import { UNDEF } from "client/src/constants";
import Tickets from "client/src/app/tickets/tickets";

export type TicketFilter = {
  completed: Ticket["completed"][];
};

type TicketsStore = {
  // List tickets
  tickets: Ticket[];
  ticketsLoadingStatus: LoadingStatus;
  filteredTickets: Ticket[];
  ticketFilter: TicketFilter;
  // Add ticket
  addTicketStatus: LoadingStatus;
  //
  ticketById?: Ticket;
  ticketByIdStatus: LoadingStatus;
  assignUserToTicketStatus: LoadingStatus;
  changeTicketStatus: LoadingStatus;
};

export const useTicketsStore = create<TicketsStore>((set) => ({
  tickets: [],
  ticketsLoadingStatus: LOADING_STATUS.IDLE,
  ticketFilter: {
    completed: [true, false],
  },
  filteredTickets: [],

  addTicketStatus: LOADING_STATUS.IDLE,
  ticketByIdStatus: LOADING_STATUS.IDLE,
  assignUserToTicketStatus: LOADING_STATUS.IDLE,
  changeTicketStatus: LOADING_STATUS.IDLE,
}));

export async function getAllTickets() {
  try {
    useTicketsStore.setState({ ticketsLoadingStatus: LOADING_STATUS.LOADING });
    const tickets = await apiGetTickets();
    const filter = useTicketsStore.getState().ticketFilter;
    const filteredTickets = applyTicketFilter(tickets, filter);
    useTicketsStore.setState({
      tickets,
      filteredTickets,
      ticketsLoadingStatus: LOADING_STATUS.SUCCESS,
    });
  } catch (e) {
    logError(e);
    useTicketsStore.setState({ ticketsLoadingStatus: LOADING_STATUS.FAIL });
  }
}

export async function addTicket(ticket: Pick<Ticket, "description">) {
  try {
    useTicketsStore.setState({ addTicketStatus: LOADING_STATUS.LOADING });
    await apiAddTicket(ticket);
    useTicketsStore.setState({ addTicketStatus: LOADING_STATUS.SUCCESS });
  } catch (e) {
    logError(e);
    useTicketsStore.setState({ addTicketStatus: LOADING_STATUS.FAIL });
  }
}

export function setTicketFilter(value: TicketFilter) {
  const allTickets = useTicketsStore.getState().tickets;
  const filteredTickets = applyTicketFilter(allTickets, value);
  useTicketsStore.setState({
    filteredTickets,
    ticketFilter: value,
  });
}

function applyTicketFilter(tickets: Ticket[], filter: TicketFilter): Ticket[] {
  if (!filter || !tickets) {
    logWarn("Invalid params for filter:", { filter, tickets });
    return tickets;
  }
  const result: Ticket[] = tickets.filter((ticket) => {
    const filterKeys = getObjectKeys(filter);
    for (const filterKey of filterKeys) {
      if (filter[filterKey] === UNDEF) continue;
      if (!filter[filterKey].includes(ticket[filterKey])) {
        return false;
      }
    }
    return true;
  });
  return result;
}

export async function getTicketById(id: number) {
  try {
    useTicketsStore.setState({ ticketByIdStatus: LOADING_STATUS.LOADING });
    const ticket = await apiGetTicketsById(id);
    useTicketsStore.setState({
      ticketById: ticket,
      ticketByIdStatus: LOADING_STATUS.SUCCESS,
    });
  } catch (e) {
    logError(e);
    useTicketsStore.setState({ ticketByIdStatus: LOADING_STATUS.FAIL });
  }
}

export async function changTicketStatus(ticketId: number, completed: boolean) {
  try {
    useTicketsStore.setState({
      changeTicketStatus: LOADING_STATUS.LOADING,
    });
    if (completed) {
      await apiMarkTicketComplete(ticketId);
    } else {
      await apiMarkTicketIncomplete(ticketId);
    }
    await getTicketById(ticketId);
    useTicketsStore.setState({
      changeTicketStatus: LOADING_STATUS.SUCCESS,
      // Reset ticket list to get latest data when back to listing page
      ticketsLoadingStatus: LOADING_STATUS.IDLE,
      tickets: [],
    });
  } catch (e) {
    logError(e);
    useTicketsStore.setState({ changeTicketStatus: LOADING_STATUS.FAIL });
  }
}

export async function assignTicketToUser(ticketId: number, userId: number) {
  try {
    useTicketsStore.setState({
      assignUserToTicketStatus: LOADING_STATUS.LOADING,
    });
    await apiAssignUserToTicket(ticketId, userId);
    await getTicketById(ticketId);
    useTicketsStore.setState({
      assignUserToTicketStatus: LOADING_STATUS.SUCCESS,
      // Reset ticket list to get latest data when back to listing page
      ticketsLoadingStatus: LOADING_STATUS.IDLE,
      tickets: [],
    });
  } catch (e) {
    logError(e);
    useTicketsStore.setState({ assignUserToTicketStatus: LOADING_STATUS.FAIL });
  }
}
