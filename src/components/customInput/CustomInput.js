import React, { Component } from "react";
import "./CustomInput.scss";
import PropTypes from "prop-types";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import IosIcon from "components/icons/IosIcon";
import moment from "moment";
const CustomInput = ({
  value,
  placeholder,
  inputClassName,
  className,
  onChange,
  reference,
  name,
  type = "text",
  disabled,
  onDateChange,
  error,
  wrapperClassName,
  style,
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className={wrapperClassName} style={{ width: "100%" }}>
      {inputType.includes(type) && (
        <div className={`custom_input_container ${className}`} style={style}>
          <input
            value={value}
            className={`custom_input ${inputClassName}`}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            ref={reference}
            name={name}
            style={
              {
                // opacity :  !value? 0.5 : 1
              }
            }
            autoComplete="new-password"
            disabled={disabled}
            min={0}
            
            onWheel={ event => event.currentTarget.blur() }
          />


          {type === "search" && <SearchRoundedIcon />}
        </div>
      )}

      {type === "textarea" && (
        <div className={`text_area_container ${className}`}>
          <textarea
            className={`customTextArea ${inputClassName}`}
            placeholder={placeholder}
            onChange={onChange}
            ref={reference}
            name={name}
            rows={rows}
            cols={cols}
            value={value}
            disabled={disabled}
          />
        </div>
      )}

      {type === "date" && (
        <CustomDatePicker
          // minDate={new Date()}
          onChange={onDateChange}
          defaultValue={value ?? new Date()}
          disabled={disabled}
        >
          {" "}
          <div className={`custom_input_container pr-1 ${className}`}>
            <p className="flex" style={{ color: !value && "#757575" }}>
              {value
                ? moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")
                : placeholder ?? "DD/MM/YYYY"}
            </p>
            <IosIcon name="calendar" fill="#FFB300" />
          </div>
        </CustomDatePicker>
      )}
      {error && (
        <p
          style={{
            color: "var(--red)",
            fontSize: 12,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

CustomInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(["text", "email", "password", "date"]),
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),
};
export default CustomInput;

const inputType = ["text", "number", "email", "search"];
