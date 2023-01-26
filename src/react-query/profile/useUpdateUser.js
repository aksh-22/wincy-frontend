import { updateUser } from "api/profile";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

// import { Dispatch } from "react";

export const useUpdateUser = (setIsEditMode, successToast, errorToast) => {
  const dispatch = useDispatch();

  const { mutate, isLoading } = useMutation(updateUser, {
    onSuccess: (data) => {
      dispatch({ type: "UPDATE_USER_DATA", payload: data.data });
      successToast("Data updated Succesfully");
      setIsEditMode(false);
    },
    onError: () => {
      errorToast("could not saved");
    },
  });

  return { mutate, isLoading };
};
