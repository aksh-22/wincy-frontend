import { useQuery } from 'react-query';

import { getProjectAttachment } from 'api/project';

export const useProjectAttachment = (orgId, projectId) => {
  const { isLoading, data } = useQuery(
    ['projectAttachment', orgId, projectId],
    () => getProjectAttachment(orgId, projectId),
    {
      enabled: !!orgId && !!projectId,
      retry: 0,
    }
  );
  return { isLoading, data };
};
