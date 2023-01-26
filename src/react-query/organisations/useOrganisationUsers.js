import { useQuery } from "react-query";

import { getOrgUsers } from "api/organisation";

export const useOrganisationUsers = (orgId, projectId) => {
  const { isLoading, data } = useQuery(
    ["organisationUsers", orgId],
    () => getOrgUsers(orgId, projectId),
    {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!orgId && !!projectId,
    }
  );

  return { isLoading, data };
};
