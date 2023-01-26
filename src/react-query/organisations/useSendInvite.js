import { useMutation, useQueryClient } from "react-query";

import { sendInvitation } from "api/organisation";

export const useSendInvite = (again) => {
  const queryClient = useQueryClient();
  let newUserData = [];
  let orgId;

  const { mutate, isLoading } = useMutation(sendInvitation, {
    onSuccess: (data, a, context) => {
      if (context.previousUserData) {
        newUserData = [...context.previousUserData.invitations];
        newUserData.unshift(data.data.data);
      } else {
        newUserData = [data.data.data];
      }

      !again &&
        queryClient.setQueryData(["organisationInvitedUsers", orgId], {
          invitations: newUserData,
        });
    },
    onMutate: async (data) => {
      orgId = data.orgId;
      const previousUserData = queryClient.getQueryData([
        "organisationInvitedUsers",
        orgId,
      ]);
      try {
        const newData = {
          sentTo: data?.data?.email,
          userType: data?.data?.userType,
          organisation: data?.orgId,
          designation: data?.data?.designation,
          newData: true,
        };
        if (previousUserData) {
          newUserData = [...previousUserData?.invitations];
          newUserData.unshift(newData);
        } else {
          newUserData = [newData];
        }
        !again &&
          queryClient.setQueryData(["organisationInvitedUsers", data.orgId], {
            invitations: [...newUserData],
          });
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
