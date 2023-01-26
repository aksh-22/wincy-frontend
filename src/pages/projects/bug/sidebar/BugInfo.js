import projectInfoCss from "css/ProjectInfo.module.css";
import { useState } from "react";
// import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import CustomButton from "components/CustomButton";
// import bugModal from "css/BugModal.module.css";
// import CustomMenu from "components/CustomMenu";
// import CustomSelect from "components/CustomSelect";
// import CustomPopper from "components/CustomPopper";
// import CustomAvatar from "components/CustomAvatar";
// import BugAssignees from "../BugAssignees";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
// import { useEffect } from "react";
import CommonDialog from "components/CommonDialog";
import CustomRow from "components/CustomRow";
// import CustomImageEditor from "components/imageEditor/CustomImageEditor";
import SelectRenderComponent from "components/SelectRenderComponent";
import moment from "moment";
import { useCallback } from "react";
import { useProjectAllTasks } from "react-query/projects/useProjectAllTasks";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { TextField } from "@material-ui/core";

const bugStatus = [
  {
    label: "Open",
    value: "Open",
    menuName: "bugStatus",
    color: "var(--primary)",
  },
  {
    label: "In Progress",
    value: "InProgress",
    menuName: "bugStatus",
    color: "var(--progressBarColor)",
  },
  {
    label: "In Review",
    value: "InReview",
    menuName: "bugStatus",
    color: "#0098EB",
  },
  {
    label: "Bug Persists",
    value: "BugPersists",
    menuName: "bugStatus",
    color: "var(--red)",
  },
  {
    label: "Done",
    value: "Done",
    menuName: "bugStatus",
    color: "var(--green)",
  },
];

const renderDate = (date) => {
  if (Math.abs(moment(date).diff(new Date(), "days")) > 3) {
    return moment(date).format("ll");
  } else {
    return moment(date).fromNow();
  }
};

