import { updatePassword } from "api/auth";
import { useMutation } from "react-query";

// import { Dispatch } from "react";

export const useUpdatePassword = (
  successToast,
  errorToast,
  setIsChangingPassowrd
) => {
  const { mutate, isLoading } = useMutation(updatePassword, {
    onSuccess: (data) => {
      successToast("Password Updated Sucessfully");
      setIsChangingPassowrd(false);
    },
  });
  return { mutate, isLoading };
};
