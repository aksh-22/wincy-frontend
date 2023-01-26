import { addActivityInLead } from "api/lead";
import { useMutation, useQueryClient } from "react-query";

import { useSelector } from "react-redux";

export const useAddActivityLead = (status) => {
  const queryClient = useQueryClient();

  const currentUser = useSelector((state) => state.userReducer?.userData?.user);

  const { mutate, isLoading } = useMutation(addActivityInLead, {
    onSuccess: (data, localData, context) => {
      try {
        const { orgId, leadId, callBack } = localData;
        let previousActivity = queryClient.getQueryData([
          "leadActivity",
          orgId,
          leadId,
        ]);
        previousActivity?.activities?.unshift({
          ...data,
          createdBy: currentUser,
        });
        queryClient.setQueryData(
          ["leadActivity", orgId, leadId],
          previousActivity
        );
        callBack && callBack();
      } catch (err) {}
    },
  });

  return { mutate, isLoading };
};
