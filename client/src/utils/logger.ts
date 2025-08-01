export function logError(message?: any, ...optionalParams: any[]) {
  console.error(message, ...optionalParams);
}

export function logInfo(message?: any, ...optionalParams: any[]) {
  console.log(message, ...optionalParams);
}

export function logWarn(message?: any, ...optionalParams: any[]) {
  console.warn(message, ...optionalParams);
}
