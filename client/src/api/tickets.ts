import { apiGet, apiPost } from './utils';
import { Ticket } from '@acme/shared-models';

export async function apiGetTickets() {
  const response = await apiGet<Ticket[]>('/tickets');
  return response;
}

export async function apiAddTicket(ticket: Pick<Ticket, 'description'>) {
  const response = await apiPost<Ticket>('/tickets', ticket);
  return response;
}