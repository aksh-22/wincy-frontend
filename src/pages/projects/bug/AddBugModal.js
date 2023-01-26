import { IconButton } from "@material-ui/core";
import BugReportIcon from "@material-ui/icons/BugReport";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AttachmentModal from "components/attachmentModal/AttachmentModal";
import CustomButton from "components/CustomButton";
import CustomSelect from "components/CustomSelect";
import DragAndDropFile from "components/DragAndDropFile";
import SelectRenderComponent from "components/SelectRenderComponent";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useProjectTeam } from "hooks/useUserType";
import React, { useEffect, useState } from "react";
import { useAddBug } from "react-query/bugs/useAddBug";
import { useAddSection } from "react-query/bugs/useAddSection";
import { useTasks } from "react-query/milestones/task/useTasks";
import { useMilestones } from "react-query/milestones/useMilestones";
import { useMyworkAddBug } from "react-query/mywork/useMyworkAddBug";
import { errorToast } from "utils/toast";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";
import AddBugEditor from "./AddBugEditor";
import AssigneeSelect from "./AssigneeSelect";
import classes from "./Bug.module.css";
import BugName from "./BugName";

const selectPlaceHolder = {
  milestone: "Select milestone*",
  task: "Select task*",
};

function AddBugModal({
  projectInfo,
  bugAdd,
  platform,
  platformId,
  pageNo,
  handleClose,
  type,
  team,
  orgId,
}) {
  const { mutate: addSectionMutate } = useAddSection();

  const ref = React.useRef("");
  const EditorRef = React.useRef(null);

  const [attachmentModal, setAttachmentModal] = useState(false);

  const [attachmentBtn, setAttachmentBtn] = useState("Done");

  const [currImageIndex, setCurrImageIndex] = useState(0);

  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    platform: "",
    assignees: [],
    priority: "Medium",
    section: "",
    attachment: [],
  });
  const [error, setError] = useState({
    title: "",
    description: "",
    platform: "",
    assignee: "",
    priority: "",
    section: "",
    attachment: "",
    bugInAnotherPlatformAssignee: "",
  });
  const [assignee, setAssignee] = useState([]);
  const { project } = useProjectTeam();
  const [bugInAnotherPlatform, setBugInAnotherPlatform] = useState([]);

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

  const myStateRef = React.useRef(bugData);

  const handleChange = (field, value, section) => {
    setBugData((previousState) => ({
      ...previousState,
      [field]: value,
    }));
    myStateRef.current = {
      ...bugData,
      [field]: value,
    };
    section &&
      addSectionMutate({
        data: { section: value },
        orgId,
        projectId: projectInfo?._id,
        platformId: platformId,
      });
    setError({
      ...error,
      [field === "assignees" ? "assignee" : field]: "",
    });
  };

  const { isLoading, mutate } = useAddBug(
    projectInfo?._id,
    undefined,
    pageNo,
    handleClose
  );
  const { isLoading: myWorkLoading, mutate: myWorkMutate } = useMyworkAddBug(
    projectInfo?._id,
    platform,
    pageNo,
    handleClose
  );

  const fileChangeHandle = (files) => {
    setAttachmentBtn("Done");
    // let temp = bug?.attachment;      //For Multiple Selection
    if (
      (files.length ?? Object.keys(files).length + bugData.attachment.length) >
      5
    ) {
      errorToast("Maximum 5 images required");
    } else {
      let temp = []; // for single Selection
      for (let i = 0; i < Object.keys(files).length; i++) {
        if (files[i]?.type?.includes("image")) {
          temp.push(files[i]);
        } else {
          return errorToast("Only image file format is supported");
        }
      }

      setCurrImageIndex(bugData.attachment.length);
      setBugData({
        ...bugData,
        attachment: [...bugData.attachment, ...temp],
      });
      setAttachmentModal(true);
    }
  };

  const onHandlePaste = (ev) => {
    var imgFile = null;
    var idx;
    let newArray = {};
    var items = ev.clipboardData.items;
    let id = 0;

    for (idx = 0; idx < items.length; idx++) {
      //check if any content is file
      imgFile = items[idx].getAsFile();
      console.log(items[idx].kind);
      console.log(imgFile?.type);
      console.log(imgFile?.type?.includes("image"));
      if (items[idx].kind === "file") {
        //take that file to imgFile
        if (imgFile?.type?.includes("image")) {
          newArray = { ...newArray, [id]: imgFile };
          id += 1;
        }
      }
    }
    Object.keys(newArray).length > 0 && fileChangeHandle(newArray);
    console.log(newArray);
  };

  const onSubmit = () => {
    if (bugInAnotherPlatform?.length) {
      // for()
      for (let i = 0; i < bugInAnotherPlatform?.length; i++) {
        if (!bugInAnotherPlatform[i]?.assignees?.length) {
          errorToast(
            `Please add assignee in ${bugInAnotherPlatform[i]?.platform} platform `
          );
          return;
        }
      }
    }
    if (ref?.current?.value.trim().length < 1 || !ref?.current?.value) {
      setError({
        ...error,
        title: "Title field is required.",
      });
      ref.current.focus();
    } else if (bugData?.assignees?.length <= 0) {
      setError({
        ...error,
        assignee: "Assignee field is required.",
      });
    } else if (taskRelation?.milestone === selectPlaceHolder.milestone) {
      setError({
        ...error,
        milestone: "Milestone field is required.",
      });
    } else if (taskRelation?.task === selectPlaceHolder.task) {
      setError({
        ...error,
        task: "Task field is required.",
      });
    } else {
      const assigneeIds = bugData?.assignees?.map((el) => el._id);
      let fd = new FormData();
      fd.append("title", ref.current.value);
      fd.append(
        "platform",
        platform === "uncategorized" ? undefined : platform
      );
      fd.append("priority", bugData.priority);
      fd.append(
        "description",
        EditorRef?.current?.value === "<p><br></p>"
          ? undefined
          : EditorRef?.current?.value
      );
      fd.append("assignees", JSON.stringify(assigneeIds));
      // fd.append("section", bugData.section);
      fd.append("taskId", taskRelation?.task?._id);

      // fd.append("assigneeData", bugData.assignees);
      // bugData.attachment.length !== 0 &&
      //   bugData.attachment.map((file, i) => {
      //     fd.append("attachments", file, file.name);
      //     return null;
      //   });
      bugData.attachment.length !== 0 &&
        bugData.attachment.forEach((file, i) =>
          fd.append("attachments", file, file.name)
        );
      if (type === "myWork") {
        myWorkMutate({ fd, assigneeData: bugData.assignees });
      } else {
        mutate({ fd, assigneeData: bugData.assignees, platform });

        if (bugInAnotherPlatform?.length) {
          bugInAnotherPlatform?.map((item) => {
            let fd_temp = new FormData();
            fd_temp.append("title", ref.current.value);
            fd_temp.append("priority", bugData.priority);
            fd_temp.append(
              "description",
              EditorRef?.current?.value === "<p><br></p>"
                ? undefined
                : EditorRef?.current?.value
            );
            fd_temp.append("taskId", taskRelation?.task?._id);
            // fd_temp.append("section", bugData.section);
            bugData.attachment.length !== 0 &&
              bugData.attachment.forEach((file, i) =>
                fd.append("attachments", file, file.name)
              );
            let assigneeIds_ = item?.assignees?.map((el) => el._id);
            fd_temp.append("platform", item?.platform);
            fd_temp.append("assignees", JSON.stringify(assigneeIds_));
            mutate({
              fd: fd_temp,
              assigneeData: item.assignees,
              platform: item?.platform,
            });
            return null;
          });
        }
      }
    }
    // bugAdd(bugData)
  };



  const onBugInAnotherPlatform = (value, name, index) => {
    if (name === "assignees") {
      let temp_ = [...bugInAnotherPlatform];

      temp_[index].assignees = value;
      setBugInAnotherPlatform(temp_);
      return null;
    }
    let temp = [...bugInAnotherPlatform];
    let findIndex = temp?.findIndex((item) => item?.platform === value);
    if (findIndex === -1) {
      temp.push({
        platform: value,
        assignees: [],
      });
    } else {
      temp.splice(findIndex, 1);
    }
    setBugInAnotherPlatform(temp);
  };

  const [taskRelation, setTaskRelation] = useState({
    milestone: selectPlaceHolder.milestone,
    task: selectPlaceHolder.task,
  });

  const { data: milestoneList, isLoading: milestoneIsLoading } = useMilestones(
    orgId,
    projectInfo?._id
  );
  const { data: taskData, isLoading: taskIsLoading } = useTasks(
    orgId,
    taskRelation?.milestone !== selectPlaceHolder.milestone
      ? taskRelation?.milestone?._id
      : null
  );
  const onHandleTaskRelation = (event) => {
    const { name, value } = event?.target;
    setTaskRelation({
      ...taskRelation,
      [name]: value,
    });
    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };
  return (
    <>
      {attachmentModal && (
        <AttachmentModal
          OtherClose={() => {
            setAttachmentModal(false);
          }}
          index={currImageIndex}
          attachments={bugData?.attachment}
          btn={attachmentBtn}
          onChange={(files) => {
            setBugData({
              ...bugData,
              attachment: files,
            });
            // fileChangeHandle(files);
          }}
        />
      )}

      <DragAndDropFile
        handleDrop={(e) => {
          fileChangeHandle(e.files);
        }}
      >
        <div className="selectPopOver" onPaste={onHandlePaste}>
          <div className={classes.topTwo}>
            <BugName error={error?.title} ref={ref} />

            <AssigneeSelect
              assignee={assignee}
              assignees={bugData?.assignees}
              error={error?.assignee}
              onClose={(arr) => {
                handleChange("assignees", arr);
              }}
            />

            <CustomSelect
              menuItems={milestoneList?.[3]?.milestonesData ?? []}
              isLoading={milestoneIsLoading}
              placeholder={selectPlaceHolder.milestone}
              selectRenderComponent={
                <SelectRenderComponent objectKey={"title"} />
              }
              menuRenderComponent={<SelectRenderComponent />}
              className={"flex"}
              value={taskRelation.milestone}
              handleChange={onHandleTaskRelation}
              name="milestone"
              errorText={error?.milestone}
            />

            <CustomSelect
              menuItems={
                !taskData ? [] : taskData?.map((item) => item?.tasks)?.flat()
              }
              isLoading={taskIsLoading}
              disabled={taskIsLoading}
              placeholder={selectPlaceHolder?.task}
              selectRenderComponent={
                <SelectRenderComponent objectKey={"title"} />
              }
              menuRenderComponent={<SelectRenderComponent />}
              className={"flex"}
              value={taskRelation?.task}
              handleChange={onHandleTaskRelation}
              name="task"
              errorText={error?.task}
            />

            {/* <SetScreen
              section={bugData?.section}
              sectionsArr={sectionsArr}
              platformId={platformId}
              handleChange={handleChange}
            /> */}

            <div className={classes.priority}>
              <p>Priority :</p>
              <div className={classes.priorities}>
                <CustomButton
                  style={{ margin: 10, marginLeft: 0, marginRight: 10 }}
                  onClick={() => {
                    handleChange("priority", "High");
                  }}
                  type={bugData.priority !== "High" ? "outlined" : "contained"}
                >
                  High
                </CustomButton>
                <CustomButton
                  style={{ margin: 10, marginLeft: 0, marginRight: 10 }}
                  onClick={() => {
                    handleChange("priority", "Medium");
                  }}
                  type={
                    bugData.priority !== "Medium" ? "outlined" : "contained"
                  }
                >
                  Medium
                </CustomButton>
                <CustomButton
                  style={{ margin: 10, marginLeft: 0, marginRight: 10 }}
                  onClick={() => {
                    handleChange("priority", "Low");
                  }}
                  type={bugData.priority !== "Low" ? "outlined" : "contained"}
                >
                  Low
                </CustomButton>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className={`${classes.priority} `}>
              <p>Bug Occur in another platform :</p>
              <div className={classes.priorities}>
                {project?.platforms?.map(
                  (item) =>
                    item !== platform && (
                      <IconButton
                        onClick={() => {
                          onBugInAnotherPlatform(item, "platform");
                        }}
                        key={item}
                      >
                        <CustomButton
                          type={
                            bugInAnotherPlatform?.findIndex(
                              (row) => row?.platform === item
                            ) === -1
                              ? "outlined"
                              : "contained"
                          }
                        >
                          {item}
                        </CustomButton>
                      </IconButton>
                    )
                )}
              </div>
            </div>
            {bugInAnotherPlatform?.map((item, index) => (
              <div key={item?.platform} className="mb-2">
                <p>{item?.platform}</p>
                <AssigneeSelect
                  assignee={assignee}
                  assignees={item?.assignees}
                  error={error?.bugInAnotherPlatformAssignee}
                  // onClose={}
                  // handleChange={(e) => handleChange("assignee", e.target.value)}
                  onClose={(arr) => {
                    // bugData?.assignees?.length === 0 && e.target.value.shift();
                    // const assigneeIds = e.target.value.map((el) => el.id);
                    // const temp = [...bugData?.assignees];
                    // temp.push(e.target.value);
                    console.log(arr);
                    onBugInAnotherPlatform(arr, "assignees", index);
                  }}
                />
              </div>
            ))}
          </div>

          <AddBugEditor
            value={bugData.description}
            error={error?.description ? true : false}
            helperText={error?.description}
            onHandlePaste={onHandlePaste}
            ref={EditorRef}
          />

          <div className={classes.attachment}>
            <input
              type="file"
              accept="image/*"
              multiple
              id="bug-attachment"
              style={{ display: "none" }}
              onChange={(e) => {
                fileChangeHandle(e.target.files);
              }}
            />
            {bugData?.attachment.length < 5 && (
              <label htmlFor="bug-attachment">
                <div className={classes.upload}>
                  <CloudUploadOutlinedIcon />
                  <p
                    style={{
                      KhtmlUserSelect: "none",
                    }}
                    className={classes.text}
                  >
                    Drop files to attach, or
                    <span style={{ color: "lightblue", marginLeft: 5 }}>
                      browse
                    </span>
                  </p>
                </div>
              </label>
            )}
            {bugData?.attachment.length > 0 && (
              <div className={classes.images}>
                {bugData?.attachment?.map((el, index) => (
                  <div
                    className={classes.imageComponent}
                    key={uniqueIdGenerator()}
                  >
                    <img src={URL.createObjectURL(el)} alt={index} />
                    <div className={classes.close}>
                      <LightTooltip title="Edit">
                        <IconButton
                          style={{ color: "var(--primary)" }}
                          onClick={() => {
                            setAttachmentBtn("Update");
                            setAttachmentModal(true);
                            setCurrImageIndex(index);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </LightTooltip>
                      <LightTooltip title="Remove">
                        <IconButton
                          style={{ color: "var(--red)" }}
                          onClick={() => {
                            const temp = bugData.attachment;
                            temp.splice(index, 1);
                            setBugData((previousState) => ({
                              ...previousState,
                              attachment: temp,
                            }));
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </LightTooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d_flex justifyContent_center mt-2 alignCenter">
            <CustomButton
              onClick={onSubmit}
              className={""}
              width="100%"
              disabled={type === "myWork" ? myWorkLoading : isLoading}
              loading={type === "myWork" ? myWorkLoading : isLoading}
            >
              Add Bug
              <BugReportIcon style={{ fontSize: 22, marginLeft: 10 }} />
            </CustomButton>
          </div>
        </div>
      </DragAndDropFile>
    </>
  );
}

export default React.memo(AddBugModal);
