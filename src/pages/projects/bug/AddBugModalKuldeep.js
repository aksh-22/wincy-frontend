import React, { useState, useEffect } from "react";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@material-ui/core";
import CustomButton from "components/CustomButton";
import CustomChip from "components/CustomChip";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import { useSelector } from "react-redux";
import ErrorMessage from "components/ErrorMessage";
import CustomSelect from "components/CustomSelect";
import css from "css/BugModal.module.css";
import CustomAvatar from "components/CustomAvatar";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import CancelIcon from "@material-ui/icons/Cancel";
import BugReportIcon from "@material-ui/icons/BugReport";
import { errorToast, infoToast } from "utils/toast";
import { useAddBug } from "react-query/bugs/useAddBug";
import { useMyworkAddBug } from "react-query/mywork/useMyworkAddBug";
import BugAttachmentModal from "./BugAttachmentModal";
import TextInput from "components/textInput/TextInput";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import classes from "./Bug.module.css";
import CustomAutoComplete from "components/CustomAutoComplete";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { countries } from "utils/countries";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import { LightTooltip } from "components/tooltip/LightTooltip";
import Card from "@material-ui/core/Card";
import Visibility from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutline";
// import { createFilterOptions } from "@material-ui/material/Autocomplete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const filter = createFilterOptions();

