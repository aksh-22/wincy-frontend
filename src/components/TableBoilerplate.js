import React, { useState } from "react";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import "css/Milestone.css";
import Checkbox from "@material-ui/core/Checkbox";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
function Untitled({ item }) {
  const heightCalculate = (length) => {
    if (tasksLoading) {
      return 2 * 40 + 100;
    }
    return (length ?? 0) * 40 + 100;
  };
  const [currentIndex, setCurrentIndex] = useState([]);
  const [collapsible, setCollapsible] = useState(false);
  const insertRow_id = (id) => {
    if (currentIndex.includes(id)) {
      setCollapsible(false);
      // setTimeout(() => {
      setCurrentIndex(currentIndex.filter((item) => item !== id));
      // }, 3);
    } else {
      setCollapsible(true);
      setCurrentMilestoneId(id);
      setCurrentIndex([...currentIndex, id]);
    }
  };
  return (
    <>
      <div
        key={item?._id}
        className="milestoneContainer mb-2"
        key={item?._id}
        style={{
          height: collapsible ? heightCalculate(2) : 40, // array length
        }}
      >
        {/* Header Div */}
        <div
          className="d_flex alignCenter milestone rowHeader"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            item?._id !== "localData" &&
              editRowId === null &&
              insertRow_id(item?._id);
          }}
          style={{
            position: "sticky",
            top: 68,
            opacity: item?._id === "localData" ? 0.3 : 1,
            backgroundColor: collapsible === true ? "#343760" : "transparent",
          }}
        >
          <div className={`arrowContainer`}>
            <PlayCircleFilledIcon
              className={`milestone_arrowContainer ${
                currentIndex.includes(item?._id)
                  ? "milestone_arrowContainer_90degree"
                  : ""
              }`}
            />
          </div>
          <div
            className="d_flex alignCenter px-2"
            style={{ flex: 1, height: "100%" }}
          >
            <div
              onClick={(e) => {
                if (item?._id !== "localData") {
                  handleRowEditing(e, item?._id);
                  setMilestoneName(item?.title);
                }
              }}
              className="milestoneTitleEllipse cursorText"
            >
              {/* {item?.title}  */} Title
            </div>
          </div>
          <div className="d_flex alignCenter justifyContent-end px-3">
            <InfoOutlinedIcon
              onClick={(event) => {
                if (item?._id !== "localData") {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }}
            />
          </div>
          <div className="milestone_cell">Status</div>
          <div className="milestone_cell">Priority</div>
          <div className="milestone_cell">Platform</div>
        </div>
        {/* Sub Header Div NEW Add */}
        <div
          className={`milestone_subContainer ml-2 normalFont ${
            collapsible ? "activeABC" : ""
          }`}
        >
          {currentIndex?.includes(item?._id) &&
            (loading ? (
              "Loading"
            ) : (
              <>
                {loading && <TableRowSkeleton count={2} height={30} />}
                {taskData?.tasks?.map((row, i) => (
                  <div
                    key={row?._id}
                    className="d_flex  subMilestone_row "
                    style={{ opacity: row?._id === "localData" ? 0.3 : 1 }}
                  >
                    <div className={`subMilestone_sideLine`}>
                      <Checkbox />
                    </div>
                    <div
                      className={`subMilestone_title alignCenter d_flex milestone_borderRight`}
                    >
                      {editTaskRowId === row?._id ? (
                        <ClickAwayListener
                          onClickAway={(e) => setEditTaskRowId(null)}
                        >
                          <input
                            type="text"
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: "100%" }}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              handleUpdateTaskName(row?._id)
                            }
                            defaultValue={row?.title}
                            autoFocus
                            onKeyUp={(e) => setEditTaskName(e.target.value)}
                            className=" px-2"
                          />
                        </ClickAwayListener>
                      ) : (
                        <p
                          onClick={() => {
                            row?._id !== "localData" &&
                              setEditTaskRowId(row?._id);
                          }}
                          className="cursorText  px-2"
                        >
                          {row?.title}
                        </p>
                      )}
                    </div>
                    <div className="d_flex alignCenter px-3 milestone_borderRight">
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 10,
                        }}
                      ></div>
                      <InfoOutlinedIcon
                        onClick={() =>
                          row?.id !== "localData" && setTaskInfo(i)
                        }
                      />
                    </div>
                    <div
                      className={`subMilestone_assignee milestone_cell milestone_borderRight`}
                    >
                      <CustomMenu
                        menuItems={[
                          { label: "Not Started", value: "NotStarted" },
                          { label: "Completed", value: "Completed" },
                          { label: "Active", value: "Active" },
                        ]}
                        id={row?._id}
                        handleMenuClick={
                          row?.id !== "localData" && handleStatus(row._id)
                        }
                        activeMenuItem={addSpaceUpperCase(row?.status)}
                      />
                    </div>
                    <div
                      className={`subMilestone_priority milestone_cell milestone_borderRight`}
                    >
                      <CustomMenu
                        menuItems={[
                          { label: "Low", value: "Low" },
                          { label: "Medium", value: "Medium" },
                          { label: "High", value: "High" },
                        ]}
                        id={row?._id}
                        handleMenuClick={
                          row?.id !== "localData" && handlePriority(row?._id)
                        }
                        activeMenuItem={row?.priority}
                      />
                    </div>
                    <div
                      style={{
                        // backgroundColor: 'green',
                        cursor: "pointer ",
                      }}
                      className={`subMilestone_platform milestone_cell`}
                    >
                      <CustomMenu
                        menuItems={platforms.map((row) => {
                          return {
                            label: row,
                            value: row,
                          };
                        })}
                        id={row?._id}
                        handleMenuClick={
                          row?.id !== "localData" && handlePlatform(row?._id)
                        }
                        activeMenuItem={row?.platform ?? "N.A"}
                      />
                    </div>
                  </div>
                ))}
              </>
            ))}
        </div>
      </div>
    </>
  );
}
export default Untitled - 1;
