import { axiosInstance } from "api/axiosInstance";

export const userData = (orgId, status) => {
  return axiosInstance.get("users/profile").then((res) => res?.data?.data);
};
