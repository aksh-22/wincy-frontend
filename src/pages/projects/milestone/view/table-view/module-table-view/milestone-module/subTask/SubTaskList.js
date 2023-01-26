import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React from "react";
import AddTaskRow from "../AddTaskRow";
import Icon from "components/icons/IosIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { useSubTask } from "react-query/milestones/subtask/useSubTask";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import DueDateProgress from "pages/projects/milestone/dueDateProgress/DueDateProgress";
import TaskStatus from "../taskStatus/TaskStatus";
import CustomMenu from "components/CustomMenu";
import { useProjectTeam } from "hooks/useUserType";
import { useState } from "react";
import TaskRowItem from "../TaskRowItem";

function SubTaskList({
  orgId,
  projectId,
  milestoneId,
  taskId,
  teamList,
  actionDisabled,
  platforms,
}) {
  const { data, isLoading } = useSubTask({
    milestoneId,
    orgId,
    taskId,
  });

  return (
    <div className="ml-1 mb-2">
      {!isLoading && (
        <AddTaskRow
          style={{
            gridTemplateColumns: "3.9fr 1fr 1fr 1fr 1fr",
          }}
          //   moduleInfo={moduleInfo}
          orgId={orgId}
          projectId={projectId}
          milestoneId={milestoneId}
          taskId={taskId}
          //   disabled={disabled}
        />
      )}

      {isLoading ? (
        <TableRowSkeleton count={5} />
      ) : (
        data?.tasks?.map((taskInfo) => (
          <TaskRowItem
            taskInfo={taskInfo}
            key={taskInfo._id}
            disabledSubTask={true}
            parentId={taskInfo?.parent}
          />
          // <div
          //   key={taskInfo?._id + ""}

          //   className="tableRowModule"
          //      style={{
          //        background: taskInfo?.disabled ? "rgba(255,255,255,0.1)" : "",
          //        opacity: taskInfo?.disabled ? 0.6 : 1,
          //        cursor:
          //          taskInfo?.disabled || actionDisabled ? "default" : "pointer",
          //     gridTemplateColumns: "3.9fr 1fr 1fr 1fr 1fr",

          //      }}
          // >
          //   <div className="d_flex ">
          //     <div className="firstEmptyCell" />
          //     <div
          //       className={`${
          //         // (!actionDisabled || taskInfo?.disabled ? true : false)
          //         true ? "sideLine" : "sideLineNoHover"
          //       } ${[].length ? `sideLineSelected` : ""}`}
          //       //   onClick={() =>
          //       //     (!actionDisabled || taskInfo?.disabled ? true : false) &&
          //       //     onSelectTask(taskInfo?._id)
          //       //   }
          //     >
          //       <Checkbox
          //         size="small"
          //         // checked={isSelected.includes(taskInfo?._id)}
          //         // onClick={() => multiSelection(row?._id, milestoneId)}
          //         // disabled={actionDisabled || taskInfo?.disabled ? true : false}
          //       />
          //     </div>
          //     <div className="rowContainer flex borderRight">
          //       <div className="d_flex flex">
          //         <InputTextClickAway
          //           value={taskInfo?.title}
          //           type="text"
          //           //   onChange={onTitleUpdate}
          //           //   disabled={actionDisabled || taskInfo?.disabled ? true : false}
          //           className="textEllipse mr-2"
          //           containerStyle={{
          //             width: 0,
          //           }}
          //           textClassName={"textEllipse"}
          //         />
          //       </div>
          //       <div
          //         // style={{ width: 50 }}
          //         className="alignCenter justifyContent_center cursorPointer"
          //         // onClick={sideBarToggle}
          //       >
          //         {taskInfo?.description && (
          //           <LightTooltip title="Description" arrow>
          //             <div className="alignCenter justifyContent_center cursorPointer mr-1">
          //               <Icon name="menu" />
          //             </div>
          //           </LightTooltip>
          //         )}
          //         {taskInfo?.bugCount?.totalOpen > 0 && (
          //           <LightTooltip title="Bugs Open" arrow>
          //             <div
          //               style={{
          //                 marginRight: 10,
          //                 fontSize: 13,
          //                 fontFamily: "Lato-Bold",
          //               }}
          //             >
          //               <span style={{ fontSize: 19 }}>
          //                 {taskInfo?.bugCount?.totalOpen}
          //               </span>
          //               <span>/</span>
          //               <span style={{ fontFamily: "Lato-Italic" }}>
          //                 {taskInfo?.bugCount?.total}
          //               </span>{" "}
          //             </div>
          //           </LightTooltip>
          //         )}

          //         <LightTooltip title="Task Info" arrow>
          //           <div className="alignCenter justifyContent_center cursorPointer mr-1">
          //             <Icon name="info" />
          //           </div>
          //         </LightTooltip>
          //       </div>
          //     </div>
          //   </div>

          //   {/* Assignee */}

          //   <div className="alignCenter justifyContent_center borderRight">
          //     <AssigneeSelection
          //       assignee={taskInfo?.assignees}
          //       multiple
          //       team={teamList}
          //       // onChange={onAssigneeUpdate}
          //       disabled={actionDisabled}
          //       contentCenter
          //       taskInfo={taskInfo}
          //     />
          //   </div>

          //   {/* Due Date */}
          //   <div className="alignCenter justifyContent_center borderRight">
          //     <DueDateProgress
          //       // onChange={onDueDateUpdate}
          //       dueDate={taskInfo?.dueDate}
          //       status={taskInfo?.status}
          //       disabled={actionDisabled}
          //       removeButton
          //     />
          //   </div>

          //   {/* Status */}
          //   <TaskStatus
          //     info={taskInfo}
          //     className="borderRight"
          //     orgId={orgId}
          //     disabled={
          //       !actionDisabled
          //         ? false
          //         : individualStatusUpdatePermission
          //         ? false
          //         : ["InProgress", "Active", "NotStarted"].includes(
          //             taskInfo?.status
          //           )
          //     }
          //     // taskStatusPermission={actionDisabled}
          //     // individualStatusUpdatePermission={
          //     //   individualStatusUpdatePermission
          //     // }
          //   />
          //   {/* Platform */}
          //   <CustomMenu
          //     activeMenuItem={taskInfo?.platforms}
          //     disabled={actionDisabled}
          //     className="borderRight"
          //     // menuItems={platformsList}
          //     // handleMenuClick={onPlatformUpdate}
          //     multiple
          //   />
          // </div>
        ))
      )}
    </div>
  );
}

export default SubTaskList;