function BugInfo({
  bug,
  projectInfo,
  onChange,
  onAttachmentChange,
  updateAttachmentLoading,
  disabled,
  secondDisable,
  projectId,
  orgId
}) {
  const getBugStatusFunction = useCallback((currentStatus) => {
    if (currentStatus === "Open") {
      return [bugStatus[1]];
    }

    if (currentStatus === "InProgress") {
      return [bugStatus[0], bugStatus[2]];
    }

    if (currentStatus === "InReview") {
      return [bugStatus[3], bugStatus[4]];
    }

    if (currentStatus === "BugPersists") {
      return [bugStatus[1]];
    }

    if (currentStatus === "Done") {
      return [bugStatus[0]];
    }
  }, []);
 const {data:taskList} = useProjectAllTasks({ projectId, orgId });

  

  return (
    <div className={`${projectInfoCss?.scrollModule} selectPopOver bugInfo`}>
      {/* {Priority} */}
      <CustomRow
        inputType="menu"
        menuItems={[
          { label: "Low", value: "Low", menuName: "priority" },
          { label: "Medium", value: "Medium", menuName: "priority" },
          { label: "High", value: "High", menuName: "priority" },
        ]}
        value={bug?.priority}
        onChange={onChange}
        field={"Priority"}
        apiKey="priority"
        disabled={disabled}
      />

      {/* Bug Status */}
      <CustomRow
        inputType="menu"
        menuItems={getBugStatusFunction(bug?.status??"Open")}
        value={addSpaceUpperCase(bug?.status??"Open")}
        onChange={onChange}
        field={"Bug Status"}
        apiKey="status"
        disabled={secondDisable}
      />

      {/* {Platform} */}
      <CustomRow
        inputType="menu"
        menuItems={projectInfo?.platforms?.map((row) => {
          return {
            label: row,
            value: row,
          };
        })}
        apiKey="platform"
        // value={bug?.priority}
        onChange={onChange}
        field={"Platform"}
        value={bug?.platform ?? "Un-categorized"}
        disabled={disabled}
      />

{/* <Autocomplete
                  id="country-select-demo"
                  style={{ width: 300 }}
                  options={taskList??[]}
                  classes={{
                    // option: classes.option,
                  }}
                  autoHighlight
                  getOptionLabel={(option) => option?.title ?? ""}
                  value={bug?.task?.[0]}
                  // onChange={(e, value) => setInput(value?.label)}
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.title}
                    </React.Fragment>
                  )}
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
                /> */}
<CustomRow
        inputType="autoComplete"
        menuItems={taskList??[]}
        apiKey="taskId"
        value={bug?.task?.[0]}
        onChange={onChange}
        field={"Task"}
        disabled={disabled}
        containerClassName={"flex"}
        containerClass={"flex"}
        inputStyle={{flex:1}}
        selectRender={<SelectRenderComponent objectKey={"title"}/>}
        autoCompleteGetOptionLabel={(options) => options?.title??""}
        autoCompleteRenderOption={(option) => <React.Fragment>
          {option?.title+""}
        </React.Fragment>}
        autoCompleteOnChangeKey="title"
      />

      {/* {Screen} */}
      {/* {bug?.platform && (
        <div style={{ position: "relative" }}>
          <CustomRow
            value={bug?.section}
            field="Section"
            inputType="select"
            menuItems={sectionData}
            apiKey={"section"}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      )} */}


      <CustomRow
        value={
          Array.isArray(bug?.createdBy) ? bug?.createdBy[0] : bug?.createdBy
        }
        field="Created By"
        // inputType="select"
        // menuItems={["asdasd", "SAdsad"]}
        apiKey={"createdBy"}
        // onChange={onChange}
        disabled={disabled}
      />
      <CustomRow
        value={bug?.createdAt ? renderDate(bug?.createdAt) : "N/A"}
        field="Created On"
        // inputType="select"
        // menuItems={["asdasd", "SAdsad"]}
        // apiKey={"createdBy"}
        // onChange={onChange}
        // disabled={disabled}
      />
      {/* <div className="d_flex">
        <div className={`${projectInfoCss?.fieldTitle}`}>Screen</div>
        <div
          className={`${projectInfoCss?.fieldValue} d_flex px-1 alignCenter`}
        >
          {isEdit ? (
            <CustomSelect
              // errorText={error.priority}
              menuItems={projectInfo?.screens ?? []}
              // value={bugData.priority}
              inputLabel="Screen"
              // handleChange={handleChange}
              name="screen"
              // selectRowClassName={css.selectRow}
              labelClassName={'normalFont'}
            />
          ) : (
            bug?.screen ?? '-'
          )}
        </div>
      </div> */}
      {/* {Assignee} */}
      {/* <div className="d_flex">
        <div className={`${projectInfoCss?.fieldTitle}`}>Assignee</div>
        <div
          className={`${projectInfoCss?.fieldValue} d_flex px-1 alignCenter`}
        >
          {isEdit ? (
            <CustomPopper
              value={
                <CustomAvatar
                  small
                  className="mx-1"
                  src={bug?.assignee?.profilePicture}
                  title={bug?.assignee?.name}
                />
              }
              content={
                <BugAssignees
                  // orgId={orgId}
                  bugId={bug?._id}
                  projectInfo={projectInfo}
                  currentAssignee={bug?.assignee}
                  pageNo={pageNo}
                  platform={activeBug?.id}
                  hideButton
                />
              }
              noHover={true}
            />
          ) : (
            bug?.assignee?.name ?? '-'
          )}
        </div>
      </div> */}
      {/* {Created By} */}
      {/* <div className="d_flex">
        <div className={`${projectInfoCss?.fieldTitle}`}>Created By</div>
        <div
          className={`${projectInfoCss?.fieldValue} d_flex px-1 alignCenter`}
        >
          {bug?.createdBy?.name}
        </div>
      </div> */}

      {
        //    Attachments
      }
      {/* <CustomRow
        inputType="file"
        value={bug?.attachment}
        onChange={onAttachmentChange}
        isLoading={updateLoading}
        apiKey="attachment"
      /> */}
      {!disabled && (
        <CommonDialog
          actionComponent={<AddAttachment />}
          content={
            <ManageAttachment
              value={bug?.attachments}
              onChange={onAttachmentChange}
              isLoading={updateAttachmentLoading}
            />
          }
          modalTitle="Manage Attachment"
          height={400}
          width={600}
        />
      )}
      <div className={`${disabled ? "mb-1" : ""}`} />
      <CustomRow value={bug?.attachments} inputType="file" />
      {/* <div
        className="d_flex alignCenter justifyContent_center  my-2"
        style={{ position: "relative" }}
      >
        {!isEdit ? (
          bug?.attachment !== undefined &&
          (["mp4", "webm", "mkv"].includes(
            bug?.attachment.split(".")[(bug?.attachment.split(".")).length - 1]
          ) ? (
            <video width="100%" height="200" controls>
              <source src={bug.attachment} />
            </video>
          ) : (
            <img src={bug.attachment} className={bugModal.imageStyle} />
          ))
        ) : updateObj?.attachment === "" ||
          updateObj?.attachment === undefined ? (
          <div className="flex d_flex">
            <CustomButton
              className={`${bugModal.uploadButton} d_flex alignCenter my-2`}
              onClick={() => uploadRef.click()}
            >
              Upload &nbsp;{" "}
              <CloudUploadOutlinedIcon
                style={{ fontSize: 22, marginBottom: 3 }}
              />
            </CustomButton>
          </div>
        ) : ["mp4", "webm", "mkv"].includes(
            updateObj?.attachment?.name?.split(".")[
              (updateObj?.attachment?.name?.split(".")).length - 1
            ]
          ) ? (
          <video width="100%" height="200" controls>
            <source
              src={
                updateObj.attachment?.name === undefined
                  ? updateObj?.attachment?.name
                  : URL.createObjectURL(updateObj?.attachment)
              }
            />
          </video>
        ) : (
          <img
            src={
              updateObj.attachment?.type === undefined
                ? updateObj?.attachment?.name
                : URL.createObjectURL(updateObj?.attachment)
            }
            className={`${bugModal.imageStyle}`}
          />
        )}
        {isEdit &&
          updateObj?.attachment !== "" &&
          updateObj?.attachment !== undefined && (
            <CancelOutlinedIcon
              className={bugModal.cancelButton}
              onClick={() =>
                setUpdateObj({
                  ...updateObj,
                  attachment: "",
                })
              }
            />
          )}
        <input
          type="file"
          style={{ display: "none" }}
          ref={(ref) => (uploadRef = ref)}
          onChange={fileChangeHandle}
        />
      </div>
      <div style={{ height: 50 }} /> */}
    </div>
  );
}

