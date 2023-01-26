import { copyTo } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";

export const useCopyTasks = () => {
  const queryClient = useQueryClient();

  return useMutation(copyTo, {
    onMutate: async () => {},
    onSuccess: async () => {},
    onError: async () => {},
  });
};
