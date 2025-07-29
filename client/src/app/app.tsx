import { Routes, Route } from "react-router-dom";

import styles from "./app.module.css";
import Tickets from "./tickets/tickets";

const App = () => {
  return (
    <div className={styles["app"]}>
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<h2>Details Not Implemented</h2>} />
      </Routes>
    </div>
  );
};

export default App;
