import { getSection } from 'api/bugs.service';
import {  useQueries} from 'react-query';

export const useSectionMultiple = (orgId, projectId, platformId) => {
  const userQueries = useQueries(
    platformId?.map(ids => {
      return {
        queryKey: ['section', orgId, projectId, ids],
        queryFn: () => getSection(orgId, projectId, ids),
      }
    })
  )
  console.log({userQueries})
  let data=""
  return {data}
};
