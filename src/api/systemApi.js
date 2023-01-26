import { axiosInstance } from "api/axiosInstance";

export const getSystemData = (type) => {
  return axiosInstance
    .get(`/system/${type}`)
    .then((res) => res.data);
};

// export const getTechnologies = () => {
//     return axiosInstance
//       .get(`/system/technologies`)
//       .then((res) => res.data?.data);
//   };


//   export const getPlatforms = () => {
//     return axiosInstance
//       .get(`/system/platforms`)
//       .then((res) => res.data?.data);
//   };