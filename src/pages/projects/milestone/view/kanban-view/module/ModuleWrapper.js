// @flow
import { moveTo, sortModule, sortTask } from 'api/milestone';
import React, { useState , useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { useMilestoneModule } from 'react-query/milestones/module/useMilestoneModule';
import { useTasks } from 'react-query/milestones/task/useTasks';
import { useHistory } from 'react-router-dom';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import { jsonParser } from 'utils/jsonParser';
import { reorderList } from 'utils/reorderList';
import AddModuleKanban from './addModule-kanban/AddModuleKanban';
import MilestoneModule from './MilestoneModule';
// import './ModuleWrapper.css';
// let str = 'I wrote react-virtualized several years ago';
// let uniqueId = 0;
// function getItems(count) {
//   return Array.from({ length: count }, (v, k) => {
//     const id = uniqueId++;
//     return {
//       id: `id:${id}`,
//       text: `item ${id} ${Array(k)
//         .fill('d')
//         .map((x) => str)}
//     `,
//     };
//   });
// }



// Recommended react-window performance optimisation: memoize the row render function
// Things are still pretty fast without this, but I am a sucker for making things faster

function ModuleWrapper({ orgId, projectId, milestoneId , disabled }) {

// Kuldeep Code
const { location } = useHistory();
const { isLoading, data } = useMilestoneModule(location.pathname);
const { data: taskData } = useTasks(orgId, milestoneId);
const queryClient = useQueryClient();



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

// END





  function onDragEnd(result) {

    if (!result.destination) {
      return;
    }
console.log("result" , result)
const { draggableId, source, destination } = result;
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
        resetReorder("tasks" , previousTask);
      });

  } else {
    moveTo({
      data: {
        tasks: [draggableId],
        module: destination?.droppableId,
      },
      orgId
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
        resetReorder("tasks" ,previousTask);
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
  const {updated , apiData} = newModuleData
  queryClient.setQueryData(["module", orgId, milestoneId], updated);
  sortModule({
    data: {
      modules: apiData,
    },
    milestoneId,
    orgId,
  }).then(res => console.debug(res)).catch(err => {
    resetReorder("modules" ,previousModule);
  })
}
  }

  const resetReorder = ( type, value) => {
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
        tasks?.splice(destination?.index, 0, {...moveTaskData , module : destination?.droppableId });
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
      row?._id !== "unCategorized" &&  (sendData[`${row?._id}`] = index + 1);
      return null;
    });

    return {
     updated : {
      modules: [...result],
     },
     apiData : sendData
    };
  };

  return (
    isLoading? 
    <div className='alignCenter' >
      <TableRowSkeleton 
    style={{
      height : '70vh',
      width : 320,
      margin:5
    }}
    count={4}
    />
    </div>
    :
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='d_flex' style={{
        maxWidth:"100vw",
        overflowX:"auto",
        // height  : 300
      }}>
        <Droppable
          droppableId='board'
          direction='horizontal'
          type='moduleMove'
          isDropDisabled={disabled}
          >
          {(provided) => (
            <div
              className='d_flex'
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {data?.modules?.map((key, index) => (
                <MilestoneModule
                  // key={key}
                  // column={state.columns[key]}
                  index={index}
                  key={key?._id}
                  // index={index}
                  title={key?.module}
                  data={key}
                  orgId={orgId}
                  projectId={projectId}
                  milestoneId={milestoneId}
                  disabled={disabled}
                />
              ))}
                    
              {provided.placeholder}
            </div>
          )}
   
        </Droppable>
       
    {!disabled &&  <AddModuleKanban />}
      </div>

    </DragDropContext>
  );
}

export default ModuleWrapper;
