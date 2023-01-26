import {  getBugsCount } from 'api/bugs.service';
import { useQuery } from 'react-query';

export const useBugsCount = (orgId, projectId) => {
  const { isLoading, data } = useQuery(
    ['bugsCount', orgId, projectId],
    () => getBugsCount(orgId, projectId),
    {
      enabled: !!orgId && !!projectId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
};
