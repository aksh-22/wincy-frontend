import { useQuery } from "react-query";

import { getOrgTeam } from "api/organisation";

export const useOrgTeam = (orgId) => {
  const { isLoading, data } = useQuery(
    ["organisationUsers", orgId],
    () => getOrgTeam(orgId),
    {
      enabled : !!orgId,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading, data };
};
