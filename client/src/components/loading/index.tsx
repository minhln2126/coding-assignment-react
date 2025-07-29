import { FunctionComponent } from "react";

type LoadingProps = {
  iconSize?: number;
};

const Loading: FunctionComponent<LoadingProps> = ({ iconSize = 20 }) => {
  return <div>Loading...</div>;
};

export default Loading;
