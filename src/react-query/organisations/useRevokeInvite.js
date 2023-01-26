import { useMutation, useQueryClient } from "react-query";

import { revokeInvite } from "api/organisation";

export const useRevokeInvite = () => {
  const queryClient = useQueryClient();
  let newUserData = [];
  let orgId;

  const { mutate, isLoading } = useMutation((data) => revokeInvite(data), {
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["organisationInvitedUsers", orgId], {
        invitations: [...newUserData],
      });
    },
    onMutate: async (data) => {
      orgId = data.orgId;

      const previousUserData = queryClient.getQueryData([
        "organisationInvitedUsers",
        orgId,
      ]);
      let temp = [...previousUserData.invitations];

      try {
        let index = previousUserData.invitations.findIndex((element) => {
          if (element.sentTo === data.data.email) {
            return true;
          }
        });
        temp.splice(index, 1);
        newUserData = temp;
      } catch (e) {
        console.log("dddd", e);
      }

      return { previousUserData };
    },
    onError: (err, userData, context) => {
      queryClient.setQueryData(
        ["organisationInvitedUsers", orgId],
        context.previousUserData
      );
    },
  });

  return { mutate, isLoading };
};
