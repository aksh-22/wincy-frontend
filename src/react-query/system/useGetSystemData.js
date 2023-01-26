// import { useQuery } from "react-query";
// import { getSystemData } from "api/systemApi";

// export const useGetSystemData = (type) => {
//   const { isLoading, data } = useQuery(
//     ["system", type],
//     () => getSystemData(type),
//     {
//       retry: 0,
//       refetchOnWindowFocus: false,
//     }
//   );
//   return { isLoading, data };
// };


import { useQuery } from "react-query";
import { getSystemData } from "api/systemApi";

export const useGetSystemData = (type) => {
  const { isLoading, data } = useQuery(
    ["system",  type],
    () => getSystemData(type),
    {
      retry: 0,
      // refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );
  return { isLoading, data };
};
