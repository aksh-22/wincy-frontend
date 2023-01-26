import { useQuery } from "react-query";

import { getProjects } from "api/project";
import { useSelector } from "react-redux";

export const useProjects = (projectStatus, projectType) => {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );

  const { isLoading, data, isError } = useQuery(
    ["activeProjects", orgId, projectStatus, projectType],
    () => getProjects(orgId, projectStatus, projectType),
    {
      enabled: !!orgId,
      retry: 0,
    }
  );
  return { isLoading, data, isError };
};
