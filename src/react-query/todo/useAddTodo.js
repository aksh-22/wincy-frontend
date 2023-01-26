import { addTodo } from "api/todo";
import { useMutation, useQueryClient } from "react-query";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";

export const useAddTodo = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(addTodo, {
    onMutate: async (localData) => {
      try {
        const { orgId, projectId, taskId, data } = localData;
        var previousTodo = queryClient.getQueryData([
          "todo",
          orgId,
          projectId,
          taskId,
        ]);
        var previousTodoCopy = JSON.parse(JSON.stringify(previousTodo));
        let todos = previousTodoCopy?.todos;
        let assigneeFound = todos?.length ? true : false;
        var uniqueId = uniqueIdGenerator();
        for (let i = 0; i < todos?.length; i++) {
          if (todos[i]?._id?.[0]?._id === data?.assignee) {
            todos[i]?.todos?.unshift({
              completed: false,
              title: data?.title,
              _id: uniqueId,
              disabled: true,
            });
            assigneeFound = true;
            break;
          } else {
            assigneeFound = false;
          }
        }
        if (!assigneeFound) {
          todos.push({
            _id: [{ _id: data?.assignee }],
            todos: [
              {
                completed: false,
                title: data?.title,
                _id: uniqueId,
                disabled: true,
              },
            ],
          });
        }

        await queryClient.setQueriesData(
          ["todo", orgId, projectId, taskId],
          previousTodoCopy
        );
      } catch (err) {
        console.error(err);
      }
      return { previousTodo, previousTodoCopy, uniqueId };
    },
    onSuccess: async (data, localData, context) => {
      const { orgId, projectId, taskId } = localData;
      let newCopy = JSON.parse(JSON.stringify(context?.previousTodoCopy));
      try {
        let todos = newCopy?.todos;
        for (let i = 0; i < todos?.length; i++) {
          if (todos[i]?._id?.[0]?._id === localData?.data?.assignee) {
            let newTodos = todos[i]?.todos;
            for (let j = 0; j < newTodos?.length; j++) {
              if (newTodos[j]?._id === context?.uniqueId) {
                newTodos[j] = data?.todo;
                break;
              }
            }
            break;
          } else {
          }
        }

        let previousProject = queryClient.getQueryData(["projectInfo", localData?.orgId, localData?.projectId])
      if(previousProject?.todosCount?.totalTodos){
        previousProject.todosCount.totalTodos+=1
      }else{
        previousProject.todosCount={totalTodos : 1 , completedTodos : 0}
      }
      queryClient?.setQueriesData(["projectInfo", localData?.orgId, localData?.projectId] ,previousProject)

      } catch (err) {
        console.error(err);
      }
      await queryClient.setQueriesData(
        ["todo", orgId, projectId, taskId],
        newCopy
      );
    },
    onError: () => {},
  });
  return { mutate, isLoading };
};
