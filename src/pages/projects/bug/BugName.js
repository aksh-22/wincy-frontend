import React from "react";
import TextInput from "components/textInput/TextInput";
import { useState } from "react";
import { useEffect } from "react";

const BugName = React.forwardRef(({ error }, ref) => {
  const [errorTxt, setErrorTxt] = useState(error);

  useEffect(() => {
    setErrorTxt(error);
  }, [error]);

  return (
    <div>
      <TextInput
        placeholder="Title*"
        type="text"
        name="title"
        ref={ref}
        onChange={() => {
          setErrorTxt("");
        }}
        // onChange={() => {
        //   setError({
        //     ...error,
        //     title: "",
        //   });
        // }}
        // className="mt-1 "
        // value={bugData?.title}
        // autoFocus
        maxLength={150}
        error={errorTxt !== "" ? true : false}
        helperText={errorTxt}
        style={{ marginTop: "16px", width: "100%" }}
      />
    </div>
  );
});

export default BugName;
