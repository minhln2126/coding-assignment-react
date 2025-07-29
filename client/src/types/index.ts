export const LOADING_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  FAIL: "fail",
  SUCCESS: "success",
} as const;

export type LoadingStatus =
  (typeof LOADING_STATUS)[keyof typeof LOADING_STATUS];

export type Nullable<T> = T | null;
