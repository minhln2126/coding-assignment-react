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
  const [ticketData, setTicketData] = useState<Pick<Ticket, "description">>({
    description: "",
  });

  useEffect(() => {
    console.log(ticketData);
  }, [ticketData]);

  useEffect(() => {
    console.log("onclose");
  }, [onClose]);

  const onSubmit = useCallback(() => {
    console.log(ticketData);
    _onSubmit?.(ticketData);
  }, [ticketData]);

  const popupRef = useOnClickOutside<HTMLDivElement>(onClose);

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
        <div>
          <textarea
            value={ticketData.description}
            onChange={onDescriptionChange}
          />
        </div>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default NewTicketPopup;
