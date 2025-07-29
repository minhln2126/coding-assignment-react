import { FunctionComponent, useCallback, useMemo } from "react";
import classNames from "classnames";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

import { Ticket, User } from "@acme/shared-models";
import styles from "./ticket-list.module.css";
import { Nullable } from "client/src/types";

type TicketListProps = {
  className?: string;
  tickets: Ticket[];
  users: User[];
};

type TicketWithAssignee = Ticket & {
  assginee: Nullable<User>;
};

const TicketList: FunctionComponent<TicketListProps> = ({
  tickets = [],
  users = [],
}) => {
  const navigate = useNavigate();
  const handleRowClick = useCallback((ticketId: number) => {
    navigate(`/${ticketId}`);
  }, []);

  const ticketsWithAssignees = useMemo(() => {
    const result: TicketWithAssignee[] = [];
    const userMap: Record<string, User> = {};
    for (const user of users) {
      userMap[user.id] = user;
    }
    for (const ticket of tickets) {
      const item: TicketWithAssignee = { ...ticket, assginee: null };
      if (item.assigneeId) {
        item.assginee = userMap[item.assigneeId];
      }
      result.push(item);
    }
    return result;
  }, [users, tickets]);

  return (
    <TableContainer
      data-testid="ticket-list"
      className={styles["tableContainer"]}
      component={Paper}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ticketsWithAssignees.map((ticket) => (
            <TableRow key={ticket.id} onClick={() => handleRowClick(ticket.id)}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.description}</TableCell>
              <TableCell>
                <TicketStatus completed={ticket.completed} />
              </TableCell>
              <TableCell>
                <TicketAssignee assignee={ticket.assginee} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type TicketAssigneeProps = {
  assignee: Nullable<User>;
};

const TicketAssignee: FunctionComponent<TicketAssigneeProps> = ({
  assignee,
}) => {
  if (!assignee) return null;
  return <div>{assignee.name}</div>;
};

type TicketStatusProps = {
  completed: boolean;
};

const TicketStatus: FunctionComponent<TicketStatusProps> = ({ completed }) => {
  return (
    <div
      className={classNames(
        styles["ticketStatus"],
        completed ? styles["ticketCompleted"] : styles["ticketNotCompleted"]
      )}
    >
      {completed ? "Completed" : "Not completed"}
    </div>
  );
};

export default TicketList;
