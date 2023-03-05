import React, { memo, useCallback } from "react";
import "./MilestoneModule.scss";

import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTasks } from "react-query/milestones/task/useTasks";
import TaskRowItem from "./TaskRowItem";
import { jsonParser } from "utils/jsonParser";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { useSelector } from "react-redux";
import AddTaskRow from "./AddTaskRow";
function ModuleTaskRow({
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
  isTaskDragging,
}) {
  const cache = React.useRef(
    new CellMeasurerCache({ fixedWidth: true, defaultHeight: 45 })
  );
  const { data, isLoading } = useTasks(orgId, milestoneId);
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const moduleId = moduleInfo?._id;
    for (let i = 0; i < data?.length; i++) {
      if (data[i]?._id?.length === 0 && moduleId === "unCategorized") {
        setTaskData([...data[i]?.tasks] ?? []);
        break;
      } else if (data[i]?._id[0] === moduleId) {
        setTaskData([...data[i]?.tasks] ?? []);
        break;
      }
    }
  }, [data]);
  const [isSelected, setIsSelected] = useState([]);

  const onSelectTask = useCallback(
    (id) => {
      let prevSelected = [...isSelected];
      prevSelected.push(id);
      setIsSelected(prevSelected);
    },
    [isSelected]
  );

  const filter = useSelector((state) => state?.filterReducer?.filter);
  const taskRowRender = () => {
    const { assigneeIds, status, platforms } = filter;
    return assigneeIds?.length || status?.length || platforms?.length
      ? data
          ?.find(
            (x) =>
              x?._id[0] === moduleInfo?._id ||
              (x?._id?.length === 0 && moduleInfo?._id === "unCategorized")
          )
          ?.tasks?.map(
            (item, index) =>
              (status?.includes(item?.status) ||
                item?.platforms?.filter((item) => platforms?.includes(item))
                  .length > 0 ||
                item?.assignees?.filter((item) =>
                  assigneeIds?.includes(item?._id)
                ).length > 0) && (
                <Draggable
                  key={item?._id}
                  draggableId={item._id}
                  index={index}
                  shouldRespectForceTouch={false}
                  isDragDisabled={disabled}
                >
                  {(provided, snapshot) => (
                    <TaskRowItem
                      provided={provided}
                      isDragging={snapshot.isDragging}
                      index={index}
                      taskInfo={item}
                      style={{}}
                      // ref={cache}
                      onSelectTask={onSelectTask}
                      isSelected={isSelected}
                    />
                  )}
                </Draggable>
              )
          )
      : data
          ?.find(
            (x) =>
              x?._id[0] === moduleInfo?._id ||
              (x?._id?.length === 0 && moduleInfo?._id === "unCategorized")
          )
          ?.tasks?.map((item, index) => (
            <Draggable
              key={item?._id}
              draggableId={item._id}
              index={index}
              shouldRespectForceTouch={false}
              isDragDisabled={disabled}
            >
              {(provided, snapshot) => (
                <TaskRowItem
                  provided={provided}
                  isDragging={snapshot.isDragging}
                  index={index}
                  taskInfo={item}
                  style={{}}
                  // ref={cache}
                  onSelectTask={onSelectTask}
                  isSelected={isSelected}
                  isTaskDragging={isTaskDragging}
                  isTaskLastIndex={
                    data?.find(
                      (x) =>
                        x?._id[0] === moduleInfo?._id ||
                        (x?._id?.length === 0 &&
                          moduleInfo?._id === "unCategorized")
                    )?.tasks?.length -
                      1 ===
                    index
                  }
                />
              )}
            </Draggable>
          ));
  };
  return (
    <Droppable droppableId={listId} type={listType} isDropDisabled={disabled}>
      {(dropProvided, dropSnapshot) => (
        <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
          {!disabled && (
            <AddTaskRow
              moduleInfo={moduleInfo}
              orgId={orgId}
              projectId={projectId}
              milestoneId={milestoneId}
              disabled={disabled}
            />
          )}

          {isLoading ? (
            <TableRowSkeleton
              height={40}
              count={4}
              style={{
                marginLeft: 15,
              }}
            />
          ) : (
            taskRowRender()
          )}
          {dropProvided.placeholder}
        </div>
      )}
    </Droppable>
    // <>
    //   {!disabled && (
    //     <AddTaskRow
    //       moduleInfo={moduleInfo}
    //       orgId={orgId}
    //       projectId={projectId}
    //       milestoneId={milestoneId}
    //       disabled={disabled}
    //     />
    //   )}

    //   {isLoading ? (
    //     <TableRowSkeleton
    //       height={40}
    //       count={4}
    //       style={{
    //         marginLeft: 15,
    //       }}
    //     />
    //   ) : (
    //     taskRowRender()
    //   )}
    // </>
  );
  // return (
  //   <Droppable
  //     droppableId={listId}
  //     type={listType}
  //     isDropDisabled={isDropDisabled}
  //     mode="virtual"
  //     renderClone={(provided, snapshot, rubric) => (
  //       <TaskRowItem
  //         provided={provided}
  //         isDragging={snapshot.isDragging}
  //         index={rubric.source.index}
  //         style={{ margin: 0 }}
  //         taskInfo={taskData[rubric.source.index]}
  //         onSelectTask={onSelectTask}
  //         isSelected={isSelected}
  //       />
  //     )}
  //   >
  //     {(dropProvided, dropSnapshot) => (
  //       <div
  //         style={{
  //           width: "100%",
  //           // height : "50vh"
  //           height: taskData ? taskData?.length * 45 + 50 : 45,
  //         }}
  //       >
  //         <AutoSizer>
  //           {({ height, width }) => (
  //             <List
  //               height={height}
  //               width={width}
  //               // style={{background  : "red"}}
  //               // containerStyle={{  overflow:"visible"}}
  //               // style={{ overflow : "visible"}}
  //               className="overflowVisible"
  //               // rowHeight={45}
  //               rowHeight={cache.current.rowHeight}
  //               deferredMeasurementCache={cache.current}
  //               rowCount={taskData.length}
  //               rowRenderer={getRowRender(taskData, cache , isSelected , onSelectTask)}
  //               // rowRenderer={({key , index , style , parent , }) => {
  //               //   const person1 = taskData[index]
  //               //   return <CellMeasurer
  //               //   key={key}
  //               //   cache={cache.current}
  //               //   parent={parent}
  //               //   columnIndex={0}
  //               //   rowIndex={index}
  //               //   >
  //               //     <div style={style}>
  //               //   {person1.name}
  //               //     </div>
  //               //   </CellMeasurer>
  //               // }}
  //               ref={(ref) => {
  //                 // react-virtualized has no way to get the list's ref that I can so
  //                 // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
  //                 if (ref) {
  //                   // eslint-disable-next-line react/no-find-dom-node
  //                   const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
  //                   if (whatHasMyLifeComeTo instanceof HTMLElement) {
  //                     dropProvided.innerRef(whatHasMyLifeComeTo);
  //                   }
  //                 }
  //               }}
  //             />
  //           )}
  //         </AutoSizer>
  //       </div>
  //     )}
  //   </Droppable>
  // );
}

