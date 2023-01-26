import { useMutation } from "react-query";

import { passwordResetRequest } from "api/auth";
import { useHistory } from "react-router-dom";
export const usePassResetRequest = () => {
  const history = useHistory();
  const { mutate, isLoading } = useMutation(passwordResetRequest, {
    onSuccess: (data) => {
      console.log(data);
    },
  });
  return { mutate, isLoading };
};
