import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import { useEffect } from "react";

const TextInput = React.forwardRef(
  (
    {
      onChange,
      helperText,
      onClick,
      onKeyPress,
      error,
      label,
      type,
      placeholder,
      variant,
      required,
      style,

      minlength,
      maxLength,
      className,
      maxRows,
      multiline,
      visibilityControl,
      onBlur,
      defaultValue,
      minRows,
      autoFocus,
      name,
      value,
      autoComplete,
    },
    ref
  ) => {
    const [showPass, setShowPass] = useState(!visibilityControl);

    const ref1 = React.useRef();

    // useEffect(() => {
    //   console.log(ref1);
    // }, [ref1]);
    return variant === "naked" ? (
      <InputBase
        className={`${className}`}
        // ref={ref}
        inputRef={ref}
        onBlur={onBlur}
        value={value}
        defaultValue={defaultValue}
        minRows={minRows}
        maxRows={maxRows ?? 1}
        multiline={multiline ?? false}
        placeholder={placeholder}
        label={label}
        variant={variant}
        type={showPass ? type ?? "text" : "password"}
        required={required}
        onClick={onClick}
        onKeyPress={onKeyPress}
        style={{ color: "#FFF", ...style }}
        error={error}
        name={name}
        autoFocus={autoFocus}
        autoComplete={autoComplete ?? "off"}
        InputProps={{
          endAdornment: visibilityControl && (
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
        // helperText={helperText}
        onChange={onChange}
      />
    ) : (
      <TextField
        value={value}
        className={`${className}`}
        // ref={ref}
        inputRef={ref}
        onBlur={onBlur}
        defaultValue={defaultValue}
        minRows={minRows}
        maxRows={maxRows ?? 1}
        multiline={multiline ?? false}
        placeholder={placeholder}
        label={label}
        variant={variant}
        type={showPass ? type ?? "text" : "password"}
        required={required}
        onClick={onClick}
        onKeyPress={onKeyPress}
        style={{ ...style }}
        error={error}
        name={name}
        autoFocus={autoFocus}
        autoComplete={autoComplete ?? "off"}
        InputProps={{
          endAdornment: visibilityControl && (
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
);

export default TextInput;
