import { apiDelete, apiGet, apiPost, apiPut } from "./utils";
import { Ticket } from "@acme/shared-models";

export async function apiGetTickets() {
  const response = await apiGet<Ticket[]>("/tickets");
  return response;
}

export async function apiAddTicket(ticket: Pick<Ticket, "description">) {
  const response = await apiPost<Ticket>("/tickets", ticket);
  return response;
}

export async function apiAssignUserToTicket(ticketId: number, userId: number) {
  const response = await apiPut(`/tickets/${ticketId}/assign/${userId}`);
  return response;
}

export async function apiGetTicketsById(id: number) {
  const response = await apiGet<Ticket>(`/tickets/${id}`);
  return response;
}

export async function apiMarkTicketComplete(ticketId: number) {
  const response = await apiPut(`/tickets/${ticketId}/complete`);
  return response;
}

export async function apiMarkTicketIncomplete(ticketId: number) {
  const response = await apiDelete(`/tickets/${ticketId}/complete`);
  return response;
}
