import { useMutation, useQueryClient } from "react-query";

import { deleteOrganisation } from "api/organisation";
import { useDispatch, useSelector } from "react-redux";
export const useDeleteOrganisation = (userType) => {
  const dispatch = useDispatch();
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );
  const users = useSelector(
    (state) => state.userReducer?.userData?.user?.userType
  );
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(deleteOrganisation, {
    onSuccess: (data, localData) => {
      const tempOrg = queryClient.getQueryData("organisations");
      console.log({ tempOrg });

      let newArray = tempOrg?.organisations?.filter(
        (x) => x?._id !== localData?.orgId
      );
      console.log(newArray, localData);
      tempOrg.organisations = newArray;
      if (localData?.orgId === selectedOrg?._id) {
        dispatch({
          type: "SELECTED_ORGANISATION",
          payload:
            tempOrg.organisations?.length > 0
              ? tempOrg.organisations[0]
              : undefined,
        });
        console.log(tempOrg.organisations);
        if (tempOrg?.organisations?.[0]) {
          let newUserType = users?.find(
            (x) => x?.organisation === tempOrg?.organisations?.[0]?._id
          );

          newUserType = {
            ...newUserType,
            userId: userType?.userId,
          };

          dispatch({
            type: "USER_TYPE",
            payload: newUserType,
          });
        }
      }
      queryClient.setQueryData("organisations", tempOrg);

      localData?.handleClose && localData?.handleClose();
      localData?.onToggle && localData?.onToggle();
    },
  });
  return { isLoading, mutate };
};
