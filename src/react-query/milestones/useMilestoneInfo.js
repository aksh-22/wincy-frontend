import { useQuery } from 'react-query';
import { getMilestoneInfo } from 'api/milestone';

export const useMilestoneInfo = (orgId, projectId, milestoneId) => {
    const { isLoading, data } = useQuery(
        [`milestone`, orgId, projectId, milestoneId],
        () => getMilestoneInfo(orgId, projectId, milestoneId),
        {
            enabled: !!orgId && !!projectId && !!milestoneId,
            retry: 0,
            refetchOnWindowFocus: false,
        }
    );
    return { isLoading, data };
};
