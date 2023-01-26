import { useQuery } from "react-query";

import { getProjectMilestones } from "api/project";

export const useMilestones = (orgId, projectId) => {
  const { isLoading, data:milestone } = useQuery(
    ["milestones", orgId, projectId],
    () => getProjectMilestones(orgId, projectId),
    {
      enabled: !!orgId && !!projectId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

// let obj = {
//   active : [],
//   notStarted  : [],
//   Completed : [],
// }

let data=[
  {
    status : "Active" , 
    milestones : []
  },
  {
    status : "Not Started" , 
    milestones : []
  },
  {
    status : "Completed" , 
    milestones : []
  },
 { milestonesData : milestone?.milestones??[]}
]
  if(milestone?.milestones){
    milestone?.milestones?.map((item) => {
      if(item?.status === "Active"){
        data[0].milestones.push(item)
      }
      if(item?.status === "NotStarted"){
        data[1].milestones.push(item)
      }
      if(item?.status === "Completed"){
        data[2].milestones.push(item)
      }
      return null
    })

   
  }


  return { isLoading,data };
};
