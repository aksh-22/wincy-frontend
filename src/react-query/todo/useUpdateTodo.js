import {  updateTodo } from "api/todo";
import { useMutation, useQueryClient } from "react-query";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateTodo, {
    onMutate: (localData) => {
      
      try {
        const { orgId, projectId, taskId, todoId , data , key , isSort , sortData} = localData;
        var previousTodo = queryClient.getQueryData([
          "todo",
          orgId,
          projectId,
          taskId,
        ]);
        var previousTodoCopy = JSON.parse(JSON.stringify(previousTodo));
        let todos = previousTodoCopy?.todos;
        
           if(isSort){
            for (let i = 0; i < todos?.length; i++) {
             if(todos[i]?._id[0]?._id === data?.assignee){
                todos[i].todos = sortData
                break;
             }
            }
           }else{
            for (let i = 0; i < todos?.length; i++) {
                if (todos[i]?._id?.[0]?._id === data?.assignee) {
                    let newTodos = todos[i]?.todos
                  for(let j = 0 ; j < newTodos?.length ; j++){
                    if(newTodos[j]?._id === todoId){
                      newTodos[j][key] = Array.isArray(data?.[key]) ? data?.[key][0] : data?.[key]
                      break;
                    }
                  }
                  break;
                } else {
                }
              }

           }
      queryClient.setQueriesData(
          ["todo", orgId, projectId, taskId],
          {todos : [...previousTodoCopy?.todos]}
        );
      } catch (err) {
        console.error(err);
      }
      return { previousTodo , previousTodoCopy  };
    },
    onSuccess: async (res, localData) => {
      let previousProject = queryClient.getQueryData(["projectInfo", localData?.orgId, localData?.projectId])
      if(previousProject?.todosCount?.totalTodos){
        previousProject.todosCount.completedTodos+=1
      }else{
        previousProject.todosCount.completedTodos-= previousProject.todosCount.completedTodos === 0 ? 0 : 1
      }
      queryClient?.setQueriesData(["projectInfo", localData?.orgId, localData?.projectId] ,previousProject)
    },
    onError: (err, localData, context) => {
     queryClient.setQueriesData(
          ["todo", localData.orgId, localData.projectId, localData.taskId],
          context?.previousTodo
        );
    },
  });
  return { mutate, isLoading };
};
