import { getProjectTask } from "api/project"
import { useQuery } from "react-query"

export const useProjectAllTasks = ({orgId, projectId}) => { 
return useQuery(["projectAllTasks", orgId, projectId], async () => getProjectTask({orgId, projectId}))
}