export default memo(ModuleTaskRow);
// const getRowRender =
//   (people_, cache, isSelected, onSelectTask) =>
//   ({ style, key, index, parent }) => {
//     const singleRow = people_[index];
//     return (
//       <CellMeasurer
//         key={key}
//         cache={cache?.current}
//         columnIndex={0}
//         rowIndex={index}
//         parent={parent}
//       >
//         <Draggable
//           draggableId={singleRow?._id}
//           index={index}
//           shouldRespectForceTouch={false}
//         >
//           {(provided, snapshot) => (
//             <TaskRowItem
//               provided={provided}
//               isDragging={snapshot.isDragging}
//               index={index}
//               taskInfo={singleRow}
//               style={{ ...style }}
//               ref={cache}
//               onSelectTask={onSelectTask}
//               isSelected={isSelected}
//             />
//           )}
//         </Draggable>
//       </CellMeasurer>
//     );
//   };
// function InnerList({ quotes, dropProvided, title }) {
//   return (
//     <div ref={dropProvided.innerRef}>
//       <InnerTaskList quotes={quotes.items} />
//     </div>
//   );
// }

// const getRowRender = React.memo(function InnerTaskList({ taskData }) {
//   console.log({ taskData });
//   return <div>asds</div>;
// return quotes.map((quote, index) => (
//   <Draggable
//     key={quote.id}
//     draggableId={quote.id}
//     index={index}
//     shouldRespectForceTouch={false}
//   >
//     {(dragProvided, dragSnapshot) => (
//       <TaskItem
//         key={quote.id}
//         quote={quote}
//         isDragging={dragSnapshot.isDragging}
//         isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
//         provided={dragProvided}
//       />
//     )}
//   </Draggable>
// ));
// });
