// import "date-fns";
import React, { Fragment } from "react";
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import EventIcon from "@material-ui/icons/Event";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
// import { DatePicker } from "@material-ui/pickers";
// import TextField from "@mui/material/TextField";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";
// import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
// import TextField from "@mui/material/TextField";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";
const CustomDatePicker = React.forwardRef(
  (
    {
      selectedDate,
      handleDateChange,
      minDate,
      maxDate,
      placeholder,
      error,
      helperText,
      className,
      variant,
      format,
      directPicker,
      open,
      onClose,
      label,
    },
    ref
  ) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {/* {console.log({selectedDate})} */}
        <KeyboardDatePicker
          autoOk
          autoComplete={"Asd"}
          minDate={minDate && minDate}
          maxDate={maxDate && maxDate}
          // disableToolbar
          variant={variant ?? "inline"}
          format={format ?? "dd/MM/yyyy"}
          margin="normal"
          id="date-picker-inline"
          value={selectedDate || new Date()}
          size="small"
          error={error}
          helperText={helperText}
          onChange={
            handleDateChange ?? (() => console.log("no Function Receive"))
          }
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          className={`customCalender ${className}`}
          keyboardIcon={
            <Box
              component={EventIcon}
              width="1.5rem!important"
              height="1.5rem!important"
            />
          }
          placeholder={placeholder ?? ""}
          clearable={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={(e) => {}}>
                <HighlightOffIcon style={{ color: "green" }} />
              </IconButton>
            ),
          }}
          inputProps={{ autoComplete: "off" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </MuiPickersUtilsProvider>
      // <LocalizationProvider dateAdapter={AdapterDateFns}>
      //   <DatePicker
      //     label={label}
      //     value={selectedDate || new Date()}
      //     // className={className}
      //     minDate={minDate}
      //     maxDate={maxDate}
      //     inputFormat={format && format}
      //     onChange={
      //       handleDateChange ?? (() => console.log("no Function Receive"))
      //     }
      //     renderInput={(params) => (
      //       <TextField
      //         className={className}
      //         placeholder={placeholder}
      //         variant="standard"
      //         helperText={helperText}
      //         error={error}
      //         {...params}
      //       />
      //     )}
      //   />
      // </LocalizationProvider>
    );
  }
);

export default CustomDatePicker;
