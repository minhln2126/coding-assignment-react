import { FunctionComponent } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./loading.module.css";

type LoadingProps = {
  iconSize?: number;
};

const Loading: FunctionComponent<LoadingProps> = ({ iconSize = 20 }) => {
  return (
    <div className={styles["loading"]}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
