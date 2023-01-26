import { useQuery } from "react-query";

import { getInvitedOrgUsers } from "api/organisation";

export const useInvitedOrgUser = (orgId) => {
  const { isLoading, data } = useQuery(
    ["organisationInvitedUsers", orgId],
    () => getInvitedOrgUsers(orgId),
    {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading, data };
};
