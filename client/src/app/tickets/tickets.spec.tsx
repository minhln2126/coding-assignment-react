import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tickets from "client/src/app/tickets/tickets";

import * as ticketApi from "client/src/api/tickets";
import * as userApi from "client/src/api/users";

import { Ticket, User } from "@acme/shared-models";
import { init as initTicketsStore } from "client/src/states/tickets";
import { init as initUsersStore } from "client/src/states/users";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockTickets: Ticket[] = [
  {
    id: 1,
    description: "Test Ticket 1",
    completed: false,
    assigneeId: 1,
  },
  {
    id: 2,
    description: "Test Ticket 2",
    completed: true,
    assigneeId: 2,
  },
];
const mockUsers: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

jest.mock("client/src/api/tickets", () => ({
  apiGetTickets: jest.fn(),
  apiAddTicket: jest.fn(),
  apiGetTicketsById: jest.fn(),
  apiAssignUserToTicket: jest.fn(),
  apiMarkTicketComplete: jest.fn(),
  apiMarkTicketIncomplete: jest.fn(),
}));

jest.mock("client/src/api/users", () => ({
  apiGetUsers: jest.fn(),
}));

describe("Tickets Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    initTicketsStore();
    initUsersStore();
    (ticketApi.apiGetTickets as jest.Mock).mockResolvedValue(mockTickets);
    (userApi.apiGetUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it("Should render successfully", () => {
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });

  it("Should render Loading component initially when data is fetching", () => {
    render(<Tickets />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("ticket-list")).not.toBeInTheDocument();
  });

  it('Should show new ticket popup when "New ticket" button is clicked', async () => {
    const { getByTestId } = render(<Tickets />);
    await waitFor(() => {
      return expect(getByTestId("ticket-list")).toBeInTheDocument();
    });
    const newTicketButton = getByTestId("new-ticket-btn");
    expect(newTicketButton).toBeInTheDocument();
    await act(async () => {
      newTicketButton.click();
    });
    const newTicketPopup = getByTestId("new-ticket-popup");
    expect(newTicketPopup).toBeInTheDocument();
  });

  it("Should show correct data in ticket list", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(<Tickets />);
    await waitFor(() => {
      return expect(getByTestId("ticket-list")).toBeInTheDocument();
    });
    const ticketRows = getAllByTestId("ticket-row");
    expect(ticketRows).toHaveLength(mockTickets.length);
    for (const ticket of mockTickets) {
      expect(getByText(ticket.description)).toBeInTheDocument();
    }
  });
});
