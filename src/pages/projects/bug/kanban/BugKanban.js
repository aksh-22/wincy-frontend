import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useMilestones } from "react-query/milestones/useMilestones";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import ReactDOM from "react-dom";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { useSelector } from "react-redux";
import { useBugs } from "react-query/bugs/useBugs";
import { useProjectTeam } from "hooks/useUserType";
import AddModuleKanban from "pages/projects/milestone/view/kanban-view/module/addModule-kanban/AddModuleKanban";
import { getBackgroundColor } from "pages/projects/milestone/view/table-view/module-table-view/milestone-module/taskStatus/TaskStatus";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import { useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";
import Dialog from '@mui/material/Dialog';
import BugInfoDialogAction from "./bugInfo/BugInfoDialogAction";
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { LightTooltip } from "components/tooltip/LightTooltip";
import { bugStatusColor } from "utils/status";
import IosIcon from "components/icons/IosIcon";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
function BugKanban({ orgId, projectId, platforms }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useMilestones(orgId, projectId);
  const onDragEnd = ({ draggableId, source, destination }) => {
    console.log(
      "draggableId, source, destination ",
      draggableId,
      source,
      destination
    );
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    let sourceData = queryClient.getQueryData([
      "bugs",
      orgId,
      projectId,
      source?.droppableId,
      1,
    ]);
    let destinationData = queryClient.getQueryData([
      "bugs",
      orgId,
      projectId,
      destination?.droppableId,
      1,
    ]);
    // let sourceDataCopy = jsonParser(sourceData);
    const updatedData = reorderTasks({
      draggableId,
      source,
      destination,
      destinationData,
      sourceData,
    });

    if (source?.droppableId === destination?.droppableId) {
      queryClient.setQueryData(
        ["bugs", orgId, projectId, destination?.droppableId, 1],
        updatedData
      );
    } else {
      console.log("updatedData", updatedData);
      queryClient.setQueryData(
        ["bugs", orgId, projectId, source?.droppableId, 1],
        updatedData.sourceDataResult
      );
      queryClient.setQueryData(
        ["bugs", orgId, projectId, destination?.droppableId, 1],
        updatedData.destinationDataResult
      );
    }
  };

  const reorderTasks = ({
    destination,
    source,
    draggableId,
    destinationData,
    sourceData,
  }) => {
    // move in same list
    if (source?.droppableId === destination?.droppableId) {
      const result = Array.from(destinationData?.bugs ?? []);
      const [removed] = result.splice(source.index, 1);
      result.splice(destination.index, 0, removed);

      return {
        bugs: result,
        count: destinationData?.count,
      };
    }
    // Move in Different List
    const sourceDataResult = Array.from(sourceData?.bugs ?? []);
    const [removed] = sourceDataResult.splice(source.index, 1);
    const destinationDataResult = Array.from(destinationData?.bugs ?? []);
    destinationDataResult.splice(destination.index, 0, removed);
    return {
      destinationDataResult: {
        bugs: destinationDataResult,
        count: (destinationData?.count ?? 0) + 1,
      },
      sourceDataResult: {
        bugs: sourceDataResult,
        count: sourceData?.count - 1,
      },
    };
  };
  return isLoading ? (
    <div className="alignCenter">
      <TableRowSkeleton
        style={{
          height: "70vh",
          width: 320,
          margin: 5,
        }}
        count={4}
      />
    </div>
  ) : (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="d_flex"
        style={{
          maxWidth: "100vw",
          overflowX: "auto",
        }}
      >
        <Droppable
          droppableId="board"
          direction="horizontal"
          type="moduleMove"
          isDropDisabled={false}
        >
          {(provided) => (
            <div
              className="d_flex"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {platforms?.map((row, row_index) => (
                <PlatformsComponent
                  key={row_index}
                  item={row}
                  index={row_index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

export default BugKanban;

const PlatformsComponent = ({ item, index, disabled }) => {
  return (
    <Draggable
      draggableId={item.name}
      index={index}
      // isDragDisabled={disabled || data?._id === "unCategorized"}
    >
      {(provided) => (
        <div
          className="milestoneModule"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            className="moduleTitle textEllipse"
            {...provided.dragHandleProps}
            style={{
              background: "var(--projectCardBg)",
            }}
          >
            {item?.name}
          </div>
          <BugsList listId={item?.name} />
        </div>
      )}
    </Draggable>
  );
};

const BugsList = ({ listId, disabled }) => {
  const { orgId, projectId } = useProjectTeam();
  const { isLoading, data: bugData } = useBugs(orgId, projectId, listId);
  const itemCellCache = React.useRef(
    new CellMeasurerCache({
      defaultHeight: 78,
      fixedWidth: true,
    })
  );
  //     const bugData = {
  //       bugs : [
  //         {
  // _id : `listId_${Math.random()}`,
  // title : "Bugs Title",
  //         },
  //         {
  //             _id : `${Math.random()}`,
  //             title : "Bugs Title",
  //                     },
  //     ]
  //     }

  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [filterArray, setFilterArray] = useState(null);
  const filter = useSelector((state) => state?.filterReducer?.filter);

  return isLoading ? (
    <TableRowSkeleton
      style={{
        height: 120,
      }}
      marginTop={0}
      count={4}
    />
  ) : (
    <Droppable
      droppableId={listId}
      mode="virtual"
      type="taskMove"
      // isDropDisabled={listId === "unCategorized" || filterArray !== null}
      renderClone={(provided, snapshot, rubric) => (
        <BugsItem
          provided={provided}
          isDragging={snapshot.isDragging}
          style={{ margin: 0 }}
          snapshot={snapshot}
          disabled={disabled}
          bugInfo={bugData?.bugs[rubric.source.index]}
          // taskIndex === -1
          // ? []
          // : filterArray
          // ? filterArray[rubric.source.index]
          // : data?.[taskIndex]?.tasks[rubric.source.index]
        />
      )}
    >
      {(provided, snapshot) => {
        return (
          <div
            style={{
              height: !bugData?.bugs?.length
                ? addPopupOpen
                  ? 150
                  : snapshot?.draggingFromThisWith === null &&
                    snapshot?.isDraggingOver
                  ? 200
                  : 110
                : bugData?.bugs?.length <= 4
                ? bugData?.bugs?.length * 105 + 100
                : 110 * 5,
              width: "100%",
              background: "var(--projectCardBg)",
            }}
          >
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={height}
                  // rowCount={
                  //   taskIndex === -1
                  //     ? 1
                  //     : (filterArray
                  //         ? filterArray?.length + 1
                  //         : data?.[taskIndex]?.tasks?.length ?? 1) + 1
                  // }
                  rowCount={bugData?.bugs?.length + 1}
                  rowHeight={101}
                  width={width}
                  ref={(ref) => {
                    if (ref) {
                      const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                      if (whatHasMyLifeComeTo instanceof HTMLElement) {
                        provided.innerRef(whatHasMyLifeComeTo);
                      }
                    }
                  }}
                  deferredMeasurementCache={itemCellCache.current}
                  rowRenderer={getRowRender(
                    bugData?.bugs,
                    itemCellCache,
                    disabled || filterArray !== null,
                    filter
                  )}
                />
              )}
            </AutoSizer>
          </div>
        );
      }}
    </Droppable>
  );
};

const grid = 8;
const getRowRender =
  (quotes, cache, disabled) =>
  ({ style, key, index, parent }) => {
    try {
      const quote = quotes[index];
    } catch (err) {
      return null;
    }
    const quote = quotes[index];

    // We are rendering an extra item for the placeholder
    // Do do this we increased our data set size to include one 'fake' item
    if (!quote) {
      return null;
    }
    // Faking some nice spacing around the items
    const patchedStyle = {
      ...style,
      left: style.left + grid,
      top: style.top + 8,
      width: `calc(${style.width} - ${grid * 2}px)`,
      height: style.height - 5,
      padding: 0,
      border: "none",
    };

    return (
      <CellMeasurer
        key={quote._id}
        cache={cache?.current}
        columnIndex={0}
        rowIndex={index}
        parent={parent}
      >
        <Draggable
          draggableId={quote._id}
          index={index}
          shouldRespectForceTouch={false}
          isDragDisabled={quote?.disabled ? true : disabled}

          //  draggableId={quote._id} index={index}
        >
          {(provided, snapshot) => (
            <BugsItem
              provided={provided}
              bugInfo={quote}
              isDragging={snapshot.isDragging}
              style={patchedStyle}
            />
          )}
        </Draggable>
      </CellMeasurer>
    );
  };

const BugsItem = ({
  bugInfo,
  isDragging,
  isGroupedOver,
  provided,
  style,
  isClone,
  snapshot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="d_flex boxShadow"
      style={getStyle(provided, style, snapshot, bugInfo)}
    >
      <div
        style={{
          height: "100%",
          width: 4,
          background: bugStatusColor[bugInfo?.status],
          borderRadius: "5px 0px 0px 5px",
          marginRight: 8,
        }}
      />
      <div
        style={{
          width: "100%",
          paddingRight: 10,
        }}
        onClick={() => setIsOpen(true)}
      >
        <InputTextClickAway
          value={bugInfo?.title}
          className={"tasktitle"}
          textClassName={"pl-0"}
          height={"90%"}
          containerStyle={{
            paddingTop: 5,
          }}
          textStyle={{
            fontSize: 12,
          }}
          textArea
          // onChange={onTitleUpdate}
        />
     <div className="alignCenter">
<div className="flex alignCenter">
{
  bugInfo?.description &&      <LightTooltip title="Description" arrow>
  <div className="mr-1">
    <IosIcon name="menu"/>
  </div>
</LightTooltip>
}
{bugInfo?.attachments?.length > 0 &&     <LightTooltip title="Attachment" arrow>
        <div className="alignCenter mr-1">
          <AttachFileRoundedIcon style={{
            fontSize:16,
            color:"#8a9aff"
          }}/> <p
          style={{
            fontSize:12
          }}
          >{bugInfo?.attachments?.length}</p>
        </div>
        </LightTooltip> }

        { bugInfo?.comments?.length > 0 &&
          <LightTooltip title="Comment" arrow>
<div className="alignCenter mr-1">
<CommentRoundedIcon style={{
            fontSize:16,
            color:"#8a9aff"
          }}/>
</div>
          </LightTooltip>
        }
</div>

    <div>
    <AssigneeSelection 
     assignee={bugInfo?.assignees}
     disabled
     widthAuto
     multiple
     />
    </div>
     </div>
      </div>
        <BugInfoDialogAction 
        handleClose={() => setIsOpen(false)}
        open={isOpen}
        data={bugInfo}
        />
    </div>
  );
};



function getStyle(provided, style, snapshot, taskInfo) {
  // if (!snapshot.isDropAnimating) {
  // return  provided.draggableProps.style
  // }
  if (!style) {
    return provided.draggableProps.style;
  }
  // if (snapshot.isDropAnimating) {
  //   return {
  //     ...provided.draggableProps.style,
  //     ...style,
  //     transitionDuration: `0.001s`,
  //   };
  // }
  if (!snapshot?.isDropAnimating) {
    return {
      ...provided.draggableProps.style,
      ...style,
      opacity: taskInfo?.disabled ? 0.5 : 1,
      cursor: taskInfo?.disabled ? "default" : "pointer",
    };
  }
  return {
    ...provided.draggableProps.style,
    ...style,
    transitionDuration: `0.001s`,
    opacity: taskInfo?.disabled ? 0.5 : 1,
    cursor: taskInfo?.disabled ? "default" : "pointer",
  };
}


