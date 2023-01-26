import { useMutation, useQueryClient } from "react-query";
import { editRoleAndDesignation } from "api/organisation";

export const useEditRoleAndDesignation = (orgId, userId) => {
  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(editRoleAndDesignation, {
    onSuccess: ({ data }) => {
      const prevData = queryClient.getQueryData(["organisationUsers", orgId]);
      const temp = prevData.users.map((el) => {
        return el._id === userId ? data.data.user : el;
      });
      queryClient.setQueryData(["organisationUsers", orgId], { users: temp });
    },
    onMutate: ({ data }) => {
      console.log(data);
    },
  });
  return { isLoading, mutate };
};
