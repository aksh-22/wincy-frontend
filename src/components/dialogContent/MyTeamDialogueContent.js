import React, { useState } from "react";
import styles from "./DialogContent.module.css";
import CustomSelect from "components/CustomSelect";
import TextField from "@material-ui/core/TextField";
import CustomButton from "components/CustomButton";
import { useSendInvite } from "react-query/organisations/useSendInvite";
import { useSelector } from "react-redux";

const menuItem = ["Member", "Member+", "Member++"];

export default function DialogContent({
  handleClose,
  name,
  email,
  designation,
  select,
  btn,
  dialogueType,
}) {
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );

  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    designation: "",
    userType: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    designation: "",
    userType: "",
  });

  const [errorTxt, setErrorTxt] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isError, setIsError] = useState({
    name: false,
    email: false,
    designation: false,
    userType: false,
  });

  const { mutate, isLoading } = useSendInvite(false);

  const submitHandler = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (name && inputData.name.trim().length < 1) {
      setIsError({ ...isError, name: true });
      return setError({
        ...error,
        name: "Required",
      });
    }
    if (email && !re.test(inputData.email)) {
      setIsError({ ...isError, email: true });

      return setError({
        ...error,
        email: "Invalid email.",
      });
    }
    if (designation && inputData.designation === "") {
      setIsError({ ...isError, designation: true });

      return setError({
        ...error,
        designation: "Required",
      });
    }

    if (select && inputData.userType === "") {
      setIsError({ ...isError, userType: true });

      return setError({
        ...error,
        userType: "Required",
      });
    } else {
      if (dialogueType === "invite") {
        const orgId = selectedOrg?._id;

        const data = {
          orgId,
          data: {
            email: inputData.email.toLowerCase(),
            designation: inputData.designation,
            userType: inputData.userType,
          },
        };
        mutate(data, {
          onSuccess: () => {
            handleClose();
          },
        });
      } else {
        handleClose();
      }
    }
  };

  return (
    <div className={`${styles.dialogContent} selectPopOver`}>
      {email && (
        <TextField
          id="Email"
          label="Email"
          error={isError.email}
          helperText={isError.email && error.email}
          onChange={(el) => {
            setInputData({ ...inputData, email: el?.target?.value?.toLowerCase() });
            setIsError({ ...isError, email: false });
          }}
          InputProps={{ className: "normalFont" }}
          InputLabelProps={{ className: "normalFont" }}
          autoCorrect="off"
           autoCapitalize="none"
        />
      )}
      {designation && (
        <TextField
          id="Designation"
          label="Designation"
          error={isError.designation}
          helperText={isError.designation && error.designation}
          onChange={(el) => {
            setInputData({ ...inputData, designation: el.target.value });
            setIsError({ ...isError, designation: false });
          }}
          InputProps={{ className: "normalFont" }}
          InputLabelProps={{ className: "normalFont" }}
        />
      )}

      {select && (
        <CustomSelect
          menuItems={menuItem}
          inputLabel="User Type"
          // name="User Type"
          labelClassName={"normalFont"}
          errorText={isError.userType && error.userType}
          // value={userType}
          name="userType"
          handleChange={(event) => {
            setInputData({ ...inputData, userType: event.target.value });
            setIsError({ ...isError, userType: false });
          }}
          className="flex"
        />
      )}
      <div className={styles.btnArea}>
        {btn && (
          // <CustomButton onClick={(handleClose, submitHandler)}>
          <CustomButton
            loading={isLoading}
            onClick={() => {
              submitHandler();
            }}
          >
            <p>{btn}</p>
          </CustomButton>
        )}
      </div>
    </div>
  );
}

// className="selectPopOver"
