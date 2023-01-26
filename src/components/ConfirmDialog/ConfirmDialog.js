import CustomButton from "components/CustomButton";
import React from "react";
import classes from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  onClick,
  handleClose,
  isLoading,
  warning,
}) {
  const clickHandler = () => {
    onClick(handleClose);
  };

  return (
    <div className={`${classes.confirmDialogue}`}>
      <p className=" ml-0">{warning}</p>
      <div className={`${classes.btn}`}>
        <CustomButton
          variant="contained"
          onClick={clickHandler}
          loading={isLoading}
        >
          Yes
        </CustomButton>
      </div>
    </div>
  );
}
