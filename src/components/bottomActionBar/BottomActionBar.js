import React, { memo } from "react";
import "./BottomActionBar.css";
import { IconButton } from "@material-ui/core";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Fade from "react-reveal/Fade";
import { LightTooltip } from "components/tooltip/LightTooltip";
import CommonDelete from "components/CommonDelete";
import MoveToAction from "./moveTo/MoveToAction";
import ModuleMoveTo from "./moveTo/ModuleMoveTo";
import AssigneesUpdate from "./taskUpdate/AssigneesUpdate";
import CopyToAction from "./copyTo/CopyToAction";

const getSubtaskCount = (subTask) => {
  let total = 0;
  for (const property in subTask) {
    total += subTask[property]?.length || 0;
  }

  return total;
};

function BottomActionBar({
  moduleMoveTo,
  isSelected,
  onClose,
  onDelete,
  markAsComplete,
  markAsIncomplete,
  isLoading,
  data,
  mutate,
  moveTo,
  assignees,
  isOpen,
  type,
  subTask,
}) {
  return (
    <Fade bottom when={isOpen} duration={300}>
      {isOpen && (
        <div className={`bottomActionBarContainer`}>
          <div className={`selectedCount mr-1`}>
            <p className="headerFont">
              {type === "subTask"
                ? getSubtaskCount(subTask)
                : isSelected?.length}
            </p>
          </div>
          <div style={{ flex: 0.5 }}>
            <div
              className="pl-2 alignCenter flexWrap"
              style={{
                position: "absolute",
                width: "50%",
                top: "50%",
                transform: "translateY(-10%)",
              }}
            >
              {type === "subTask"
                ? new Array(getSubtaskCount(subTask))
                    .fill("")
                    .map(
                      (_, index) =>
                        index < 70 && (
                          <div key={index} className="selectedCircle" />
                        )
                    )
                : isSelected?.map(
                    (_, index) =>
                      index < 70 && (
                        <div key={index} className="selectedCircle" />
                      )
                  )}
            </div>
          </div>
          <div
            style={{ flex: 0.5, justifyContent: "flex-end" }}
            className="alignCenter flexWrap"
          >
            {assignees && <AssigneesUpdate />}
            {type === "module" && <ModuleMoveTo />}

            {type === "task" && <MoveToAction />}
            {type === "task" && <CopyToAction />}

            {onDelete && (
              <CommonDelete
                // onDelete={onDelete}
                isLoading={isLoading}
                data={{
                  ...data,
                  type,
                  subTask,
                }}
                mutate={mutate}
                className={"actionButton mx-1"}
                svgIcon
              />
            )}
            {onClose && (
              <LightTooltip title="Close" arrow>
                <div
                  onClick={onClose}
                  className="closeIcon_bottomActionBar mr-1"
                >
                  <CloseRoundedIcon style={{ fontSize: 30 }} />
                </div>
              </LightTooltip>
            )}
          </div>
          {/* <div
          style={{
            // width: "60%",
            padding: "6px 0px 0px 30px",
          }}
        >
          <div className="flex d_flex flexWrap inheritParent alignCenter ">
            {isSelected?.map((item, index) => (
              <div key={index} className="selectedCircle" />
            ))}
          </div>
        </div> */}
          {/* <div
          style={{
            // width: "40%",
            // padding: '6px 0px 0px 30px'
            display: "flex",
            alignItems: "center",
          }}
        >
          {assignees && <AssigneesUpdate />}

          {moduleMoveTo && <ModuleMoveTo />}

          {moveTo && <MoveToAction />}

          {markAsIncomplete && (
            <LightTooltip title="Mark as In-Complete">
              <IconButton
                style={{
                  color: "#FFF",
                }}
                onClick={markAsIncomplete}
              >
                <CloseRoundedIcon />
              </IconButton>
            </LightTooltip>
          )}

          {onDelete && (
            <CommonDelete
              // onDelete={onDelete}
              isLoading={isLoading}
              data={data}
              mutate={mutate}
            />
          )}

          {onClose && (
            <div
              onClick={onClose}
              // className={`selectedCount closeHover`}
              className="closeIcon_bottomActionBar"
            >
              <LightTooltip title="Close">
                <HighlightOffRoundedIcon />
              </LightTooltip>
            </div>
          )}
        </div> */}
        </div>
      )}
      {/* {
                isSelected?.length > 0 && <div className={`bottomActionBarContainer boxShadow`}>
                    <div className={`selectedCount mr-1`}>
                        <p className="headerFont">{isSelected.length}</p>
                    </div> 
                    <div className="flex d_flex flexWrap inheritParent alignCenter ">
                        {
                            isSelected?.map((item, index) => (
                                <div key={index} className="selectedCircle" />
                            ))
                        }
                    </div>
                    {
                        markAsComplete && <LightTooltip title="Mark as Complete">
                            <IconButton style={{
                                color: "#FFF"
                            }}
                                onClick={markAsComplete}
                            >
                                <CheckRoundedIcon />
                            </IconButton>
                        </LightTooltip>
                    }
                    {
                        assignees && <AssigneesUpdate />
                    }

                    {
                        moduleMoveTo && <ModuleMoveTo />
                    }

                    {
                        moveTo && <MoveToAction />
                    }

                    {
                        markAsIncomplete && <LightTooltip title="Mark as In-Complete">
                            <IconButton style={{
                                color: "#FFF"
                            }}
                                onClick={markAsIncomplete}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </LightTooltip>
                    }

                    {
                        onDelete && <CommonDelete 
                        // onDelete={onDelete}
                        isLoading={isLoading}
                        data={data}
                        mutate={mutate}
                        />
                   
                    }

                    {
                        onClose && <div onClick={onClose} className={`selectedCount closeHover`}>
                            <LightTooltip title="Close">
                                <HighlightOffRoundedIcon  />
                            </LightTooltip>
                        </div>
                    }

                </div>
            } */}
    </Fade>
  );
}

export default memo(BottomActionBar);
