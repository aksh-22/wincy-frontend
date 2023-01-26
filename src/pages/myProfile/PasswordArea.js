import React, { useState } from "react";
import classes from "./MyProfile.module.css";
import TextField from "@material-ui/core/TextField";
import CustomButton from "components/CustomButton";
import { errorToast, successToast } from "utils/toast";
import { IconButton, InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useUpdatePassword } from "react-query/profile/useUpdatePassword";
import { useLogout } from "react-query/auth/useLogout";
import TextInput from "components/textInput/TextInput";

export default function PasswordArea({ setActiveBtn }) {
  const [isChangingPassowrd, setIsChangingPassowrd] = useState(false);

  const [inputData, setInputData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isError, setIsError] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errorTxt, setErrorTxt] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { isLoading, mutate } = useUpdatePassword(
    successToast,
    errorToast,
    setIsChangingPassowrd
  );

  const { isLoading: logoutLoading, mutate: logoutMutate } = useLogout();

  const saveHandler = () => {
    const passReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (inputData.currentPassword.trim().length === 0) {
      setIsError({ ...isError, currentPassword: true });
      setErrorTxt({
        ...errorTxt,
        currentPassword: "You can't leave it empty",
      });
    } else if (!passReg.test(inputData.newPassword)) {
      setIsError({ ...isError, newPassword: true });
      setErrorTxt({
        ...errorTxt,
        newPassword:
          "Password must be minimum 8 characters maximum 32 characters, one number, one upper case, one lower case and one special character!",
      });
    } else if (inputData.confirmPassword !== inputData.newPassword) {
      setIsError({ ...isError, confirmPassword: true });
      setErrorTxt({
        ...errorTxt,
        confirmPassword: "New password and confirm password did not match",
      });
    } else if (inputData.currentPassword === inputData.newPassword) {
      setIsError({ ...isError, newPassword: true, currentPassword: true });
      setErrorTxt({
        ...errorTxt,
        currentPassword: "New password and current must not be same",
        newPassword: "New password and current must not be same",
      });
    } else {
      const data = {
        currentPassword: inputData.currentPassword,
        newPassword: inputData.newPassword,
      };
      mutate(data, {
        onSuccess: () => {
          logoutMutate();
          // setActiveBtn(true);
        },
      });
    }
  };

  return (
    <div className={classes.passwordArea}>
      <h3>Change your password</h3>
      <div className={classes.inputArea}>
        <TextInput
          // variant="filled"
          variant="outlined"
          required
          className="inputField ff_Lato_Italic"
          minlength={1}
          maxLength={32}
          placeholder="Current Password"
          error={isError.currentPassword}
          visibilityControl
          helperText={isError.currentPassword && errorTxt.currentPassword}
          onChange={(el) => {
            setIsChangingPassowrd(true);
            setInputData({ ...inputData, currentPassword: el.target.value });
            setIsError({
              ...isError,
              currentPassword: false,
              newPassword: false,
            });
          }}
        />
        <TextInput
          className="inputField ff_Lato_Italic"
          variant="outlined"
          placeholder="New Password"
          required
          error={isError.newPassword}
          minlength={1}
          maxLength={32}
          helperText={isError.newPassword && errorTxt.newPassword}
          onChange={(el) => {
            setIsChangingPassowrd(true);
            setInputData({ ...inputData, newPassword: el.target.value });
            setIsError({ ...isError, newPassword: false });
          }}
          visibilityControl
        />
        <TextInput
          className="inputField ff_Lato_Italic"
          placeholder="Confirm Password"
          variant="outlined"
          required
          error={isError.confirmPassword}
          minlength={1}
          maxLength={32}
          helperText={isError.confirmPassword && errorTxt.confirmPassword}
          onChange={(el) => {
            setIsChangingPassowrd(true);
            setInputData({ ...inputData, confirmPassword: el.target.value });
            setIsError({ ...isError, confirmPassword: false });
          }}
          visibilityControl
        />
      </div>
      <CustomButton
        onClick={saveHandler}
        loading={isLoading}
        // disabled={!isChangingPassowrd}
      >
        Change Password
      </CustomButton>
    </div>
  );
}