export default BugInfo;

function AddAttachment({ onClick }) {
  return (
    <div onClick={onClick} className={projectInfoCss.ManageButtonCss}>
      Manage Attachment
    </div>
  );
}

function ManageAttachment({ value, onChange, isLoading , handleClose }) {
  const [attachment, setAttachment] = useState([]);
  const [removeAttachment, setRemoveAttachment] = useState([]);
  const onLocalUpdate = (value, type) => {
    type === undefined && setAttachment(value);
    type !== undefined && setRemoveAttachment(value);
  };
  const emptyLocalAttachment = () => {
    setAttachment([]);
    setRemoveAttachment([]);
  };
  return (
    <>
      <div style={{ minHeight: 275 }}>
        <CustomRow
          inputType="file"
          value={value}
          onChange={onLocalUpdate}
          isLoading={isLoading}
          apiKey="attachment"
        />
      </div>
      {(attachment?.length > 0 || removeAttachment?.length > 0) && (
        <div className="d_flex flex justifyContent_end">
          <CustomButton
            loading={isLoading}
            disabled={isLoading}
            onClick={() =>
              onChange({ attachment, removeAttachment, emptyLocalAttachment , handleClose })
            }
          >
            Save
          </CustomButton>
        </div>
      )}
    </>
  );
}
