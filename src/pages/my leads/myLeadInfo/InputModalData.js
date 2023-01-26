import CustomButton from "components/CustomButton";
import TextInput from "components/textInput/TextInput";
import React from "react";

export default function InputModalData() {
  return (
    <>
      <div>
        <p>Event Name</p>
        <TextInput />
      </div>
      <div>
        <p>Event date</p>
        <TextInput />
      </div>
      <CustomButton>Create</CustomButton>
    </>
  );
}
