import { Routes, Route } from "react-router-dom";

import styles from "./app.module.css";
import Tickets from "./tickets/tickets";
import TicketDetails from "./ticket-details/ticket-details";

const App = () => {
  return (
    <div className={styles["app"]}>
      <Routes>
        <Route path="/" element={<Tickets />} />
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
