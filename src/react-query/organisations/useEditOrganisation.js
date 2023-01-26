import { useMutation, useQueryClient } from "react-query";

import { updateOrg } from "api/organisation";
import { useDispatch, useSelector } from "react-redux";
export const useEditOrganisation = (handleClose) => {
  const dispatch = useDispatch();
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(updateOrg, {
    onSuccess: ({ data }) => {
      const tempOrg = queryClient.getQueryData("organisations");
      tempOrg?.organisations?.map((x) => {
        if (x?._id === data?._id) {
          x.name = data.name;
        }
      });
      if (data?._id === selectedOrg?._id) {
        dispatch({ type: "SELECTED_ORGANISATION", payload: data });
      }
      queryClient.setQueryData("organisations", tempOrg);
      handleClose();
    },
  });
  return { isLoading, mutate };
};