function AddBugModal({
  projectInfo,
  bugAdd,
  platform,
  pageNo,
  handleClose,
  type,
  team,
}) {
  // console.log("platform", platform);
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const [addScreenBtn, setAddScreenBtn] = useState(false);

  const screens = projectInfo?.screens.map((el) => {
    return { title: el, value: el };
  });

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    statusbar: false,
    // toolbar: false,
    toolbarInline: false,
    // toolbarInlineDisableFor: ["bold"],
    // toolbarInlineDisabledButtons: ["source", "bold"],
    // toolbarButtonSize: 3,
    removeButtons: [
      "superscript",
      "subscript",
      "source",
      "image",
      "video",
      "file",
      "copyformat",
      "table",
      "symbol",
      "fullsize",
      "preview",
      "print",
      "about",
    ],
  };
  let uploadRef = React.createRef();
  // console.log("projectInfo:", projectInfo);
  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    platform: "",
    assignee: "",
    priority: "Medium",
    screen: "",
    attachment: [],
  });
  const [error, setError] = useState({
    title: "",
    description: "",
    platform: "",
    assignee: "",
    priority: "",
    screen: "",
    attachment: "",
  });
  const [assignee, setAssignee] = useState([]);

  const [addScreen, setAddScreen] = useState(platform);

  useEffect(() => {
    let local = [];
    if (projectInfo?.projectHead) {
      local.push(projectInfo?.projectHead);
    }
    if (projectInfo?.team) {
      local = [...local, ...projectInfo?.team];
    }
    setAssignee(team);
  }, [projectInfo]);

  useEffect(() => {
    // console.log("once");
    document.addEventListener("paste", onHandlePaste);
    return () => {
      document.removeEventListener("paste", onHandlePaste);
    };
  }, []);

  const myStateRef = React.useRef(bugData);
  const onHandlePaste = (ev) => {
    const { title, description, assignee, priority } = myStateRef.current;

    var imgFile = null;
    var idx;
    let newArray = [];
    var items = ev.clipboardData.items;

    for (idx = 0; idx < items.length; idx++) {
      //check if any content is file
      if (items[idx].kind === "file") {
        //take that file to imgFile
        imgFile = items[idx].getAsFile();
        if (imgFile.type.includes("image")) {
          newArray.push(imgFile);
        }
        // break;
      }
    }
    if (imgFile == null) {
      return;
    }

    // console.log(
    //   title.length > 0 && description.length > 0 && priority.length > 0
    // );
    if (
      title.length > 0 &&
      description.length > 0 &&
      typeof assignee === "object" &&
      priority.length > 0
    ) {
      setBugData({
        ...myStateRef.current,
        attachment: [...newArray],
      });
    } else {
      return infoToast("Please fill required field first.");
    }
  };

  const handleChange = (field, value) => {
    // console.log(event?.target?.value);
    setBugData((previousState) => ({
      ...previousState,
      [field]: value,
    }));
    myStateRef.current = {
      ...bugData,
      [field]: value,
    };
    setError({
      ...error,
      [field]: "",
    });
  };

  // const handleChange = (event) => {
  //   console.log(event?.target?.value);
  //   setBugData((previousState) => ({
  //     ...previousState,
  //     [event?.target?.name]: event.target.value,
  //   }));
  //   myStateRef.current = {
  //     ...bugData,
  //     [event?.target?.name]: event.target.value,
  //   };
  //   setError({
  //     ...error,
  //     [event?.target?.name]: "",
  //   });
  // };

  const [priorityOptions] = useState(["High", "Medium", "Low"]);

  const { isLoading, mutate } = useAddBug(
    projectInfo?._id,
    platform,
    pageNo,
    handleClose
  );
  const { isLoading: myWorkLoading, mutate: myWorkMutate } = useMyworkAddBug(
    projectInfo?._id,
    platform,
    pageNo,
    handleClose
  );

  const fileChangeHandle = (e) => {
    // let temp = bug?.attachment;      //For Multiple Selection

    let temp = []; // for single Selection
    for (let i = 0; i < Object.keys(e.target.files).length; i++) {
      // console.log(e.target.files[i].type);
      temp.push(e.target.files[i]);

      if (e.target.files[i].type?.includes("video")) {
        // console.log("Video");
        return errorToast("Only image file format is supported");
      } else if (e.target.files[i]?.type?.includes("image")) {
        // console.log("Image");
      } else {
        return errorToast("Only image file format is supported");
      }
    }

    setBugData({
      ...bugData,
      attachment: temp,
    });
  };

  // const removeFile = (index) => {
  //   let temp = [...bugData?.attachment];
  //   temp.splice(index, 1);
  //   setBugData({
  //     ...bugData,
  //     attachment: temp,
  //   });
  // };

  const onSubmit = () => {
    if (bugData.title === "") {
      return setError({
        ...error,
        title: "Title field is required.",
      });
    }
    // if (bugData.description === "") {
    //   return setError({
    //     ...error,
    //     description: "Description field is required.",
    //   });
    // }
    if (bugData.assignee === "") {
      return setError({
        ...error,
        assignee: "Assignee field is required.",
      });
    }

    if (bugData.priority === "") {
      return setError({
        ...error,
        priority: "Priority field is required.",
      });
    }

    let fd = new FormData();
    fd.append("title", bugData.title);
    fd.append("platform", platform === "uncategorized" ? undefined : platform);
    fd.append("priority", bugData.priority);
    fd.append("description", bugData.description);
    fd.append("assignee", bugData.assignee?._id);
    fd.append("screen", bugData.screen);
    bugData.attachment.length !== 0 &&
      bugData.attachment.map((file, i) => {
        fd.append("attachments", file.newFile, file.name);
        return null;
      });
    if (type === "myWork") {
      myWorkMutate(fd);
    } else {
      mutate(fd);
    }
    // bugAdd(bugData)
  };

  const imageEditor = () => {
    const { title, description, assignee, priority } = bugData;

    if (
      title === "" ||
      description === "" ||
      assignee === "" ||
      priority === ""
    ) {
      return infoToast("Please fill required field first.");
    }
    uploadRef.click();
  };

  const updateAttachmentImageEditor = (value, index, type) => {
    let newBugData = { ...bugData };
    newBugData.attachment[index] = value;
    setBugData((previousState) => ({
      ...newBugData,
    }));
    // console.log(value, index, type);
    type === "Upload" && onSubmit();
  };
  // console.log({ bugData });
  return (
    <div className="selectPopOver">
      <div className={classes.topTwo}>
        <TextInput
          // label="Title*"
          placeholder="Title*"
          name="title"
          onChange={(e) => handleChange("title", e.target.value)}
          // className="mt-1 "
          value={bugData?.title}
          autoFocus
          error={error?.title ? true : false}
          helperText={error?.title}
          style={{ marginTop: "16px", width: "100%" }}
        />

        {/* <TextField
        label="Description*"
        fullWidth
        name="description"
        onChange={handleChange}
        className="mt-1"
        value={bugData?.description}
        InputProps={{ className: "normalFont" }}
        InputLabelProps={{ className: "normalFont" }}
        multiline
        maxRows={4}
        error={error?.description ? true : false}
        helperText={error?.description}
      /> */}

        {/* {console.log("aasds", bugData.assignee)} */}

        <CustomSelect
          errorText={error.assignee}
          menuItems={assignee}
          value={bugData.assignee.length !== 0 ? bugData.assignee : "Assignee*"}
          // inputLabel="Assignee*"
          placeholder="Assignee*"
          menuRenderComponent={<SelectRender />}
          selectRenderComponent={<SelectRender />}
          handleChange={(e) => handleChange("assignee", e.target.value)}
          // handleChange={handleChange}
          name="assignee"
          selectRowClassName={css.selectRow}
          labelClassName={"normalFont"}
          // className={"pt-1"}
          className={`${classes.select} ${
            bugData.assignee.length === 0 && classes.selected
          }`}
        />
        {/* {console.log("aaa", projectInfo?.screens)} */}
        <div className={classes.screenInput}>
          {platform && (
            <Autocomplete
              id="combo-box-demo"
              // value={bugData?.screen}
              // handleChange={(e) => handleChange("screen", e.target.value)}
              onChange={(e, value) => {
                console.log(value?.value);
                handleChange("screen", value?.value);
                // handleChange("screen", value);
              }}
              options={screens ?? []}
              getOptionLabel={(option) => {
                // console.log(typeof option);
                // return typeof option === "object" ? option.title : option;
                return option.value;
              }}
              style={{ width: "100%" }}
              forcePopupIcon={true}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue !== "") {
                  filtered.push({
                    value: params?.inputValue,
                    title: `Add "${params.inputValue}"`,
                  });
                }
                // console.log(filtered);
                return filtered;
              }}
              renderOption={(props, option) => {
                // console.log("props", props);
                // console.log("option", option);
                return (
                  <li style={{ color: "black" }} {...props}>
                    {props.title}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // label="Combo box"
                  placeholder="Select an screen"
                  variant="standard"
                  onChange={(e) => {
                    // console.log(projectInfo?.screens, e.target.value);
                    // console.log(projectInfo?.screens.includes(e.target.value));
                    projectInfo?.screens.includes(e.target.value)
                      ? setAddScreenBtn(false)
                      : setAddScreenBtn(true);
                  }}
                />
              )}
            />
          )}
          {/* {platform && (
            <>
              <Autocomplete
                id="combo-box-demo"
                // handleChange={(e) => handleChange("screen", e.target.value)}
                onChange={(e) => handleChange("screen", e.target.value)}
                options={projectInfo?.screens ?? []}
                getOptionLabel={(option) => option}
                style={{ width: "90%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // label="Combo box"
                    placeholder="Select an screen"
                    variant="standard"
                  />
                )}
              />
              {!showPopup ? (
                <LightTooltip title="Add a Screen">
                  <IconButton
                    style={{ color: "#fff", padding: 0, marginLeft: 10 }}
                    onClick={() => {
                      // setAddScreen(true);
                      setShowPopup(true);
                    }}
                  >
                    <AddCircleOutlineOutlinedIcon />
                  </IconButton>
                </LightTooltip>
              ) : (
                <LightTooltip title="Cancel">
                  <IconButton
                    style={{ color: "#fff", padding: 0, marginLeft: 10 }}
                    onClick={() => {
                      // setAddScreen(false);
                      setShowPopup(false);
                    }}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </LightTooltip>
              )}
            </>
          ) : (
            <>
              <TextInput placeholder="Enter new screen name" />
              <IconButton>
                <DoneOutlinedIcon />
              </IconButton>
              <LightTooltip title="Cancel">
                <IconButton
                  style={{ color: "#fff", padding: 0, marginLeft: 10 }}
                  onClick={() => {
                    setAddScreen(false);
                  }}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </LightTooltip>
            </>
          )}
          {showPopup && (
            <Card
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: 20,
                backgroundColor: "var(--blackMirror)",
                border: "1px solid var(--divider)",
                padding: 10,
                display: "flex",
                flexDirection: "column",
                backdropFilter: "blur(3px)",
              }}
            >
              <TextInput
                // variant="outlined"
                placeholder="Add an screen"
                style={{ margin: 10, color: "#fff" }}
              />
              <CustomButton>Add</CustomButton>
            </Card>
          )} */}
        </div>
        <div className={classes.priority}>
          <p>Priority :</p>
          <div className={classes.priorities}>
            <IconButton
              onClick={() => {
                handleChange("priority", "High");
              }}
            >
              <CustomButton
                type={bugData.priority !== "High" ? "outlined" : "contained"}
              >
                High
              </CustomButton>
            </IconButton>
            <IconButton
              onClick={() => {
                handleChange("priority", "Medium");
              }}
            >
              <CustomButton
                type={bugData.priority !== "Medium" ? "outlined" : "contained"}
              >
                Medium
              </CustomButton>
            </IconButton>
            <IconButton
              onClick={() => {
                handleChange("priority", "Low");
              }}
            >
              <CustomButton
                type={bugData.priority !== "Low" ? "outlined" : "contained"}
              >
                Low
              </CustomButton>
            </IconButton>
          </div>
        </div>

        {/* <CustomSelect
        errorText={error.priority}
        menuItems={priorityOptions}
        value={bugData.priority}
        inputLabel="Priority*"
        handleChange={handleChange}
        name="priority"
        selectRowClassName={css.selectRow}
        labelClassName={"normalFont mt-1"}
        className={"pt-1"}
        style={{ width: "50%", marginRight: 16 }}
      /> */}

        {/* <CustomSelect
          errorText={error.screen}
          menuItems={projectInfo?.screens ?? []}
          value={bugData.screen}
          inputLabel="Screen"
          // handleChange={handleChange}
          handleChange={(e) => handleChange("screen", e.target.value)}
          name="screen"
          selectRowClassName={css.selectRow}
          labelClassName={"normalFont mt-1"}
          className={"pt-1"}
          // style={{ width: "50%", marginRight: 16 }}
        /> */}
        {/* {console.log(projectInfo?.screens)} */}
      </div>

      {bugData?.attachment?.length > 0 && (
        <BugAttachmentModal
          OtherClose={() =>
            setBugData({
              ...bugData,
              attachment: [],
            })
          }
          attachments={bugData?.attachment}
          updateAttachmentImageEditor={updateAttachmentImageEditor}
        />
      )}
      <div style={{ color: "#000" }}>
        <JoditEditor
          // toolbarInlineDisableFor={["Bold"]}
          // toolbarInlineDisabledButtons={["source", "bold"]}
          // customToolbar="undo,redo,|,bold,italic,underline,strikethrough,|,font,fontsize,brush,|,indent,outdent,|,ul,ol,|,superscript,subscript,eraser,|,table,|,fullsize,print"
          ref={editor}
          value={content}
          config={config}
          tabIndex={1} // tabIndex of textarea
          theme="dark"
          onBlur={(e, a) => {
            // setContent(newContent);
            // console.log(editor);

            // console.log(e);
            setBugData((previousState) => ({
              ...previousState,
              description: JSON.stringify(e),
            }));
            myStateRef.current = {
              ...bugData,
              description: JSON.stringify(e),
            };
            setError({
              ...error,
              description: "",
            });
          }} // preferred to use only this option to update the content for performance reasons
          // onChange={(e) => {
          //   console.log(e);
          // }}
        />
      </div>
      {/* <div style={{ position: "relative" }} className="my-1">
        {bugData?.attachment?.map((item, index) => (
          <>
            {item.type?.includes("image") ? (
              <img src={URL.createObjectURL(item)} className={css.imageStyle} />
            ) : (
              <video
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
                controls
              >
                <source src={URL.createObjectURL(item)} type={item.type} />
              </video>
            )}
            <CancelIcon
              className={css.cancelButton}
              onClick={() => removeFile(index)}
            />
          </>
        ))}
      </div> */}

      <div className="d_flex justifyContent_between mt-2 alignCenter">
        {bugData?.attachment?.length <= 5 && (
          <CustomButton
            className={`${css.uploadButton} d_flex alignCenter`}
            onClick={imageEditor}
          >
            <div className="d_flex alignCenter">
              Upload &nbsp;
              <CloudUploadOutlinedIcon
                style={{ fontSize: 22, marginBottom: 3 }}
              />
            </div>
          </CustomButton>
        )}

        <CustomButton
          onClick={onSubmit}
          className={""}
          width={80}
          disabled={type === "myWork" ? myWorkLoading : isLoading}
          loading={type === "myWork" ? myWorkLoading : isLoading}
        >
          Add <BugReportIcon style={{ fontSize: 22, marginBottom: 3 }} />
        </CustomButton>
      </div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={(ref) => (uploadRef = ref)}
        onChange={fileChangeHandle}
        onClick={(event) => {
          event.target.value = null;
        }}
        multiple
      />
    </div>
  );
}

export default AddBugModal;

function SelectRender({ item }) {
  return (
    <div className={`${css.selectRo1w} normalFont d_flex alignCenter`}>
      <CustomAvatar src={item?.profilePicture} small variant="circle" />
      <p className="pl-1"> {item?.name}</p>
    </div>
  );
}
