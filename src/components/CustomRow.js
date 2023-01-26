import { ClickAwayListener, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { Autocomplete } from "@material-ui/lab";
import CustomAvatar from "components/CustomAvatar";
import CustomDatePickerK from "components/customDatePicker/CustomDatePicker";
import CustomDatePicker from "components/datePicker/ReactDatePicker";
import css from "css/ProjectInfo.module.css";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { countries } from "utils/countries";
import { textTruncateMore } from "utils/textTruncate";
import { errorToast, infoToast } from "utils/toast";
import CustomAvatarGroup from "./CustomAvatarGroup/CustomAvatarGroup";
import CustomChip from "./CustomChip";
import CustomMenu from "./CustomMenu";
import CustomSelect from "./CustomSelect";
import Image from "./defaultImage/Image";
import SLR_Wrapper from "./SLR_wrapper/SLR_Wrapper";
import TextInput from "./textInput/TextInput";
const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  selectMenu: {
    padding: 100,
  },
}));

function CustomRow({
  field,
  value,
  multiple,
  menuItems,
  inputType,
  onChange,
  placeholderText,
  valueClassName,
  apiKey,
  otherKey,
  inputTextClassName,
  sendAllAttachment,
  disabled,
  containerClassName,
  fieldClassName,
  isEditA,
  truncateValue,
  nonTruncate,
  maxRows,
  minRows,
  variant,
  max,
  multiline,
  emptyText,
  inputStyle,
  disablePlaceholder,
  containerClass,
  selectRender,
  valueElement,
  userSelection,
  autoCompleteRenderOption,
  autoCompleteGetOptionLabel,
  autoCompleteOnChangeKey,
}) {
  let uploadRef = React.createRef();

  const classes = useStyles();
  const [input, setInput] = useState(
    value === "No description available yet!" ? "" : value
  );
  const [removeAttachment, setRemoveAttachment] = useState([]);
  const [isEdit, setIsEdit] = useState(isEditA ?? false);
  const [inputType_date, setInputType_date] = useState("month");
  const [localScreenData, setLocalScreenData] = useState("");
  const technology = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );
  const platform = useSelector(
    (state) => state.userReducer?.userData?.platforms
  );
  useEffect(() => {
    inputType === "date" && onMutate();
  }, [input, inputType]);

  useEffect(() => {
    setInput(value);
    setRemoveAttachment([]);
  }, [value]);
  const onMutate = () => {
    if (typeof input === "string") {
      if (inputType === "dropDown") {
        let days = input;
        if (inputType_date === "month") {
          days = input * 30;
        }
        if (inputType_date === "year") {
          days = input * 365;
        }
        onChange(days, field, apiKey, otherKey);
        setIsEdit(false);

        return null;
      }

      input?.trim() !== "" &&
        value !== input &&
        input !== undefined &&
        onChange(input, field, apiKey, otherKey);
    } else {
      if (inputType === "dropDown") {
        let days = input;
        if (inputType_date === "month") {
          days = input * 30;
        }
        if (inputType_date === "year") {
          days = input * 365;
        }
        onChange(days, field, apiKey, otherKey);
        setIsEdit(false);

        return null;
      }

      value !== input &&
        input !== undefined &&
        input !== null &&
        onChange(input, field, apiKey, otherKey);
    }

    try {
      if (typeof input === "string" && input?.trim() === "") {
        setInput(value);
      }
    } catch (err) {
      console.error(err);
    }
    setIsEdit(false);
  };

  const handleScreens = (label) => {
    let tempScreens = input?.filter((x) => x !== label);
    setInput([...tempScreens]);
  };
  const fileChangeHandle = (e) => {
    let temp = [...(input ?? [])]; // for single Selection
    let newTemp = [];
    for (let i = 0; i < Object.keys(e.target.files).length; i++) {
      temp.push(e.target.files[i]);
      newTemp.push(e.target.files[i]);
      if (Math.round(e.target.files[i].size / 1024) >= 102400) {
        return errorToast("Maximum file size support 100MB");
      }
      if (e.target.files[i].type?.includes("video")) {
        return errorToast("Only images are allowed.");
      } else if (e.target.files[i]?.type?.includes("image")) {
        console.debug("Image");
      } else {
        return errorToast(
          "This File format is not supported , only image and video file support"
        );
      }
    }
    if (temp.length > 5) {
      return errorToast("Maximum 5 attachments are allowed.");
    }
    setInput(temp);
    onChange(sendAllAttachment ? temp : newTemp);
  };

  const removeFile = (index, item) => {
    let temp = [...input];
    let remove = [...removeAttachment];
    temp.splice(index, 1);
    setInput([...temp]);
    if (typeof item !== "object") {
      remove.push(item);
    }
    setRemoveAttachment(remove);
    onChange(remove, typeof item !== "object" ? "remove" : undefined);
  };

  const isCheckFileObject = (value) => {
    if ((typeof value === "object" && value !== null) || undefined) {
      return ["mp4", "webm", "mkv"].includes(
        value?.name?.split(".")[(value?.name?.split(".")).length - 1]
      );
    } else {
      return ["mp4", "webm", "mkv"].includes(
        value?.split(".")[(value?.split(".")).length - 1]
      );
    }
  };
  return (
    <div
      className={`d_flex selectPopOver customRowComponent  ${containerClass}`}
    >
      {}
      {field && (
        <div
          className={`${css.fieldTitle} ${
            fieldClassName ?? "ff_Lato_Regular"
          } `}
        >
          {field}
        </div>
      )}
      <div
        className={`${!isEdit ? "d_flex alignCenter  " : ""} ${
          inputType === "file" ? "inheritParent" : ""
        } ${field ? css.fieldValue : ""} 
        ${inputType === "text" ? "inheritParent" : ""}
        ${fieldClassName ?? "ff_Lato_Regular"}
        `}
        style={{
          height: "inherit",
          overflow: "hidden",
        }}
      >
        {isEdit ? (
          <ClickAwayListener onClickAway={onMutate}>
            <div className="inheritParent ff_Lato_Regular">
              {inputType === "menu" && (
                <div className="inheritParent">
                  <CustomMenu
                    style
                    menuItems={menuItems}
                    handleMenuClick={(selectedMenuItem) => {
                      selectedMenuItem?.value &&
                        setInput(selectedMenuItem?.value);
                    }}
                    activeMenuItem={addSpaceUpperCase(input)}
                  />
                </div>
              )}
              {inputType === "select" && (
                <div className="inheritParent d_flex alignCenter">
                  <CustomSelect
                    menuItems={menuItems ?? []}
                    value={input}
                    onClickAway={() => setIsEdit(false)}
                    handleChange={(event) => setInput(event?.target?.value)}
                    multiple={multiple}
                    containerClassName="flex "
                    selectRowClassName="smallFont"
                    max={max}
                    style={{ paddingLeft: 10, flex: 1 }}
                    menuRenderComponent={
                      selectRender ? (
                        selectRender
                      ) : userSelection ? (
                        <UserSelectRender />
                      ) : null
                    }
                    selectRenderComponent={
                      selectRender ? (
                        selectRender
                      ) : userSelection ? (
                        <UserSelectRender />
                      ) : null
                    }
                  />
                </div>
              )}
              {["text", "number"].includes(inputType) &&
                (apiKey === "description" ? (
                  <TextareaAutosize
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "var(--lightBlue)",
                      color: "var(--defaultWhite)",
                      outline: 0,
                      fontSize: 16,
                      paddingLeft: 10,
                    }}
                    onKeyPress={(e) => e.key === "Enter" && onMutate()}
                    className={`inheritParent ${inputTextClassName}`}
                    onChange={(event) => setInput(event?.target?.value)}
                    value={input}
                    autoFocus
                    aria-label="minimum height"
                    minRows={3}
                    placeholder={placeholderText ?? "Description"}
                  />
                ) : (
                  <TextInput
                    onKeyPress={(e) => {
                      if (inputType === "number") {
                        var invalidChars = ["-", "+", "e"];

                        if (invalidChars.includes(e.key)) {
                          e.preventDefault();
                        }
                      }

                      e.key === "Enter" && onMutate();
                    }}
                    variant={variant ?? "naked"}
                    type={inputType ?? "text"}
                    className={`inheritParent ${inputTextClassName}`}
                    onChange={(event) => setInput(event?.target?.value)}
                    defaultValue={input}
                    autoFocus
                    multiline={multiline ?? false}
                    minRows={minRows ?? 1}
                    maxRows={maxRows}
                    style={{
                      paddingLeft: 10,
                      ...inputStyle,
                    }}
                  />
                ))}
              {inputType === "date" && (
                <CustomDatePicker
                  handleDateChange={(date) => setInput(date)}
                  selectedDate={input}
                  placeholder={field}
                  className="pl-1"
                />
              )}
              {inputType === "inputTags" && (
                <div
                  className="flexWrap alignCenter"
                  style={{
                    padding: "10px 5px",
                  }}
                >
                  {input?.map((x) => (
                    <CustomChip
                      handleClose={(label) => handleScreens(label)}
                      label={x}
                      key={x}
                      className="mb-1 mr-05"
                    />
                  ))}
                  <input
                    className="inheritParent"
                    onChange={(e) => setLocalScreenData(e.target.value?.trim())}
                    value={localScreenData}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        if (input?.includes(localScreenData)) {
                          infoToast("Screen already exist!");
                        } else {
                          if (localScreenData.length > 0) {
                            setInput([...input, localScreenData]);
                            setLocalScreenData("");
                          }
                        }
                      }
                    }}
                    style={{
                      minWidth: 100,
                      border: "none",
                      backgroundColor: "transparent",
                      borderBottom: "1px solid var(--lightBlue)",
                      margin: "0px 5px 10px 5px",
                    }}
                    autoFocus
                  />
                </div>
              )}
              {inputType === "dropDown" && (
                <DateTypeDropDown
                  inputType={inputType_date}
                  setInputType={setInputType_date}
                  valueInDay={input}
                  setInput={setInput}
                  onMutate={onMutate}
                />
              )}
              {inputType === "autoComplete" && (
                <Autocomplete
                  id="country-select-demo"
                  style={{ width: 300 }}
                  options={menuItems ?? countries}
                  classes={{
                    option: css.autoCompleteOptions,
                    paper: css.autoCompletePaper,
                    clearIndicator: css.autoCompleteClearIndicator,
                    noOptions: css.autoCompleteNoOptions,
                    popupIndicator: css.autoCompletePopupIndicator,
                  }}
                  autoHighlight
                  getOptionLabel={
                    autoCompleteGetOptionLabel ??
                    ((option) => option?.label ?? "")
                  }
                  value={autoCompleteOnChangeKey ? input : { label: input }}
                  onChange={(e, value) =>
                    setInput(autoCompleteOnChangeKey ? value : value?.label)
                  }
                  renderOption={
                    autoCompleteRenderOption ??
                    ((option) => (
                      <React.Fragment>
                        {option.label} ({option.code}) +{option.phone}
                      </React.Fragment>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        ...params.inputProps,
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      autoFocus
                    />
                  )}
                />
              )}
            </div>
          </ClickAwayListener>
        ) : (
          <div
            // onDoubleClick={() =>
            //   disabled &&
            //   infoToast(
            //     disablePlaceholder ?? "You are not authorized for editing."
            //   )
            // }
            className={`${valueClassName} ${
              css.dateTypeDropDown
            } alignCenter flexWrap inheritParent ${containerClassName}         ${
              valueClassName ?? "ff_Lato_Regular"
            }`}
            onClick={() =>
              disabled
                ? console.debug("Disabled")
                : onChange && inputType !== "file" && setIsEdit(true)
            }
            style={{
              paddingLeft: inputType !== "file" ? 10 : 0,
            }}
          >
            {valueElement ? (
              valueElement
            ) : userSelection ? (
              value ? (
                <div
                  className={`${css.selectRo1w} normalFont d_flex alignCenter`}
                >
                  <CustomAvatar
                    src={value?.profilePicture}
                    small
                    variant="circle"
                  />
                  <p className="pl-1"> {value?.name}</p>
                </div>
              ) : inputType === "dropDown" ? (
                isEdit ? (
                  <DateTypeDropDown
                    inputType={inputType_date}
                    setInputType={setInputType_date}
                    valueInDay={input}
                    setInput={setInput}
                  />
                ) : (
                  <p>{daysConversion(input)}</p>
                )
              ) : (
                "N/A"
              )
            ) : inputType === "date" ? (
              <CustomDatePickerK
                innerContainerStyle={"customDatePicker__"}
                disabled={disabled}
                onChange={(date) => setInput(date)}
                defaultValue={input}
              >
                <div>
                  {value
                    ? value?.includes("T")
                      ? moment(value).format("DD-MM-YYYY")
                      : moment(value, "MM-DD-YYYY").format("DD-MM-YYYY")
                    : "N/A"}
                </div>
              </CustomDatePickerK>
            ) : inputType === "file" ? (
              input === undefined ? (
                onChange && (
                  <div
                    style={{
                      width: "calc(100% - 52%)",
                      border: "1px dashed var(--defaultWhite)",
                      marginBottom: 10,
                      height: 120,
                    }}
                    className={`d_flex alignCenter justifyContent_center flexColumn    ${
                      valueClassName ?? "ff_Lato_Regular"
                    }`}
                    onClick={() => uploadRef.click()}
                  >
                    <AddRoundedIcon style={{ fontSize: 58 }} />
                    Add Attachment{" "}
                  </div>
                )
              ) : (
                <div className="inheritParent firstDiv">
                  <SLR_Wrapper showDownloadButton={false}>
                    <div
                      className="inheritParent d_flex flexWrap justifyContent_between"
                      style={{ position: "relative" }}
                    >
                      {onChange && (
                        <div
                          style={{
                            width: "calc(100% - 52%)",
                            border: "1px dashed var(--defaultWhite)",
                            marginBottom: 10,
                            height: 120,
                          }}
                          className={`d_flex alignCenter justifyContent_center flexColumn    ${
                            valueClassName ?? "ff_Lato_Regular"
                          }`}
                          onClick={() => uploadRef.click()}
                        >
                          <AddRoundedIcon style={{ fontSize: 58 }} />
                          Add Attachment
                        </div>
                      )}

                      {input?.map((item, index) =>
                        isCheckFileObject(item) ? (
                          <div
                            key={index}
                            className="inheritParent"
                            style={{
                              width: "calc(100% - 52%)",
                              border: "1px solid var(--defaultWhite)",
                              position: "relative",
                              overflow: "hidden",
                              marginBottom: 10,
                              height: 120,
                            }}
                          >
                            <video
                              className="inheritParent"
                              width="100%"
                              height="200"
                              controls
                            >
                              <source
                                src={
                                  typeof item === "object" && input !== null
                                    ? URL.createObjectURL(item)
                                    : item
                                }
                              />
                            </video>
                            <div
                              onClick={() => {
                                removeFile(index, item);
                              }}
                              className="closeButtonCustomRow"
                            >
                              <ClearRoundedIcon style={{ fontSize: 18 }} />
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            style={{
                              width: "calc(100% - 52%)",
                              border: "1px solid var(--defaultWhite)",
                              position: "relative",
                              overflow: "hidden",
                              marginBottom: 10,
                              height: 120,
                            }}
                          >
                            <img
                              src={
                                typeof item === "object" && input !== null
                                  ? URL.createObjectURL(item)
                                  : item
                              }
                              className={`inheritParent`}
                              style={{ objectFit: "cover" }}
                              alt="no_image_available"
                            />
                            {onChange && (
                              <div
                                onClick={() => {
                                  removeFile(index, item);
                                }}
                                className="closeButtonCustomRow"
                              >
                                <ClearRoundedIcon style={{ fontSize: 18 }} />
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </SLR_Wrapper>
                </div>
              )
            ) : Array.isArray(value) ? (
              <div
                className={`customChipClass ${
                  valueClassName ?? "ff_Lato_Regular"
                }`}
              >
                {value?.length > 0 ? (
                  <CustomAvatarGroup
                    max={max ?? 3}
                    plusAvatarStyle={{
                      height: 30,
                      width: 30,
                    }}
                    extraavatarstooltiptitle={value?.map(
                      (item, index) =>
                        index > 1 && (
                          <CustomChip
                            key={index}
                            label={item}
                            bgColor={
                              apiKey === "platforms"
                                ? platform[item]
                                : technology[item]
                            }
                            className={`mr-1 mb-05    ${
                              valueClassName ?? "ff_Lato_Regular"
                            }`}
                          />
                        )
                    )}
                  >
                    {value?.map((item, index) => (
                      <CustomChip
                        key={index}
                        label={item}
                        bgColor={
                          apiKey === "platforms"
                            ? platform[item]
                            : technology[item]
                        }
                        style={{
                          marginRight: 15,
                        }}
                        className={`   ${valueClassName ?? "ff_Lato_Regular"}`}
                      />
                    ))}
                  </CustomAvatarGroup>
                ) : (
                  emptyText ?? "N/A"
                )}
              </div>
            ) : apiKey === "createdBy" ? (
              <div className="d_flex alignCenter">
                <Image title={value?.name} src={value?.profilePicture} />
                &nbsp;&nbsp;
                {value?.name}
              </div>
            ) : apiKey === "description" ? (
              <div style={{ whiteSpace: "pre-wrap" }}>
                {value === undefined ? "Description not available" : value}
              </div>
            ) : nonTruncate ? (
              value ?? emptyText ?? "N/A"
            ) : (
              textTruncateMore(
                typeof value === "object"
                  ? value[autoCompleteOnChangeKey]
                  : value,
                truncateValue ?? 50
              ) ??
              emptyText ??
              "N/A"
            )}
          </div>
        )}

        <input
          type="file"
          style={{ display: "none" }}
          ref={(ref) => (uploadRef = ref)}
          onChange={fileChangeHandle}
          onClick={(event) => {
            event.target.value = null;
          }}
          multiple={true}
        />
      </div>
    </div>
  );
}

export default memo(CustomRow);

const DateTypeDropDown = ({
  valueInDay,
  setInput,
  inputType,
  setInputType,
  onMutate,
}) => {
  useEffect(() => {
    parseDays(valueInDay);
  }, []);

  const parseDays = (value) => {
    if (inputType === "day") {
      setInputType("day");
    }

    if (value >= 30 && value < 365) {
      let tempValue = value / 30;
      setInput(Number.isInteger(tempValue) ? tempValue : tempValue.toFixed(1));
      setInputType("month");
    }

    if (value >= 365) {
      let tempValue = value / 365;

      setInput(
        Number.isInteger(tempValue) ? tempValue : (value / 365).toFixed(1)
      );
      setInputType("year");
    }
  };
  return (
    <div
      onClick={(event) => {
        event?.preventDefault();
        event?.stopPropagation();
      }}
      className={`inherit d_flex  ${css.dateTypeDropDown}`}
    >
      <input
        type="number"
        className="flex"
        value={valueInDay}
        onChange={(e) => setInput(e?.target?.value)}
        autoFocus
        autoComplete="new-password"
        onKeyPress={(e) => {
          var invalidChars = ["-", "+", "e"];

          if (invalidChars.includes(e.key)) {
            e.preventDefault();
          }

          e.key === "Enter" && onMutate();
        }}
      />
      <select
        onChange={(e) => setInputType(e?.target?.value)}
        value={inputType}
      >
        <option value="day">Day</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </div>
  );
};

const daysConversion = (value, setInputType) => {
  if (value < 30) {
    return `${value} day(s)`;
  }

  if (value >= 30 && value < 365) {
    let tempValue = value / 30;
    return `${
      Number.isInteger(tempValue) ? tempValue : tempValue.toFixed(1)
    } month(s)`;
  }

  if (value >= 365) {
    let tempValue = value / 365;
    return `${
      Number.isInteger(tempValue) ? tempValue : tempValue.toFixed(1)
    } year(s)`;
  }
};

function UserSelectRender({ item }) {
  return (
    <div className={`${css.selectRo1w} normalFont d_flex alignCenter`}>
      <CustomAvatar src={item?.profilePicture} small variant="circle" />
      <p className="pl-1"> {item?.name}</p>
    </div>
  );
}
