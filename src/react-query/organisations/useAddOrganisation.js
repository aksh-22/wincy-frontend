import { useMutation, useQueryClient } from "react-query";

import { addOrganisation } from "api/organisation";
import { useDispatch } from "react-redux";
export const useAddOrganisation = (handleClose) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(addOrganisation, {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries("organisations");
      handleClose();
      // console.log("onSuccess data:", data);
      dispatch({ type: "UPDATE_USER_DATA", payload: data.data.user });
    },
  });
  return { mutate, isLoading };
};
