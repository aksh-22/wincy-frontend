import React, { useMemo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import "./MilestoneModule.css";
import TaskKanban from "./TaskKanban";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import ReactDOM from "react-dom";
import { useTasks } from "react-query/milestones/task/useTasks";
import { useState } from "react";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import AddModuleKanban from "./addModule-kanban/AddTaskKanban";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { capitalizeFirstLetter } from "utils/textTruncate";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import { useMilestoneModuleUpdate } from "react-query/milestones/module/useMilestoneModuleUpdate";

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
            <TaskKanban
              provided={provided}
              taskInfo={quote}
              isDragging={snapshot.isDragging}
              style={patchedStyle}
            />
          )}
        </Draggable>
      </CellMeasurer>
    );
  };

const ItemList = React.memo(function ItemList({
  listId,
  listType,
  style,
  quotes,
  isDropDisabled,
  orgId,
  projectId,
  milestoneId,
  moduleInfo,
  disabled,
  index,
}) {
  const itemCellCache = React.useRef(
    new CellMeasurerCache({
      defaultHeight: 78,
      fixedWidth: true,
    })
  );
  const { data, isLoading } = useTasks(orgId, milestoneId);

  const filter = useSelector((state) => state?.filterReducer?.filter);

  const [taskIndex, setTaskIndex] = useState(-1);
  const [filterArray, setFilterArray] = useState(null);

  useEffect(() => {
    const { assigneeIds, status, platforms } = filter;
    if (assigneeIds?.length || status?.length || platforms?.length) {
      let tempFilterArr = data
        ?.find(
          (x) =>
            x?._id[0] === moduleInfo?._id ||
            (x?._id?.length === 0 && moduleInfo?._id === "unCategorized")
        )
        ?.tasks?.filter(
          (item) =>
            status?.includes(item?.status) ||
            item?.platforms?.filter((item) => platforms?.includes(item))
              .length > 0 ||
            item?.assignees?.filter((item) => assigneeIds?.includes(item?._id))
              .length > 0
        );
      setFilterArray(tempFilterArr);
    } else {
      setFilterArray(null);
    }
  }, [filter]);

  React.useEffect(() => {
    let findIindex = data?.findIndex(
      (x) =>
        x?._id[0] === moduleInfo?._id ||
        (x?._id?.length === 0 && moduleInfo?._id === "unCategorized")
    );
    setTaskIndex(findIindex);
  }, [data]);

  const [addPopupOpen, setAddPopupOpen] = useState(false)
  return isLoading ? (
    <TableRowSkeleton
      style={{
        height: 120,
      }}
      marginTop={0}
      count={4}
    />
  ) : (
    <>
      <Droppable
        droppableId={listId}
        mode="virtual"
        type="taskMove"
        isDropDisabled={listId === "unCategorized" || filterArray !== null}
        renderClone={(provided, snapshot, rubric) => (
          <TaskKanban
            provided={provided}
            isDragging={snapshot.isDragging}
            taskInfo={
              taskIndex === -1
                ? []
                : filterArray
                ? filterArray[rubric.source.index]
                : data?.[taskIndex]?.tasks[rubric.source.index]
            }
            style={{ margin: 0 }}
            snapshot={snapshot}
            disabled={disabled}
          />
        )}
      >
        {(provided, snapshot) => {
          return (
            <div
              style={{
                height: !data?.[taskIndex]?.tasks?.length ? (addPopupOpen ? 150 : (snapshot?.draggingFromThisWith === null && snapshot?.isDraggingOver) ? 200 :50) : (data?.[taskIndex]?.tasks?.length <= 4 ? (data?.[taskIndex]?.tasks?.length*105)+100 : 110*5),
                width: "100%",
                background: "var(--projectCardBg)",
              }}
            >
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    height={height}
                    rowCount={
                      taskIndex === -1
                        ? 1
                        : (filterArray
                            ? filterArray?.length + 1
                            : data?.[taskIndex]?.tasks?.length ?? 1) + 1
                    }
                    // rowCount={8}
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
                      taskIndex === -1
                        ? []
                        : filterArray
                        ? filterArray
                        : data?.[taskIndex]?.tasks,
                      itemCellCache,
                      disabled || filterArray !== null,
                      filter
                    )}
                  />
                )}
              </AutoSizer>
              
              <AddModuleKanban
                orgId={orgId}
                milestoneId={milestoneId}
                projectId={projectId}
                moduleInfo={moduleInfo}
                setAddPopupOpen={setAddPopupOpen}
              />
            </div>
          );
        }}
      </Droppable>
    </>
  );
});

const MilestoneModule = React.memo(function MilestoneModule({
  title,
  index,
  data,
  orgId,
  projectId,
  milestoneId,
  disabled,
  isDragging,
}) {
  const { mutate } = useMilestoneModuleUpdate();
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
  return (
    <Draggable
      draggableId={data._id}
      index={index}
      isDragDisabled={disabled || data?._id === "unCategorized"}
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
          > <InputTextClickAway
          // className="moduleTitle textEllipse"
          className={"textEllipse"}
          textClassName={"textEllipse pl-0"}
          value={capitalizeFirstLetter(data?.module)}
          containerStyle={{
            background: "var(--projectCardBg)",
          }}
          onChange={mutate}
          objectKey="module"
          extraData={extraData}
          disabled={data?._id === "unCategorized" ? true : (disabled || (data?.disabled ?? false))}

           />
            {/* {capitalizeFirstLetter(data?.module)} */}
          </div>
          <ItemList
            listId={data?._id}
            listType="taskMove"
            moduleInfo={data}
            orgId={orgId}
            projectId={projectId}
            milestoneId={milestoneId}
            disabled={disabled}
            column={data}
            index={index}
          />
        </div>
      )}
    </Draggable>
  );
});

export default MilestoneModule;
