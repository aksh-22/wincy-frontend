import { moveTo, sortModule, sortTask } from "api/milestone";
import { useProjectTeam } from "hooks/useUserType";
import React from "react";
import { useState, useEffect, memo } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useQueryClient } from "react-query";
import { useMilestoneModule } from "react-query/milestones/module/useMilestoneModule";
import { useTasks } from "react-query/milestones/task/useTasks";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { jsonParser } from "utils/jsonParser";
import AddNewModule from "./milestone-module/AddNewModule";
import MilestoneModule from "./milestone-module/MilestoneModule";
function MilestoneModuleDraggable({
  orgId,
  projectId,
  milestoneId,
  disabled,
  isPlatformShow,
}) {
  const { location } = useHistory();
  // Get Milestone Module List
  const { isLoading, data } = useMilestoneModule(location.pathname);
  const { data: taskData } = useTasks(orgId, milestoneId);
  // const [moduleData, setModuleData] = useState(null);
  // Drag Handler Function
  const queryClient = useQueryClient();
  const onDragEnd = (result) => {
    setIsDraggingStart(false);
    setIsTaskDragging(false);

    if (!result.destination) {
      return;
    }

    const { draggableId, source, destination } = result;
    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (result?.type === "taskMove") {
      let previousTask = jsonParser(taskData);
      const updatedData = reorderTasks({
        taskData: [...taskData],
        draggableId,
        source,
        destination,
      });

      const { updated, apiData } = updatedData;

      queryClient.setQueryData(["tasks", orgId, milestoneId], [...updated]);

      if (source?.droppableId === destination?.droppableId) {
        sortTask({
          data: {
            tasks: apiData,
          },
          milestoneId,
          orgId,
        })
          .then((res) => console.debug(res))
          .catch((err) => {
            resetReorder("tasks", previousTask);
          });
      } else {
        moveTo({
          data: {
            tasks: [draggableId],
            module: destination?.droppableId,
          },
          orgId,
        })
          .then((res) => {
            sortTask({
              data: {
                tasks: apiData,
              },
              milestoneId,
              orgId,
            });
          })
          .catch((err) => {
            resetReorder("tasks", previousTask);
          });
      }
    } else {
      let previousModule = jsonParser(data);
      const newModuleData = reorderModule({
        moduleData: data,
        source,
        destination,
        draggableId,
      });
      const { updated, apiData } = newModuleData;
      queryClient.setQueryData(["module", orgId, milestoneId], updated);
      sortModule({
        data: {
          modules: apiData,
        },
        milestoneId,
        orgId,
      })
        .then((res) => console.debug(res))
        .catch((err) => {
          resetReorder("modules", previousModule);
        });
    }
  };

  const resetReorder = (type, value) => {
    queryClient.setQueryData([type, orgId, milestoneId], value);
  };

  const reorderTasks = ({ source, destination, taskData, draggableId }) => {
    // move in same list
    if (source?.droppableId === destination?.droppableId) {
      let list = [];
      for (let i = 0; i < taskData?.length; i++) {
        if (
          taskData[i]?._id[0] === destination?.droppableId ||
          (taskData[i]?._id?.length === 0 &&
            destination?.droppableId === "unCategorized")
        ) {
          list = {
            ...taskData[i],
            index: i,
          };
          break;
        }
      }

      const result = Array.from(list?.tasks ?? []);
      const [removed] = result.splice(source.index, 1);
      result.splice(destination.index, 0, removed);

      list.tasks = [...result];
      let tempTask = taskData;
      tempTask[list?.index] = { ...list };

      let sendData = {};
      list?.tasks?.map((row, index) => {
        sendData[`${row?._id}`] = index + 1;
        return null;
      });
      return {
        updated: tempTask,
        apiData: sendData,
      };
    }

    // Move in Different List

    let a = taskData?.find(
      (item) =>
        item?._id[0] === source?.droppableId ||
        (item?._id?.length === 0 && source?.droppableId === "unCategorized")
    );
    let moveTaskData = a?.tasks?.find((item) => item?._id === draggableId);

    let isDestinationIdExist = false;

    for (let i = 0; i < taskData?.length; i++) {
      // remove  in source Data array
      if (
        taskData[i]?._id[0] === source?.droppableId ||
        (taskData[i]?._id?.length === 0 &&
          source?.droppableId === "unCategorized")
      ) {
        let tasks = taskData[i]?.tasks;
        tasks?.splice(source?.index, 1);
      }

      // Insert in destination Data array
      if (
        taskData[i]?._id[0] === destination?.droppableId ||
        (taskData[i]?._id?.length === 0 &&
          destination?.droppableId === "unCategorized")
      ) {
        let tasks = taskData[i]?.tasks;
        tasks?.splice(destination?.index, 0, {
          ...moveTaskData,
          module: destination?.droppableId,
        });
        isDestinationIdExist = true;
      }
    }

    if (!isDestinationIdExist) {
      taskData = [
        ...taskData,
        {
          _id: [destination?.droppableId],
          tasks: [moveTaskData],
        },
      ];
    }
    let findData = taskData?.find(
      (item) => item?._id[0] === destination?.droppableId
    );
    let sendData = {};
    findData?.tasks?.map((row, index) => {
      sendData[`${row?._id}`] = index + 1;
      return null;
    });
    return { updated: taskData, apiData: sendData };
  };

  const reorderModule = ({ source, destination, moduleData, draggableId }) => {
    const result = Array.from(moduleData?.modules ?? []);
    const [removed] = result.splice(source.index, 1);
    result.splice(destination.index, 0, removed);

    let sendData = {};
    result?.map((row, index) => {
      row?._id !== "unCategorized" && (sendData[`${row?._id}`] = index + 1);
      return null;
    });

    return {
      updated: {
        modules: [...result],
      },
      apiData: sendData,
    };
  };

  useEffect(() => {
    if (taskData) {
      let unCategorized = taskData?.find((item) => item?._id?.length === 0);
      let unCategorizedExist = data?.modules?.find(
        (item) => item?._id === "unCategorized"
      );
      if (unCategorizedExist) {
        return null;
      } else if (unCategorized) {
        let temp = data;
        temp?.modules?.push({
          project: projectId,
          milestone: milestoneId,
          module: "Un-Categorized",
          _id: "unCategorized",
        });
        queryClient.setQueryData(["module", orgId, milestoneId], temp);
      }
    }
  }, [taskData, data]);

  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const filter = useSelector((state) => state?.filterReducer?.filter);
  const [filterData, setFilterData] = useState(null);
  useEffect(() => {
    const temp = queryClient?.getQueryData(["tasks", orgId, milestoneId]);
    const { assigneeIds, status, platforms } = filter;
    if (!assigneeIds?.length && !status?.length && !platforms?.length) {
      return setFilterData(null);
    }
    let ids = [];
    temp?.map((row, index) => {
      let findData = row?.tasks?.find(
        (item) =>
          status?.includes(item?.status) ||
          item?.platforms?.filter((item) => platforms?.includes(item)).length >
            0 ||
          item?.assignees?.filter((item) => assigneeIds?.includes(item?._id))
            .length > 0
      );
      if (findData) {
        ids?.push(row?._id[0]);
        return row?._id[0];
      }
    });
    const filterModule = data?.modules?.filter((item) =>
      ids?.includes(item?._id)
    );
    setFilterData({
      modules: filterModule,
    });
  }, [filter, data]);
  const [isTaskDragging, setIsTaskDragging] = useState(false);
  return (
    <>
      {!disabled && !isLoading && <AddNewModule />}

      {isLoading ? (
        <div>
          {/* TODO: Create Loading Component */}
          <TableRowSkeleton count={4} height={40} />
        </div>
      ) : (
        <DragDropContext
          onDragEnd={onDragEnd}
          onBeforeCapture={(e) => {
            if (data?.modules?.find((item) => item?._id === e?.draggableId)) {
              setIsDraggingStart(true);
            } else {
              setIsTaskDragging(true);
            }
          }}
        >
          <Droppable
            droppableId="board"
            type="moduleMove"
            isDropDisabled={disabled}
          >
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filterData
                  ? filterData?.modules?.map((key, index) => (
                      <MilestoneModule
                        key={key?._id}
                        index={index}
                        title={key?.module}
                        data={key}
                        orgId={orgId}
                        projectId={projectId}
                        milestoneId={milestoneId}
                        // isDragging={snapshot?.isDraggingOver}
                        isDragging={isDraggingStart}
                        disabled={disabled}
                        isPlatformShow={isPlatformShow}
                        filterDraggableDisable
                      />
                    ))
                  : data?.modules?.map((key, index) => (
                      <MilestoneModule
                        key={key?._id}
                        index={index}
                        title={key?.module}
                        data={key}
                        orgId={orgId}
                        projectId={projectId}
                        milestoneId={milestoneId}
                        // isDragging={snapshot?.isDraggingOver}
                        isDragging={isDraggingStart}
                        disabled={disabled}
                        isTaskDragging={isTaskDragging}
                        isPlatformShow={isPlatformShow}
                      />
                    ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}

export default memo(MilestoneModuleDraggable);

// function Column({title , index , quotes}) {
//   return (
//     <Draggable draggableId={title} index={index}>
//     {(provided, snapshot) => (
//       <div ref={provided.innerRef} {...provided.draggableProps}>
//     <div isDragging={snapshot.isDragging}>
//     <div
//                 isDragging={snapshot.isDragging}
//                 {...provided.dragHandleProps}
//               >

//                <MilestoneModule />
//               </div>
//         </div>
//         <AddTaskRow />
//         <TableComponent
//           listId={title}
//           listType="QUOTE"
//           style={{
//             backgroundColor: snapshot.isDragging ? "green" : null
//           }}
//           quotes={quotes}
//         />
//       </div>
//      )}
//     </Draggable>
//   )
// }

// function TableComponent({listId , listType , style , quotes  , isDropDisabled}) {
//   return (
//     <Droppable
//     droppableId={listId}
//     type={listType}
//     // ignoreContainerClipping={ignoreContainerClipping}
//     isDropDisabled={isDropDisabled}
//     // isCombineEnabled={isCombineEnabled}
//   >
//      {(dropProvided, dropSnapshot) => (
//            <div
//            style={style}
//            isDraggingOver={dropSnapshot.isDraggingOver}
//            isDropDisabled={isDropDisabled}
//            isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
//            {...dropProvided.droppableProps}
//          >
//           {/* <InnerList
//                 quotes={quotes}
//                 title={listId}
//                 dropProvided={dropProvided}
//               />   */}
//            </div>
//      )}
//     </Droppable>
//   )
// }

// class InnerList extends React.Component {
//   render() {
//     const { quotes, dropProvided } = this.props;
//     const title = this.props.title ? <div>{this.props.title}</div> : null;
// console.log({quotes})
//     return (
//       <div>
//         {title}
//         <div ref={dropProvided.innerRef}>
//           <InnerQuoteList quotes={quotes.items} />
//           {dropProvided.placeholder}
//         </div>
//       </div>
//     );
//   }
// }

// class InnerQuoteList extends React.Component {
//   // shouldComponentUpdate(nextProps) {
//   //   if (nextProps.quotes !== this.props.quotes) {
//   //     return true;
//   //   }

//   //   return false;
//   // }
//   render() {
//     console.log(this.props.quotes)
//     return this.props.quotes.map((quote, index) => (
//       <Draggable
//         key={quote.id}
//         draggableId={quote.id}
//         index={index}
//         shouldRespectForceTouch={false}
//       >
//         {(dragProvided, dragSnapshot) => (

//           <QuoteItem
//             key={quote.id}
//             quote={quote}
//             isDragging={dragSnapshot.isDragging}
//             isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
//             provided={dragProvided}
//           />
//         )}
//       </Draggable>
//     ));
//   }
// }

// class QuoteItem extends React.PureComponent {
//   render() {
//     const { quote, isDragging, isGroupedOver, provided } = this.props;

//     return (
//       <div
//         // href={quote.author.url}
//         isDragging={isDragging}
//         isGroupedOver={isGroupedOver}

//         ref={provided.innerRef}
//         {...provided.draggableProps}
//         {...provided.dragHandleProps}
//       >
//         {/* <Avatar src={quote.author.avatarUrl} alt={quote.author.name} /> */}
//         <div>
//           <div>{quote.content}</div>
//           <div>
//             <div>{quote.author}</div>
//             <h1>id:{quote.id}</h1>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
