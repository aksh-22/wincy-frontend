import React from 'react'
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import "./AddLead.scss";

function AddLeadTextInput({
    error,
  name,
  onChange,
  placeholder,
  type,
  value,
}) {
  return (
    <div>
      <input
        value={value}
        type={type ?? "text"}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        style={{ marginBottom: error ? 0 : 15 }}
        className="addLeadInput"
        autoComplete="new-password"
        pattern="[0-9]*"
      />
      {error && (
        <div
          className="alignCenter"
          style={{
            color: "var(--red)",
            fontSize: 12,
            marginBottom: 15,
            marginLeft: 15,
            marginTop: 5,
          }}
        >
          <ErrorRoundedIcon
            style={{ color: "var(--red)", fontSize: 16, marginRight: 5 }}
          />
          {error}
        </div>
      )}
    </div>
  )
}

export default AddLeadTextInput