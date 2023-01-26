import { getTodo } from 'api/todo';
import { useQuery } from 'react-query';

import { useSelector } from 'react-redux';

export const useTodo = (orgId ,projectId , taskId , assignees , milestoneId) => {
//   const orgId = useSelector(
//     (state) => state.userReducer?.selectedOrganisation?._id
//   );

  const { isLoading, data } = useQuery(
    ['todo', orgId, projectId , taskId],
    () => getTodo(orgId, projectId , taskId),
    {
      enabled: !!orgId && !!projectId && !!taskId,
      retry: 0,
    }
  );
  let newData= []
  if (data !== undefined) {
    let newArray = [];
    let count =0
    assignees?.map((item) => {
      let getAssignee = data?.todos?.filter(
        (row) => row?._id?.[0]?._id === item?._id
      );
      count=0;
      getAssignee.length  && 
      getAssignee?.[0]?.todos?.map((item) =>{
        if(item?.completed ){
          count+=1
        }
        return null
      })
      newArray.push({
        todo: getAssignee.length ? getAssignee?.[0]?.todos : [],
        assignee: item,
        taskId: taskId,
        orgId,
        projectId: projectId,
        milestoneId: milestoneId,
        todoLength :getAssignee.length ?  getAssignee?.[0]?.todos?.length : 0,
        completed : count
      });
      // console.log(count , newArray?.)
      return null
    });
    newData = newArray
  }

  return { isLoading, newData };
};
