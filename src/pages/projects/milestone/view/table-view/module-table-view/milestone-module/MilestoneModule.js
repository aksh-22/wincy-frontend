import Checkbox from "@material-ui/core/Checkbox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import { memo, useEffect, useMemo, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useQueryClient } from "react-query";
import { useMilestoneModuleUpdate } from "react-query/milestones/module/useMilestoneModuleUpdate";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/textTruncate";
import "./MilestoneModule.scss";
import ModuleTaskRow from "./ModuleTaskRow";
const MilestoneModule = memo(
  ({
    title,
    index,
    data,
    orgId,
    projectId,
    milestoneId,
    disabled,
    filterDraggableDisable,
    isDragging,
    isTaskDragging,
    isPlatformShow,
  }) => {
    const { mutate } = useMilestoneModuleUpdate();
    const [isOpen, setIsOpen] = useState(data?.disabled ?? false);
    const extraData = useMemo(
      () => ({
        milestoneId: data?.milestone,
        projectId: data?.project,
        moduleId: data?._id,
        orgId: orgId,
        data: {
          module: "",
        },
      }),
      [data, orgId]
    );
    const isSelected = useSelector(
      (state) => state.userReducer?.isModuleSelected
    );

    const isTaskSelected = useSelector(
      (state) => state.userReducer?.isTaskSelected
    );
    const dispatch = useDispatch();
    const onSelectModule = () => {
      const moduleId = data?._id;
      const isExist = isSelected.includes(moduleId);
      let tempSelected = [...isSelected];
      if (isExist) {
        // remove
        tempSelected = tempSelected.filter((item) => item !== moduleId);
      } else {
        tempSelected.push(moduleId);
      }
      dispatch({
        type: "MODULE_SELECT",
        payload: [...tempSelected],
      });

      if (isTaskSelected?.length) {
        dispatch({
          type: "TASK_SELECT",
          payload: [],
        });
      }
    };

    // useEffect(() => {
    //   if (isSelected?.length) {
    //     setIsOpen(true);
    //   } else {
    //     setIsOpen(false);
    //   }
    // }, [isSelected]);

    useEffect(() => {
      if (isDragging) setIsOpen(isDragging);
    }, [isDragging]);
    const isSubTaskSelected = useSelector(
      (state) => state.userReducer?.isSubTaskSelected
    );

    const queryClient = useQueryClient();
    const onSelectAllTask = () => {
      const tasks = queryClient.getQueryData(["tasks", orgId, milestoneId]);
      let temp = tasks?.find((item) => item?._id?.includes(data?._id));
      let tempIds = [];
      if (
        temp?.tasks?.filter((item) => isTaskSelected?.includes(item?._id))
          ?.length === temp?.tasks?.length
      ) {
        tempIds = temp?.tasks?.map((item) => item?._id);
        dispatch({
          type: "TASK_SELECT",
          payload: isTaskSelected.filter(
            (item, index) => tempIds?.indexOf(item) !== index
          ),
        });
        setIsTaskSelectedAll(false);
      } else if (temp?.tasks?.length) {
        tempIds = temp?.tasks?.map((item) => item?._id);

        tempIds = [...tempIds, ...(isTaskSelected ?? [])];
        dispatch({
          type: "TASK_SELECT",
          payload: tempIds.filter(
            (item, index) => tempIds.indexOf(item) === index
          ),
        });
        setIsTaskSelectedAll(true);
      }
    };

    const [isTaskSelectedAll, setIsTaskSelectedAll] = useState(false);

    useEffect(() => {
      const tasks = queryClient.getQueryData(["tasks", orgId, milestoneId]);
      let temp = tasks?.find((item) => item?._id?.includes(data?._id));
      if (
        tasks &&
        temp?.tasks?.filter((item) => isTaskSelected?.includes(item?._id))
          ?.length === temp?.tasks?.length
      ) {
        setIsTaskSelectedAll(true);
      } else {
        setIsTaskSelectedAll(false);
      }
    }, [isTaskSelected]);

    return (
      <Draggable
        draggableId={data?._id}
        index={index}
        key={data?._id}
        isDragDisabled={
          filterDraggableDisable ?? (disabled || data?._id === "unCategorized")
        }
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div
              className={`moduleContainer  ${
                isOpen || isDragging ? "moduleContainerClose" : ""
              }`}
              style={
                {
                  // marginBottom: isOpen ? 10 : 100,
                  // height : isDragging ? 60 : "auto",
                  // // marginBottom : isDragging && 40
                  // background:"red",
                }
              }
            >
              <div
                {...provided.dragHandleProps}
                className="d_flex tableRowModuleNew module_table_row mb-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  data?.disabled ??
                    (isSelected?.length
                      ? console.debug("disabled")
                      : setIsOpen(!isOpen));
                }}
                style={{
                  opacity: data?.disabled ? 0.5 : 1,
                }}
              >
                <div
                  className={
                    isSelected?.length ||
                    (data?._id === "unCategorized"
                      ? true
                      : disabled || (data?.disabled ?? false))
                      ? "check_box_display"
                      : "check_box_show"
                  }
                >
                  <Checkbox
                    size="small"
                    checked={isSelected.includes(data?._id)}
                    // onClick={() => multiSelection(row?._id, milestoneId)}
                    disabled={
                      disabled ||
                      (data?._id === "unCategorized"
                        ? true
                        : data?.disabled ||
                          Object.keys(isSubTaskSelected).length
                        ? true
                        : false)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      disabled || (data?.disabled ?? false)
                        ? console.debug("disabled")
                        : onSelectModule();
                    }}
                  />
                </div>
                <div
                  className={`alignCenter arrowContainer ${
                    isOpen ? "arrowContainer_90degree" : ""
                  }`}
                >
                  <ArrowRightIcon fontSize="large" />
                </div>
                <InputTextClickAway
                  disabled={
                    data?._id === "unCategorized"
                      ? true
                      : disabled || (data?.disabled ?? false)
                  }
                  value={capitalizeFirstLetter(title)}
                  onChange={mutate}
                  extraData={extraData}
                  height={36}
                  style={{
                    marginRight: 10,
                    flex: 1,
                  }}
                  objectKey="module"
                  className="textEllipse mr-2"
                  containerStyle={
                    {
                      // width: 0,
                    }
                  }
                  textStyle={{
                    fontSize: 28,
                    // marginBottom: 10,
                  }}
                  textClassName={"textEllipse pl-0"}
                />
              </div>
              {
                //   <div>
                //   <div
                //     className="tableRowModule"
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   data?.disabled ??
                //     (isSelected?.length
                //       ? console.debug("disabled")
                //       : setIsOpen(!isOpen));
                // }}
                //     {...provided.dragHandleProps}
                // style={{
                //   background: data?.disabled ? "rgba(255,255,255,0.1)" : "",
                //   opacity: data?.disabled ? 0.6 : 1,
                //   gridTemplateColumns: isPlatformShow
                //     ? `4fr 1fr 1fr 1fr 1fr`
                //     : `4fr 1fr 1fr 1fr`,
                // }}
                //   >
                //     {/* Title */}
                //     <div className="alignCenter borderRight">
                //       <div className="d_flex">
                //         <div
                // onClick={(e) => {
                //   e.stopPropagation();
                //   disabled || (data?.disabled ?? false)
                //     ? console.debug("disabled")
                //     : onSelectModule();
                // }}
                //           className={`${
                //             disabled
                //               ? "sideLineContainerNoHover"
                //               : "sideLineContainer"
                //           } ${
                //             isSelected.length ? "sideLineContainer_noHover" : ""
                //           }`}
                //         >
                //           <div
                //             className={`${
                //               disabled ? "sideLineNoHover" : "sideLine"
                //             }
                //          ${isSelected.length ? `sideLineSelected` : ""}
                //         `}
                //           >
                // <Checkbox
                //   size="small"
                //   checked={isSelected.includes(data?._id)}
                // // onClick={() => multiSelection(row?._id, milestoneId)}
                // disabled={
                //   disabled ||
                //   (data?._id === "unCategorized"
                //     ? true
                //     : data?.disabled
                //     ? true
                //     : false)
                // }
                // />
                //           </div>
                //         </div>
                // <div
                //   className={`alignCenter arrowContainer ${
                //     isOpen ? "arrowContainer_90degree" : ""
                //   }`}
                // >
                //   <ArrowRightIcon />
                // </div>
                //       </div>
                // <InputTextClickAway
                //   disabled={
                //     data?._id === "unCategorized"
                //       ? true
                //       : disabled || (data?.disabled ?? false)
                //   }
                //   value={capitalizeFirstLetter(title)}
                //   onChange={mutate}
                //   extraData={extraData}
                //   height={36}
                //   style={{
                //     marginRight: 10,
                //   }}
                //   objectKey="module"
                //   className="textEllipse mr-2"
                //   containerStyle={{
                //     width: 0,
                //   }}
                //   textClassName={"textEllipse"}
                // />
                //       {/* <div style={{ width: 25, height: 20 }}>
                //       <CustomCircularProgressBar />
                //     </div>
                //     <LightTooltip title="Menu" arrow>
                //       <div
                //         style={{ width: 25, height: 20, margin: "0 10px" }}
                //         onClick={(e) => {
                //           e.stopPropagation();
                //         }}
                //       >
                //         <PendingOutlinedIcon />
                //       </div>
                //     </LightTooltip> */}
                //     </div>
                //     {/* Assignee */}
                //     <div className="alignCenter borderRight justifyContent_center">
                //       Assignees
                //     </div>
                //     {/* Due Date */}
                //     <div className="alignCenter borderRight justifyContent_center">
                //       Due Date
                //     </div>
                //     {/* Due Date */}
                //     <div className="alignCenter borderRight justifyContent_center">
                //       Task Status
                //     </div>
                //     {/* Due Date */}
                //     {isPlatformShow && (
                //       <div className="alignCenter borderRight justifyContent_center">
                //         Platform
                //       </div>
                //     )}
                //   </div>
                // </div>
              }
              {/* {(!isOpen && !data?.disabled && !disabled) && (data?._id !== "unCategorized" && (
              <AddTaskRow
                moduleInfo={data}
                orgId={orgId}
                projectId={projectId}
                milestoneId={milestoneId}
                disabled={disabled}
              />
            ))} */}

              {!isOpen && !isSelected?.length && (
                <div className="treeview">
                  <ul>
                    <li>
                      <div>
                        <div
                          className={`tableRowModuleHeader  tableRowModuleHeader_topWidth ${
                            // !isPlatformShow &&
                            // "tableRowModuleHeader_withoutPlatform"
                            ""
                          } ${
                            disabled && "tableRowModuleHeader_withoutCheckBox"
                          }`}
                          style={{
                            background: data?.disabled
                              ? "rgba(255,255,255,0.1)"
                              : "",
                            opacity: data?.disabled ? 0.6 : 1,
                          }}
                        >
                          <div className="row_starter"></div>
                          {!disabled && (
                            <div
                              // onClick={() => multiSelection(row?._id, milestoneId)}

                              className="border_divider"
                            >
                              <Checkbox
                                size="small"
                                checked={isTaskSelectedAll}
                                // onClick={() => multiSelection(row?._id, milestoneId)}
                                disabled={
                                  disabled ||
                                  (data?._id === "unCategorized"
                                    ? true
                                    : data?.disabled ||
                                      Object.keys(isSubTaskSelected).length
                                    ? true
                                    : false)
                                }
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   disabled || (data?.disabled ?? false)
                                //     ? console.debug("disabled")
                                //     : onSelectModule();
                                // }}
                                onClick={onSelectAllTask}
                              />
                            </div>
                          )}
                          <div className="border_divider">Task</div>
                          <div className="border_divider">Assignee(s)</div>
                          <div className="border_divider">Due Date</div>
                          <div className="border_divider">Status</div>
                          {isPlatformShow ? (
                            <div className="border_divider">Platform(s)</div>
                          ) : (
                            <div className="border_divider">Created By</div>
                          )}
                        </div>
                      </div>
                    </li>

                    {!isOpen && !data?.disabled && (
                      <ModuleTaskRow
                        listId={data?._id}
                        listType="taskMove"
                        moduleInfo={data}
                        orgId={orgId}
                        projectId={projectId}
                        milestoneId={milestoneId}
                        disabled={disabled}
                        isTaskDragging={isTaskDragging}
                      />
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);

export default MilestoneModule;
