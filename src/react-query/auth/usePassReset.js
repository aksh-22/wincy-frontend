import { useMutation } from "react-query";
import { passwordReset } from "api/auth";

export const usePassReset = () => {
  const { mutate, isLoading } = useMutation(passwordReset, {
    onSuccess: (data) => {
      console.log(data);
    },
  });
  return { mutate, isLoading };
};
