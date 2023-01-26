import Checkbox from "@material-ui/core/Checkbox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import { memo, useEffect, useMemo, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
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

    useEffect(() => {
      if (isSelected?.length) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, [isSelected]);

    useEffect(() => {
      if (isDragging) setIsOpen(isDragging);
    }, [isDragging]);
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
              className={`moduleContainer ${
                isOpen || isDragging ? "moduleContainerClose" : ""
              }`}
              style={
                {
                  // height : isDragging ? 60 : "auto",
                  // // marginBottom : isDragging && 40
                  // background:"red",
                }
              }
            >
              <div>
                <div
                  className="tableRowModule"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    data?.disabled ??
                      (isSelected?.length
                        ? console.debug("disabled")
                        : setIsOpen(!isOpen));
                  }}
                  {...provided.dragHandleProps}
                  style={{
                    background: data?.disabled ? "rgba(255,255,255,0.1)" : "",
                    opacity: data?.disabled ? 0.6 : 1,
                    gridTemplateColumns: isPlatformShow
                      ? `4fr 1fr 1fr 1fr 1fr`
                      : `4fr 1fr 1fr 1fr`,
                  }}
                >
                  {/* Title */}
                  <div className="alignCenter borderRight">
                    <div className="d_flex">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          disabled || (data?.disabled ?? false)
                            ? console.debug("disabled")
                            : onSelectModule();
                        }}
                        className={`${
                          disabled
                            ? "sideLineContainerNoHover"
                            : "sideLineContainer"
                        } ${
                          isSelected.length ? "sideLineContainer_noHover" : ""
                        }`}
                      >
                        <div
                          className={`${
                            disabled ? "sideLineNoHover" : "sideLine"
                          }
                       ${isSelected.length ? `sideLineSelected` : ""}
                      `}
                        >
                          <Checkbox
                            size="small"
                            checked={isSelected.includes(data?._id)}
                            // onClick={() => multiSelection(row?._id, milestoneId)}
                            disabled={
                              disabled ||
                              (data?._id === "unCategorized"
                                ? true
                                : data?.disabled
                                ? true
                                : false)
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={`alignCenter arrowContainer ${
                          isOpen ? "arrowContainer_90degree" : ""
                        }`}
                      >
                        <ArrowRightIcon />
                      </div>
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
                      }}
                      objectKey="module"
                      className="textEllipse mr-2"
                      containerStyle={{
                        width: 0,
                      }}
                      textClassName={"textEllipse"}
                    />
                    {/* <div style={{ width: 25, height: 20 }}>
                    <CustomCircularProgressBar />
                  </div>
                  <LightTooltip title="Menu" arrow>
                    <div
                      style={{ width: 25, height: 20, margin: "0 10px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <PendingOutlinedIcon />
                    </div>
                  </LightTooltip> */}
                  </div>
                  {/* Assignee */}
                  <div className="alignCenter borderRight justifyContent_center">
                    Assignees
                  </div>
                  {/* Due Date */}
                  <div className="alignCenter borderRight justifyContent_center">
                    Due Date
                  </div>
                  {/* Due Date */}
                  <div className="alignCenter borderRight justifyContent_center">
                    Task Status
                  </div>

                  {/* Due Date */}
                  {isPlatformShow && (
                    <div className="alignCenter borderRight justifyContent_center">
                      Platform
                    </div>
                  )}
                </div>
              </div>
              {/* {(!isOpen && !data?.disabled && !disabled) && (data?._id !== "unCategorized" && (
              <AddTaskRow
                moduleInfo={data}
                orgId={orgId}
                projectId={projectId}
                milestoneId={milestoneId}
                disabled={disabled}
              />
            ))} */}
              {!isOpen && (
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
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);

export default MilestoneModule;
