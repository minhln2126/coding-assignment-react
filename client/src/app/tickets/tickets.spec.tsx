import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tickets from "client/src/app/tickets/tickets";
import * as ticketsState from "client/src/states/tickets";
import * as usersState from "client/src/states/users"; // Assuming this module exists for users store and getAllUsers

import * as ticketApi from "client/src/api/tickets";
import * as userApi from "client/src/api/users";

import { LOADING_STATUS } from "client/src/types";
import { Ticket, User } from "@acme/shared-models";

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

const mockTicketsStoreState: ticketsState.TicketsStore = {
  tickets: [],
  ticketsLoadingStatus: LOADING_STATUS.IDLE,
  filteredTickets: [],
  ticketFilter: { completed: [true, false] },
  addTicketStatus: LOADING_STATUS.IDLE,
  ticketById: null,
  ticketByIdLoadingStatus: LOADING_STATUS.IDLE,
  updateTicketLoadingStatus: LOADING_STATUS.IDLE,
};

const mockUsersStoreState: usersState.UsersStore = {
  users: [],
  usersLoadingStatus: LOADING_STATUS.IDLE,
};

jest.mock("client/src/states/tickets", () => ({
  useTicketsStore: () => {
    return {
      getState: jest.fn(() => mockTicketsStoreState),
      setState: jest.fn((fn) => {
        const newState =
          typeof fn === "function" ? fn(mockTicketsStoreState) : fn;
        Object.assign(mockTicketsStoreState, newState);
      }),
      subscribe: jest.fn(),
      destroy: jest.fn(),
    };
  },
  getAllTickets: jest.fn(),
  addTicket: jest.fn(),
  setTicketFilter: jest.fn(),
  getTicketById: jest.fn(),
  changeTicketStatus: jest.fn(),
  assignTicketToUser: jest.fn(),
}));

jest.mock("client/src/states/users", () => ({
  useUsersStore: () => {
    return {
      getState: jest.fn(() => mockUsersStoreState),
      setState: jest.fn((fn) => {
        const newState =
          typeof fn === "function" ? fn(mockUsersStoreState) : fn;
        Object.assign(mockUsersStoreState, newState);
      }),
      subscribe: jest.fn(),
      destroy: jest.fn(),
    };
  },
  // Mock the getAllUsers action as it's called by the component
  getAllUsers: jest.fn(),
}));

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
    (ticketApi.apiGetTickets as jest.Mock).mockResolvedValue(mockTickets);
    (userApi.apiGetUsers as jest.Mock).mockResolvedValue(mockUsers);
    Object.assign(mockUsersStoreState, {
      users: [],
      usersLoadingStatus: LOADING_STATUS.IDLE,
    });
    Object.assign(mockTicketsStoreState, {
      tickets: [],
      ticketsLoadingStatus: LOADING_STATUS.IDLE,
      filteredTickets: [],
      ticketFilter: { completed: [true, false] },
      addTicketStatus: LOADING_STATUS.IDLE,
      ticketById: null,
      ticketByIdLoadingStatus: LOADING_STATUS.IDLE,
      updateTicketLoadingStatus: LOADING_STATUS.IDLE,
    });
  });

  it("Should render successfully", () => {
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });

  it("Should render Loading component initially when data is fetching", () => {
    mockTicketsStoreState.ticketsLoadingStatus = LOADING_STATUS.LOADING;
    mockUsersStoreState.usersLoadingStatus = LOADING_STATUS.LOADING;
    render(<Tickets />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("ticket-list")).not.toBeInTheDocument();
  });

  // it('Should show new ticket popup when "New ticket" button is clicked', async () => {
  // mockTicketsStoreState.ticketsLoadingStatus = LOADING_STATUS.SUCCESS;
  // mockUsersStoreState.usersLoadingStatus = LOADING_STATUS.SUCCESS;
  // mockTicketsStoreState.tickets = mockTickets;
  // mockTicketsStoreState.filteredTickets = mockTickets;
  // mockUsersStoreState.users = mockUsers;
  // render(<Tickets />);
  // const newTicketButton = await screen.findByTestId("new-ticket-btn");
  // expect(newTicketButton).toBeInTheDocument();
  // await act(async () => {
  //   newTicketButton.click();
  // });
  // });
});
