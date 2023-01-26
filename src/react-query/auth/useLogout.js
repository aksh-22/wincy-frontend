import { useMutation, useQueryClient } from "react-query";

import { logout } from "api/auth";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const history = useHistory();
  const dispatch = useDispatch();

  const { isLoading, mutate } = useMutation(logout, {
    onSettled: () => {
      dispatch({ type: "Logout" });
      queryClient.clear();
      history.push("/");
    },
  });
  return { isLoading, mutate };
};
