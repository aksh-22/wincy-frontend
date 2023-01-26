import { getSection } from 'api/bugs.service';
import { useQuery , useQueries} from 'react-query';

export const useSection = (orgId, projectId, platformId) => {
  const { isLoading, data } = useQuery(
    ['section', orgId, projectId, platformId ],
    () => getSection(orgId, projectId, platformId ),
    {
      enabled: !!orgId && !!projectId && !!platformId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
  // const userQueries = useQueries(
  //   platformId?.map(ids => {
  //     return {
  //       queryKey: ['section', orgId, projectId, ids],
  //       queryFn: () => getSection(orgId, projectId, ids),
  //     }
  //   })
  // )
  // console.log({userQueries})
};
