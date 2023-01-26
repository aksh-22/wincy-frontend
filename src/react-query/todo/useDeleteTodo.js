import { deleteTodo } from "api/todo";
import { useMutation, useQueryClient } from "react-query";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(deleteTodo, {
    onMutate: (localData) => {
      try {
        const { orgId, projectId, taskId, todoId, data } = localData;
        var previousTodo = queryClient.getQueryData([
          "todo",
          orgId,
          projectId,
          taskId,
        ]);
        var previousTodoCopy = JSON.parse(JSON.stringify(previousTodo));
        let todos = previousTodoCopy?.todos;

        for (let i = 0; i < todos?.length; i++) {
          if (todos[i]?._id?.[0]?._id === data?.assignee) {
            let newTodos = todos[i]?.todos?.filter(
              (item) => item?._id !== todoId
            );
            todos[i].todos = newTodos;
            break;
          } else {
          }
        }

        queryClient.setQueriesData(
          ["todo", orgId, projectId, taskId],
          previousTodoCopy
        );
      } catch (err) {
        console.error(err);
      }
      return { previousTodo, previousTodoCopy };
    },
    onSuccess: async (res, localData, context) => {
   let previousProject = queryClient.getQueryData([
        "projectInfo",
        localData?.orgId,
        localData?.projectId,
      ]);
      if (previousProject?.todosCount?.totalTodos) {
        previousProject.todosCount.totalTodos -= 1;
      }
      if (localData?.todo?.completed) {
        previousProject.todosCount.completedTodos -= 1;
      }
      queryClient?.setQueriesData(
        ["projectInfo", localData?.orgId, localData?.projectId],
        previousProject
      );
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
