/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractArray = (res: any) => {
  return res?.data?.data || res?.data || [];
};
