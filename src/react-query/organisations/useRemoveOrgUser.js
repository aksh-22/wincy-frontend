import { useMutation, useQueryClient } from "react-query";

import { removeOrgUser } from "api/organisation";

export const useRemoveOrgUser = () => {
  const queryClient = useQueryClient();
  let newUserData = [];
  let orgId;

  const { mutate, isLoading } = useMutation(removeOrgUser, {
    onSuccess: () => {
      queryClient.setQueryData(["organisationUsers", orgId], {
        users: [...newUserData],
      });
    },
    onMutate: async (data) => {
      orgId = data.orgId;

      const previousUserData = queryClient.getQueryData([
        "organisationUsers",
        orgId,
      ]);
      let temp = [...previousUserData.users];

      try {
        let index = previousUserData.users.findIndex((element) => {
          if (element._id === data.userId) {
            return true;
          }
        });
        temp.splice(index, 1);
        newUserData = temp;
      } catch (e) {
        console.log("dddd", e);
      }

      return {
        previousUserData: previousUserData,
      };
    },
    onError: (err, userData, context) => {
      queryClient.setQueryData(
        ["organisationUsers", orgId],
        context.previousUserData
      );
    },
  });

  return { mutate, isLoading };
};
