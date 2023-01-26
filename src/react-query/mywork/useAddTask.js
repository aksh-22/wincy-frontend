import { addHours } from "api/myWork";
import { useMutation, useQueryClient } from "react-query";

export const useAddTask = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate: mutateTask, isLoading: isLoadingTask } = useMutation(
    addHours,
    {
      onSuccess: (data , localData) => {
        // console.log("onSuccess data:", data , localData);
        handleClose();
      },
      onError: (error) => {
        console.log("error:", error);
      },
    }
  );
  return { mutateTask, isLoadingTask };
};
