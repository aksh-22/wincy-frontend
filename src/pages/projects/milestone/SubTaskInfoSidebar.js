import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import CloseButton from "components/CloseButton";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import CustomRow from "components/CustomRow";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import HeadingLabelSideBar from "components/HeadingLabelSideBar";
import { LightTooltip } from "components/tooltip/LightTooltip";
import "css/Milestone.css";
import css from "css/ProjectInfo.module.css";
import classes from "pages/projects/bug/Bug.module.css";
import React, { useState } from "react";
import { useUpdateTask } from "react-query/milestones/task/useUpdateTask";
import { useUpdateTaskAttachment } from "react-query/milestones/task/useUpdateTaskAttachment";
import { useDeleteSubtask } from "react-query/milestones/useDeleteSubtask";
import { useMarkMultipleSubtask } from "react-query/milestones/useMarkMultipleSubtask";
import { useMyWorkUpdateTask } from "react-query/mywork/useMyWorkUpdateTask";
import { useTodo } from "react-query/todo/useTodo";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import Todo from "./todo/Todo";

function SubTaskInfoSidebar({
  taskInfo,
  orgId,
  userType,
  toggle,
  fromModule,
  projectId,
  milestoneId,
  disabled,
  parentId,
}) {
  const [isSelected, setIsSelected] = useState([]);
  const { mutate: mutateUpdateTask } = useUpdateTask(undefined, projectId);
  const { mutateTask } = useMyWorkUpdateTask();
  const { mutate: mutateUpdateAttachment, isLoading } =
    useUpdateTaskAttachment();
  const editorRef = React.useRef("");

  const { newData: todoData, isLoading: toDoLoading } = useTodo(
    orgId,
    taskInfo?.project,
    taskInfo?._id,
    taskInfo?.assignees,
    taskInfo?.milestone ?? milestoneId
  );
  const onValueChange = (value, field, key) => {
    let data = { [key]: value === "Not Started" ? "NotStarted" : value };
    if (fromModule === "MyWork") {
      let sendData = {
        projectId: projectId,
        orgId: orgId,
        taskId: taskInfo?._id,
        data: data,
      };
      mutateTask(sendData);
    } else {
      taskInfo?._id &&
        mutateUpdateTask({
          taskId: taskInfo?._id,
          data: data,
          orgId: orgId,
          milestoneId: taskInfo?.milestone ?? milestoneId,
          projectId,
          moduleId: taskInfo?.module,
          parentId,
        });
    }
  };

  const { mutate: subTaskDeleteMutate, isLoading: subTaskDeleteMutateLoading } =
    useDeleteSubtask(fromModule, projectId);

  const { mutate: markMutate } = useMarkMultipleSubtask(fromModule, projectId);
  const subtaskMarkAsComplete = (isCompleted) => {
    markMutate({
      data: {
        subTasks: isSelected,
        isCompleted: isCompleted,
      },
      orgId,
      taskId: taskInfo?._id,
      milestoneId: taskInfo?.milestone ?? milestoneId,
      onToggle: () => setIsSelected([]),
      parentId,
    });
  };

  const checkUserType = () => {
    let authorized = ["Admin", "Member++"].includes(userType?.userType)
      ? undefined
      : false;
    return authorized;
  };

  const onUpdateAttachment = (value, removeAttachment) => {
    let fd = new FormData();
    value?.map(
      (file) => file?.name && fd.append("attachments", file, file?.name)
    );
    removeAttachment?.length > 0 &&
      fd.append("removeAttachments", JSON.stringify(removeAttachment));

    mutateUpdateAttachment({
      taskId: taskInfo?._id,
      data: fd,
      orgId: orgId,
      milestoneId: taskInfo?.milestone ?? milestoneId,
      projectId,
      moduleId: taskInfo?.module,
      parentId,
    });
  };

  return (
    <>
      <div className="flex d_flex flex justifyContent_end mb-5">
        <CloseButton onClick={toggle} />
      </div>
      <div className="d_flex alignCenter">
        <div className="flex ml-1">
          <LightTooltip title={taskInfo?.title}>
            <CustomRow
              value={taskInfo?.title}
              placeholderText="Description not available"
              onChange={onValueChange}
              inputType="text"
              apiKey="title"
              inputTextClassName="titleInput "
              valueClassName="titleValue pl-0"
              nonTruncate
              fieldClassName={"pl-0"}
              disabled={disabled}
            />
          </LightTooltip>
        </div>
      </div>

      <div
        className="my-1"
        style={{
          borderBottom: "1px solid var(--divider)",
          height: 10,
          width: "100%",
        }}
      />

      <CustomTextEditor
        ref={editorRef}
        value={taskInfo?.description}
        updateData={(value) => {
          taskInfo?.description !== value &&
            onValueChange(value, undefined, "description");
        }}
        disable={disabled}
      />

      <div style={{ height: "inherit" }} className="mt-2">
        <HeadingLabelSideBar type="basic" />
        <div className={`${css.tableContainer} mb-2`}>
          <CustomRow
            value={taskInfo?.createdAt}
            // onChange={onValueChange}
            inputType="date"
            // apiKey="dueDate"
            field="Created At"
            disabled
          />

          <CustomRow
            value={taskInfo?.dueDate}
            onChange={onValueChange}
            inputType="date"
            apiKey="dueDate"
            field="Deadline"
            disabled={disabled}
          />

          <CustomRow
            value={addSpaceUpperCase(taskInfo?.status)}
            onChange={onValueChange}
            inputType="select"
            menuItems={["Completed", "Active", "Not Started"]}
            apiKey="status"
            field="Status"
            disabled={disabled}
          />

          {taskInfo?.status === "OnHold" && (
            <CustomRow
              value={taskInfo?.onHoldReason}
              onChange={onValueChange}
              apiKey="onHoldReason"
              field="On Hold Reason"
              nonTruncate
              disabled={disabled}
              fieldClassName="alignStart"
              inputType={"text"}
              multiline
              maxRows={3}
            />
          )}

          {taskInfo?.bugCount?.total > 0 && (
            <>
              <CustomRow
                field={"Total Bugs"}
                value={taskInfo?.bugCount?.total}
              />
              <CustomRow
                field={"Total Bugs Done"}
                value={taskInfo?.bugCount?.totalDone}
              />
              <CustomRow
                field={"Total Bugs Remaining"}
                value={
                  (taskInfo?.bugCount?.total ?? 0) -
                  (taskInfo?.bugCount?.totalDone ?? 0)
                }
              />
            </>
          )}
        </div>
        {!disabled && (taskInfo?.attachments?.length ?? 0) < 5 && (
          <label htmlFor="bug-attachment">
            <div className={classes.upload} style={{ marginBottom: 20 }}>
              <CloudUploadOutlinedIcon />
              <p
                style={{
                  htmlUserSelect: "none",
                }}
                className={classes.text}
              >
                Add Files to attach, or
                <span style={{ color: "lightblue", marginLeft: 5 }}>
                  browse
                </span>
              </p>
            </div>
          </label>
        )}
        <AttachmentContainer
          attachment={taskInfo?.attachments}
          attachmentUpdate={onUpdateAttachment}
          // filesAllowed
          disabled={disabled}
          isLoading={isLoading}
        />

        {toDoLoading ? (
          <TableRowSkeleton count={5} />
        ) : (
          todoData?.map((item, index) => <Todo data={item} key={index} />)
        )}
      </div>
      <BottomActionBar
        isSelected={isSelected}
        onClose={() => setIsSelected([])}
        onDelete
        markAsComplete={() => subtaskMarkAsComplete(true)}
        markAsIncomplete={() => subtaskMarkAsComplete(false)}
        data={{
          data: {
            subtasks: isSelected,
          },
          orgId,
          taskId: taskInfo?._id,
          milestoneId: taskInfo?.milestone ?? milestoneId,

          onToggle: () => setIsSelected([]),
        }}
        isLoading={subTaskDeleteMutateLoading}
        mutate={subTaskDeleteMutate}
      />
    </>
  );
}

export default SubTaskInfoSidebar;
