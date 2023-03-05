import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import { useProjectTeam } from "hooks/useUserType";
import React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useModuleDelete } from "react-query/milestones/module/useModuleDelete";
import { useDeleteTask } from "react-query/milestones/task/useDeleteTask";
import { useProjectInfo } from "react-query/projects/useProjectInfo";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import MilestoneKanbanView from "./milestone/view/kanban-view/MilestoneKanbanView";
import MilestoneCardView from "./milestone/view/table-view/milestone-card-view/MilestoneCardView";
import MilestoneModuleTable from "./milestone/view/table-view/module-table-view/MilestoneModuleTable";

const Milestone = ({ viewType, filter, clearFilter }) => {
  const { actionDisabled } = useProjectTeam();
  const [showMilestone, setShowMilestone] = useState(true);
  const [milestoneId, setMilestoneId] = useState(undefined);
  const [projectId, setProjectId] = useState(undefined);
  const { location } = useHistory();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const dispatch = useDispatch();
  const isSelected = useSelector((state) => state.userReducer?.isTaskSelected);
  const isModuleSelected = useSelector(
    (state) => state.userReducer?.isModuleSelected
  );
  const isSubTaskSelected = useSelector(
    (state) => state.userReducer?.isSubTaskSelected
  );
  const selectedTask = useMemo(() => {
    if (isModuleSelected?.length) {
      return isModuleSelected;
    }
    return isSelected;
  }, [isSelected, isModuleSelected]);

  useEffect(() => {
    onCloseBottomBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCloseBottomBar = useCallback(() => {
    dispatch({
      type: "TASK_SELECT",
      payload: [],
    });
    dispatch({
      type: "MODULE_SELECT",
      payload: [],
    });
    dispatch({
      type: "SUB_TASK_SELECT",
      payload: {},
    });
  }, []);

  useEffect(() => {
    setProjectId(location?.pathname.split("/")[3]);
    if (location?.pathname.split("/")?.length === 5) {
      setShowMilestone(location?.pathname.split("/")[4] !== "" ? false : true);
      setMilestoneId(location?.pathname.split("/")[4]);
      clearFilter();
    } else {
      setShowMilestone(true);
    }
  }, [location?.pathname]);

  // Modules Delete

  const { moduleDeleteMutate } = useModuleDelete();
  const mutateData = useMemo(() => {
    if (isModuleSelected?.length) {
      let moduleMutateData = {
        data: {
          modules: isModuleSelected,
        },
        projectId,
        orgId,
        milestoneId,
        onToggle: onCloseBottomBar,
      };
      return moduleMutateData;
    }

    let taskMutateData = {
      data: {
        tasks: isSelected,
      },
      projectId,
      orgId,
      milestoneId,
      onToggle: onCloseBottomBar,
    };
    if (Object?.keys(isSubTaskSelected ?? {})?.length) {
      let tasksIds = [];
      for (const property in isSubTaskSelected) {
        tasksIds = [...tasksIds, ...isSubTaskSelected?.[property]];
      }
      taskMutateData = {
        ...taskMutateData,
        data: {
          tasks: tasksIds,
        },
      };
    } else {
      taskMutateData = {
        ...taskMutateData,
        data: {
          tasks: isSelected,
        },
      };
    }

    return taskMutateData;
  }, [
    isSelected,
    isModuleSelected,
    projectId,
    orgId,
    milestoneId,
    isSubTaskSelected,
  ]);
  // Tasks Delete
  const { deleteTaskMutate, isLoading: deleteTaskLoading } = useDeleteTask();
  // const [timer, setTimer] = useState(0)
  // React.useEffect(() => {
  // setInterval(() => {

  //   setTimer(new Date())
  // }, 1000);
  // }, [])
  return (
    <>
      {showMilestone &&
        (viewType === "kanban" ? (
          <MilestoneKanbanView
            viewType={viewType}
            projectId={projectId}
            milestoneId={milestoneId}
            filter={filter}
            orgId={orgId}
          />
        ) : (
          <MilestoneCardView disabled={actionDisabled} filter={filter} />
        ))}

      {!showMilestone && (
        <MilestoneModuleTable
          viewType={viewType}
          projectId={projectId}
          milestoneId={milestoneId}
          orgId={orgId}
          filter={filter}
        />
      )}
      <BottomActionBar
        onClose={onCloseBottomBar}
        isSelected={selectedTask}
        isOpen={
          isSubTaskSelected && Object.keys(isSubTaskSelected).length
            ? true
            : !!selectedTask?.length
        }
        subTask={isSubTaskSelected}
        type={
          isSubTaskSelected && Object.keys(isSubTaskSelected).length
            ? "subTask"
            : isModuleSelected?.length
            ? "module"
            : "task"
        }
        onDelete
        // moveTo={!isModuleSelected?.length ? true : false}
        // moduleMoveTo={isModuleSelected?.length ? true : false}
        assignees={!!isSelected?.length ? true : false}
        data={mutateData}
        mutate={
          isModuleSelected?.length ? moduleDeleteMutate : deleteTaskMutate
        }
        isLoading={deleteTaskLoading}
      />
    </>
  );
};

// Put the things into the DOM!

export default Milestone;

// import React, { useState, memo, useCallback } from "react";
// import "css/Milestone.css";

// import { InputBase, TextField } from "@material-ui/core";
// import { useSelector } from "react-redux";
// import { useAddMilestone } from "react-query/milestones/useAddMilestone";
// import { useMilestones } from "react-query/milestones/useMilestones";
// import { errorToast, infoToast } from "utils/toast";
// import MilestoneTable from "./milestone/MilestoneTable";
// import TableSkeleton from "skeleton/table/TableSkeleton";
// import FlagIcon from "@material-ui/icons/Flag";
// import Divider from "@mui/material/Divider";
// import { styled } from "@mui/material/styles";
// // import Divider from '@mui/material/Divider';
// const stat = [
//   { name: "Active", color: "var(--skyBlue)" },
//   { name: "not started", color: "var(--lightOrange)" },
//   { name: "completed", color: "var(--chipGreen)" },
// ];

// const statusColor = (status) => {
//   switch (status) {
//     case "Active":
//       return "var(--skyBlue)";
//     case "Not Started":
//       return "var(--lightOrange)";
//     case "Completed":
//       return "var(--chipGreen)";
//     default:
//       return "#FFF";
//   }
// };

// const Root = styled("div")(({ theme }) => ({
//   width: "100%",
//   ...theme.typography.body2,
//   "& > :not(style) + :not(style)": {
//     marginTop: theme.spacing(2),
//   },
// }));

// function Milestone({
//   showAddMilestone,
//   projectId,
//   setShowAddMilestone,
//   platforms,
//   projectInfo,
//   isSelected,
//   multiSelection,
//   filter,
//   team,
//   disabled,
// }) {
//   const [editRowId, setEditRowId] = useState(null);
//   const orgId = useSelector(
//     (state) => state.userReducer?.selectedOrganisation?._id
//   );
//   const { mutate, isLoading: addMilestoneLoading } =
//     useAddMilestone(setShowAddMilestone);
//   const { isLoading, data } = useMilestones(orgId, projectId);

//   const handleRowEditing = useCallback(
//     (e, id) => {
//       e && e.stopPropagation();
//       id ? setEditRowId(id) : setEditRowId(null);
//     },
//     [editRowId]
//   );

//   const onSubmitMilestone = (milestoneName) => {
//     if (!milestoneName) {
//       infoToast("Please enter milestone name!");
//     } else {
//       let data = {
//         projectId: projectId,
//         orgId: orgId,
//         data: {
//           title: milestoneName,
//         },
//       };

//       mutate(data);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div>
//         <TableSkeleton count={4} />
//       </div>
//     );
//   }
//   // console.log("MileStone Render" )
//   const { milestoneIds, status } = filter;

//   const filterRender = (row, i) => {
//     return (
//       <div key={i}>
//         <div
//           className="dividerClass"
//           style={{ color: statusColor(row?.status) }}
//         >
//           <p className="text">{row?.status}</p>
//           <div style={{ flex: 1 }}>
//             <hr
//               style={{
//                 borderColor: statusColor(row?.status),
//               }}
//             />
//           </div>
//         </div>
//         {row?.milestones?.map(
//           (item, index) =>
//             filter.milestoneIds?.includes(item?._id) && (
//               <MilestoneTable
//                 key={item?._id}
//                 index={index}
//                 item={item}
//                 // showAddMilestone={showAddMilestone}
//                 // editRowId={editRowId}
//                 // handleRowEditing={handleRowEditing}
//                 orgId={orgId}
//                 projectId={projectId}
//                 platforms={platforms}
//                 projectInfo={projectInfo}
//                 isSelected={isSelected}
//                 multiSelection={multiSelection}
//                 milestoneId={item?._id}
//                 filter={filter}
//                 team={team}
//                 disabled={disabled}
//               />
//             )
//         )}
//       </div>
//     );
//   };
//   console.log({ data });
//   return (
//     <>
//       {showAddMilestone && (
//         <InputField
//           onSubmitMilestone={onSubmitMilestone}
//           milestones={data?.[3]?.milestonesData ?? []}
//         />
//       )}
//       {console.log({ data })}
//       {milestoneIds?.length
//         ? data?.map(
//             (row, i) =>
//               row?.milestones?.length > 0 &&
//               // (status?.length ? ((status.includes(row?.status) && filterRender(row , i))
//               // ) : ("")
//               filterRender(row, i)
//           )
//         : data?.map(
//             (row, i) =>
//               row?.milestones?.length > 0 && (
//                 <div key={i}>
//                   <div
//                     className="dividerClass"
//                     style={{ color: statusColor(row?.status) }}
//                   >
//                     <p className="text">{row?.status}</p>
//                     <div style={{ flex: 1 }}>
//                       <hr
//                         style={{
//                           borderColor: statusColor(row?.status),
//                         }}
//                       />
//                     </div>
//                   </div>
//                   {row?.milestones?.map((item, index) => (
//                     <>
//                       <MilestoneTable
//                         key={item?._id}
//                         index={index}
//                         item={item}
//                         // showAddMilestone={showAddMilestone}
//                         // editRowId={editRowId}
//                         // handleRowEditing={handleRowEditing}
//                         orgId={orgId}
//                         projectId={projectId}
//                         platforms={platforms}
//                         projectInfo={projectInfo}
//                         isSelected={isSelected}
//                         multiSelection={multiSelection}
//                         milestoneId={item?._id}
//                         filter={filter}
//                         team={team}
//                         disabled={disabled}
//                       />
//                     </>
//                   ))}
//                 </div>
//               )
//           )}
//     </>
//   );
// }

// export default memo(Milestone);

// const InputField = ({ onSubmitMilestone, milestones }) => {
//   const [milestoneName, setMilestoneName] = useState("");
//   const [error, setError] = useState("");
// console.log({milestones})
//   return (
//     <div
//       style={{
//         marginBottom: "16px",
//         display: "flex",
//         alignItems: "center",
//         backgroundColor: "var(--milestoneRowColor)",
//       }}
//     >
//       <FlagIcon style={{ margin: 10 }} />
//       <InputBase
//         id="standard-basic"
//         style={{ flex: 1 }}
//         label="Milestone Name"
//         placeholder="Milestone Name"
//         onChange={(e) => setMilestoneName(e.target.value)}
//         onKeyPress={(e) => {
//           if (e.key === "Enter") {
//             if (
//               milestones?.filter(
//                 (item) =>
//                   item?.title.toLowerCase() === e.target.value.toLowerCase()
//               ).length === 0
//             ) {
//               onSubmitMilestone(milestoneName);
//               e.target.value = "";
//               setMilestoneName("");
//             } else {
//               errorToast("Milestone name already exists!");
//             }
//           }
//         }}
//         autoFocus
//       />
//     </div>
//   );
// };
