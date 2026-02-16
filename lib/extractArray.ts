export const extractArray = (res: any) => {
  return res?.data?.data || res?.data || [];
};
