import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { useState } from "react";

export default function PasswordInput({
  onChange,
  helperText,
  onClick,
  onKeyPress,
  error,
  label,
  placeholder,
  variant,
  required,
  style,
  ref,
  minlength,
  maxLength,
  className,
  maxRows,
  multiline,
}) {
  const [showPass, setShowPass] = useState(false);

  return (
    <TextField
      className={`${className}`}
      ref={ref}
      maxRows={maxRows ?? 1}
      multiline={multiline ?? false}
      placeholder={placeholder}
      label={label}
      variant={variant}
      type={showPass ? "text" : "password"}
      required={required}
      onClick={onClick}
      onKeyPress={onKeyPress}
      style={{ ...style }}
      error={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPass(!showPass)}
              edge="start"
            >
              {showPass ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        className: "pr-0",
        // minlength: 1,
        // maxLength: 2,
      }}
      inputProps={{ minLength: minlength, maxLength: maxLength }}
      helperText={helperText}
      onChange={onChange}
    />
  );
}
