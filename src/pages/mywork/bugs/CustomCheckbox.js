import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const CustomCheckbox = (id) => {
  const [checkboxState, setCheckboxState] = useState("");

  useEffect(() => {
    console.log("checkboxState:", checkboxState);
  }, [checkboxState]);

  return (
    <div>
      <Checkbox
        inputProps={{ "aria-label": "primary checkbox" }}
        size="small"
        className="showCheckbox"
        // checked={checkedBug.includes(row?._id)}
        onClick={() => setCheckboxState(id)}
      />
    </div>
  );
};

export default CustomCheckbox;
