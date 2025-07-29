import { Ticket } from "@acme/shared-models";
import { FunctionComponent, useCallback, useEffect, useState } from "react";

import styles from "./new-ticket-popup.module.css";
import { Button, debounce } from "@mui/material";
import { useOnClickOutside } from "client/src/hooks/use-outside-click";

type NewTicketPopupProps = {
  onClose: () => void;
  onSubmit: (ticket: Pick<Ticket, "description">) => void;
};

const NewTicketPopup: FunctionComponent<NewTicketPopupProps> = ({
  onClose,
  onSubmit: _onSubmit,
}) => {
  const popupRef = useOnClickOutside<HTMLDivElement>(onClose);
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketData, setTicketData] = useState<Pick<Ticket, "description">>({
    description: "",
  });

  const onSubmit = useCallback(() => {
    if (!ticketData.description) {
      setErrorMsg("Please enter ticket description!");
      return;
    }
    setErrorMsg("");
    _onSubmit?.(ticketData);
    onClose();
  }, [ticketData]);

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTicketData((curValue) => {
        return {
          ...curValue,
          description: event.target.value,
        };
      });
    },
    []
  );

  return (
    <div className={styles["modal"]}>
      <div className={styles["popup"]} ref={popupRef}>
        <h4>New ticket</h4>
        <div className={styles["inputContainer"]}>
          <textarea
            value={ticketData.description}
            onChange={onDescriptionChange}
          />
          {errorMsg && <div className={styles["errorMsg"]}>{errorMsg}</div>}
        </div>
        <Button
          className={styles["submitBtn"]}
          onClick={onSubmit}
          variant="contained"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default NewTicketPopup;
