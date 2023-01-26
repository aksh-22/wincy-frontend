import CustomButton from "components/CustomButton";
import TextInput from "components/textInput/TextInput";
import React, { useState } from "react";

function OnHoldReason({handleClose , handleTaskStatus}) {
  const [reason, setReason] = useState("");
  const [isError, setIsError] = useState("")
  const onSubmit = () => {
      if(!reason?.trim()?.length){
        return setIsError("Reason field is required.")
      }
      handleTaskStatus && handleTaskStatus("OnHold" , reason)
      handleClose && handleClose()
  }
  return (
    <div className="d_flex flexColumn">
      <TextInput
      className="flex mb-2"
        onChange={(e) => {
            setReason(e?.target?.value)
            !!isError && setIsError("")
        }}
        defaultValue={reason}
        multiline
        autoFocus
        maxRows={4}
        error={!!isError}
        helperText={isError}
        placeholder='On Hold Reason'
      />
      <div className="alignCenter justifyContent_between">
        <CustomButton type="outlined"> Cancel </CustomButton>
        <CustomButton onClick={onSubmit}> Save </CustomButton>
      </div>
    </div>
  );
}

export default OnHoldReason;
