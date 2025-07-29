import { FunctionComponent, useCallback } from "react";

import styles from "./ticket-filter.module.css";
import { Checkbox } from "@mui/material";
import { TicketFilter } from "client/src/states/tickets";

type TicketFilterProps = {
  filter: TicketFilter;
  onFilterChange: (value: TicketFilter) => void;
};

const TicketFilterComp: FunctionComponent<TicketFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  const onToggleStatus = useCallback(
    (value: boolean) => {
      let filterStatus = filter.completed || [];
      if (filterStatus.includes(value)) {
        filterStatus = filterStatus.filter((v) => v !== value);
      } else {
        filterStatus = [...filterStatus, value];
      }
      console.log(filterStatus);
      onFilterChange({ completed: filterStatus });
    },
    [filter, onFilterChange]
  );

  return (
    <div className={styles["ticketFilter"]}>
      <span>Status:</span>
      <div className={styles["checkboxContainer"]}>
        <Checkbox
          onChange={() => onToggleStatus(true)}
          checked={filter.completed.includes(true)}
        />
        <span>Completed</span>
      </div>
      <div className={styles["checkboxContainer"]}>
        <Checkbox
          onChange={() => onToggleStatus(false)}
          checked={filter.completed.includes(false)}
        />
        <span>Not completed</span>
      </div>
    </div>
  );
};

export default TicketFilterComp;
