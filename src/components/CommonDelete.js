import { IconButton, TextField } from "@material-ui/core";
import React, { useState, memo } from "react";
import CommonDialog from "./CommonDialog";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import CustomButton from "./CustomButton";
import { LightTooltip } from "./tooltip/LightTooltip";
import IosIcon from "./icons/IosIcon";
function CommonDelete({
  onDelete,
  isLoading,
  mutate,
  data,
  otherFunction,
  type,
  disableToolTip,
  style,
  className,
  svgIcon,
  actionButton,
  tooltipPlacement,
}) {
  return (
    <CommonDialog
      modalTitle="Delete"
      actionComponent={
        <DeleteAction
          disableToolTip={disableToolTip}
          tooltipPlacement={tooltipPlacement}
          style={style}
          className={className}
          svgIcon={svgIcon}
          actionButton={actionButton}
        />
      }
      content={
        <DeleteDialogContent
          onDelete={onDelete}
          isLoading={isLoading}
          mutate={mutate}
          data={data}
          otherFunction={otherFunction}
          type={type}
        />
      }
    />
  );
}

export default memo(CommonDelete);

function DeleteAction({
  onClick,
  disableToolTip,
  className,
  style,
  svgIcon,
  actionButton,
  tooltipPlacement,
}) {
  return actionButton ? (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {actionButton}
    </div>
  ) : (
    <LightTooltip
      placement={tooltipPlacement}
      title={disableToolTip ? "" : "Delete"}
      arrow
    >
      <div
        style={{
          color: "var(--red)",
          padding: "0px 10px",
          display: "flex",
          alignItems: "center",
        }}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
      >
        {svgIcon ? (
          <IosIcon name="trash" />
        ) : (
          <DeleteOutlineRoundedIcon style={{ ...style }} />
        )}
      </div>
    </LightTooltip>
  );
}

function DeleteDialogContent({
  otherFunction,
  isLoading,
  mutate,
  data,
  handleClose,
  type,
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleDelete = () => {
    if (type === "text" && input !== "DELETE") {
      return setError("Please type DELETE in capital letter.");
    }
    if (mutate) {
      mutate({ ...data, handleClose: handleClose, toggle: otherFunction });
    } else {
      otherFunction && otherFunction();
    }
  };
  return (
    <div>
      <p>Are you sure you want to delete this? This action cannot be undone.</p>
      {type && (
        // <input placeholder="Type Delete for delete this project" onChange={(event) => }/>
        <div className="my-1 inheritParent">
          <TextField
            placeholder={`Type "DELETE" for delete this project`}
            className="inheritParent"
            value={input}
            onChange={(event) => setInput(event?.target?.value)}
            helperText={error}
            error={error}
          />
        </div>
      )}
      <div className="d_flex justifyContent_end mt-1">
        <CustomButton
          loading={isLoading}
          onClick={handleDelete}
          disabled={isLoading}
        >
          Delete
        </CustomButton>
      </div>
    </div>
  );
}
