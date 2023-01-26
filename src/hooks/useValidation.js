import React from "react";

// {
//   type,
//   name,
//   validator,
//   validation text,
//   condition,
//   required,
// }

export default function useValidation({
  type,
  name,
  required,
  validator,
  validation,
  validationText,
}) {
  for (let i = 0; i <= data.length; i++) {
    if (required) {
      if (!data[i].validator) {
        return { valid: false, field: inputEntries[i]?.fieldName };
      } else {
        if (!inputData[inputEntries[i]?.fieldName]) {
          return { valid: false, field: inputEntries[i]?.fieldName };
        }
      }
    } else {
    }
  }

  return <div></div>;
}
