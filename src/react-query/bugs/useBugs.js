import { getBugs } from 'api/bugs.service';
import { useQuery } from 'react-query';

export const useBugs = (orgId, projectId, platform, pageNo) => {
  const { isLoading, data } = useQuery(
    ['bugs', orgId, projectId, platform ?? 'un-categorizes', pageNo??1],
    () => getBugs(orgId, projectId, platform ?? 'un-categorizes', pageNo??1),
    {
      enabled: !!orgId && !!projectId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
};
