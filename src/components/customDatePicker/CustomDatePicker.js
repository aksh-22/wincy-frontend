import Popover from "@mui/material/Popover";
import moment from "moment";
// import Visibility from "@material-ui/icons/Visibility";
// import VisibilityOff from "@material-ui/icons/VisibilityOff";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import React, { memo, useState } from "react";
import Calendar from "react-calendar";
import CustomDateRangePicker from "./CustomDateRangePicker";
import "./datePicker.css";

function CustomDatePicker({
  defaultValue,
  className,
  onChange,
  maxDate,
  minDate,
  openByDefault,
  children,
  disabled,
  calenderView,
  onClickMonth,
  containerStyle,
  innerContainerStyle,
  rangePicker,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // const [showDatePicker, setShowDatePicker] = useState(openByDefault);
  return (
    <div
      className={`${className} inheritParent `}
      style={{ ...containerStyle }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // e.nativeEvent.preventDefault();
          // e.nativeEvent.stopPropagation();
          // e.nativeEvent.stopImmediatePropagation();
          disabled ? console.info("-") : handlePopoverOpen(e);
        }}
        className={`inheritParent alignCenter justifyContent_center ${innerContainerStyle}`}
        style={{
          cursor: disabled ? "default" : "pointer",
        }}
      >
        {children}
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            background: "var(--popUpColor)",
            color: "#FFF",
          },
        }}
      >
        <div
          style={{ position: "relative" }}
          className="customDatePicker"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {rangePicker ? (
            <CustomDateRangePicker
              onChange={(e) => {
                onChange && onChange(e);
              }}
              value={defaultValue}
            />
          ) : (
            <Calendar
              defaultValue={
                defaultValue
                  ? typeof defaultValue === "string"
                    ? defaultValue?.includes("T")
                      ? new Date(defaultValue)
                      : moment(defaultValue, "MM-DD-YYYY").toDate()
                    : defaultValue
                  : new Date()
              }
              maxDate={maxDate}
              minDate={minDate}
              className="customDatePickerA"
              onClickDay={(date, event) => {
                onChange && onChange(moment(date).format("MM-DD-YYYY"));
                handlePopoverClose(event);
              }}
              view={calenderView}
              onClickMonth={(e, event) => {
                if (onClickMonth) {
                  onClickMonth(e) ?? console.log("");
                  handlePopoverClose(event);
                }
              }}
            />
          )}
        </div>
      </Popover>
    </div>
    // <ClickAwayListener
    //   onClickAway={() => {
    //     setShowDatePicker(false);
    //   }}
    // >
    //   <div className="customDatePicker">
    //     <div
    //       style={{
    //         // cursor: "pointer",
    //         WebkitTouchCallout: "none",
    //         WebkitUserSelect: "none",
    //         KhtmlUserSelect: "none",
    //         MozUserSelect: "none",
    //         MsUserSelect: "none",
    //         userSelect: "none",
    //         cursor: disabled ? "not-allowed" : "pointer",
    //       }}
    // onClick={() => {
    //   disabled
    //           ? console.log("disabled")
    //           : setShowDatePicker(!showDatePicker);
    //       }}
    //       className="inheritParent d_flex alignCenter justifyContent_center"
    //     >
    //       {children}
    //     </div>
    //     {showDatePicker && (
    //       <div
    //         style={{
    //           width: 250,
    //           position: "absolute",
    //           top: 0,
    //           transform: "translateX(-30%)",
    //           zIndex: 3,
    //         }}
    //       >
    //         <Calendar
    //           defaultValue={defaultValue ? new Date(defaultValue) : new Date()}
    //           // onChange={(e) => {
    //           //   console.log(e);
    //           // }}
    //           maxDate={maxDate}
    //           minDate={minDate}
    //           className="customDatePickerA"
    //           onClickDay={(date) => {
    //             // setShowDatePicker(false);
    //             onChange(date);
    //             setShowDatePicker(false);
    //           }}
    //           // defaultView="year"
    //           view={calenderView}
    //           onClickMonth={(e) => {
    //             if (onClickMonth) {
    //               onClickMonth(e) ?? console.log("");
    //               setShowDatePicker(false);
    //             }
    //           }}
    //         />
    //       </div>
    //     )}
    //   </div>
    // </ClickAwayListener>
  );
}

export default memo(CustomDatePicker);
