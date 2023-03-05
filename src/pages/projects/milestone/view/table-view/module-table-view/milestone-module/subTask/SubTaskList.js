import { useSubTask } from "react-query/milestones/subtask/useSubTask";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import AddTaskRow from "../AddTaskRow";
import TaskRowItem from "../TaskRowItem";

function SubTaskList({
  orgId,
  projectId,
  milestoneId,
  taskId,
  teamList,
  actionDisabled,
  platforms,
  isTaskLastIndex,
  moduleId,
}) {
  const { data, isLoading } = useSubTask({
    milestoneId,
    orgId,
    taskId,
  });

  return (
    <div className={`${actionDisabled && !isTaskLastIndex ? "pb-5" : ""}`}>
      <div
        className="abc"
        // style={{ marginBottom: index === 4 ? 30 : 0 }}
      >
        <div
          className={`tableRowModuleHeader tableRowModuleHeader_topWidth ${
            // !!!platforms?.length && "tableRowModuleHeader_withoutPlatform"
            ""
          } ${actionDisabled && "tableRowModuleHeader_withoutCheckBox"}`}
        >
          <div className="row_starter"></div>
          {!actionDisabled && <div className="border_divider"></div>}
          <div className="border_divider">SubTask</div>
          <div className="border_divider">Assignee(s)</div>
          <div className="border_divider">Due Date</div>
          <div className="border_divider">Status</div>

          {!!platforms?.length ? (
            <div className="border_divider">Platform(s)</div>
          ) : (
            <div className="border_divider">Created By</div>
          )}
        </div>
      </div>
      {/* {!isLoading && (
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
      )} */}

      {isLoading ? (
        <div className="mt-3 ml-2 pb-2">
          <TableRowSkeleton count={5} />
        </div>
      ) : (
        data?.tasks?.map((taskInfo, index) => (
          <TaskRowItem
            taskInfo={taskInfo}
            key={taskInfo._id}
            disabledSubTask={true}
            parentId={taskInfo?.parent}
            isLastIndex={data?.tasks?.length - 1 === index}
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
      {!isLoading && !actionDisabled && (
        <AddTaskRow
          orgId={orgId}
          projectId={projectId}
          milestoneId={milestoneId}
          taskId={taskId}
          isTaskLastIndex={isTaskLastIndex}
          moduleId={moduleId}
          //   disabled={disabled}
        />
      )}
    </div>
  );
}

export default SubTaskList;
