import "components/milestoneCard/MilestoneCard.scss";
import { useProjectTeam } from "hooks/useUserType";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useQueryClient } from "react-query";
import { useMilestones } from "react-query/milestones/useMilestones";
import { useUpdateMilestone } from "react-query/milestones/useUpdateMilestone";
import MilestoneType from "./MilestoneType";
import { sortMilestone } from "api/milestone";
import { jsonParser } from "utils/jsonParser";
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';

const reorder = (list, startIndex, endIndex) => {
  console.log("list", list);
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  console.log(
    "aaa",
    source,
    destination,
    droppableSource,
    droppableDestination
  );
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const MilestoneKanbanView = ({milestoneId , orgId , projectId , filter={}}) => {
  // const getMilestoneType = React.useCallback(
  //   (id) => {
  //     console.log('abccccc', id, typeof id);
  //     return id === 'droppable1'
  //       ? activeMilestones
  //       : id === 'droppable2'
  //       ? notStartedMilestones
  //       : id === 'droppable3'
  //       ? completedMilestones
  //       : id === 'droppable4'
  //       ? dummy1
  //       : id === 'droppable5'
  //       ? dummy2
  //       : dummy3;
  //   },
  //   [
  //     activeMilestones,
  //     completedMilestones,
  //     notStartedMilestones,
  //     dummy3,
  //     dummy2,
  //     dummy1,
  //   ]
  // );
  const queryClient = useQueryClient();
  const {actionDisabled}  = useProjectTeam()
  const { data, isLoading } = useMilestones(orgId, projectId);

  const {mutate:updateMutate} = useUpdateMilestone()
  const onDragEnd = React.useCallback((result) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    console.log(result);

let previousMilestoneCopy = jsonParser(data[3]?.milestonesData??[])
    // Move in same list
    if (source.droppableId === destination.droppableId) {
      const result = Array.from(
        data?.[milestoneStatusIndex(destination.droppableId)]?.milestones ?? []
      );
      console.log("-->",data , data?.[milestoneStatusIndex(destination.droppableId)]?.milestone)
      // console.log(JSON.parse(JSON.stringify( data?.[milestoneStatusIndex(destination.droppableId)]?.milestones)))
      const [removed] = result.splice(source.index, 1);
      result.splice(destination.index, 0, removed);
      let newData = [];
      let tempData = [];
      for (let i = 0; i < data?.length; i++) {
        if (data[i].status === destination?.droppableId) {
          tempData = [...result];
        } else {
          tempData = data[i].milestones;
        }
        if (data[i].status) {
          newData = [...newData, ...tempData];
        }
      }
      console.log({ newData } , {result});
      queryClient.setQueryData(["milestones", orgId, projectId], {
        milestones: [...newData],
      });

      let tempIds = {}
      newData?.map((item, index) => {
        
        tempIds[item?._id]= index + 1;
        return null;
      });
      
      sortMilestone({
        data: {
          milestones: tempIds,
        },
        orgId,
        projectId,
      })
        .then((res) => {})
        .catch((err) => {
          queryClient.setQueryData(["milestones", orgId, projectId], {
            milestones: [...previousMilestoneCopy],
          });
        });
      return null;
    }


    // Move in Different List
const destinationData = data?.[milestoneStatusIndex(destination.droppableId)]?.milestones
const sourceData = data?.[milestoneStatusIndex(source.droppableId)]?.milestones
// let moveableData = sourceData?.find((item) => item?._id === draggableId)
const [moveableData] = sourceData.splice(source.index, 1);
destinationData.splice(destination.index, 0, {
  ...moveableData,
  status : destination?.droppableId === "Not Started" ?  "NotStarted" : destination?.droppableId
});

let newData = [
  ...data[0]?.milestones,
  ...data[1]?.milestones,
  ...data[2]?.milestones
]

console.log({data} , {newData})
queryClient.setQueryData(["milestones", orgId, projectId], {
  milestones: [...newData],
});
console.log({moveableData})

updateMutate({
  data : {
    status : destination?.droppableId === "Not Started" ?  "NotStarted" : destination?.droppableId
  },
  orgId,
  projectId,
  milestoneId : draggableId
})
  }, [data]);


  const { milestoneIds , status } = filter;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {
          isLoading ? 
          
          <TableRowSkeleton style={{
            width : 320,
            margin:5,
            height:100
          }}
          count={3}
          />
          

:
<>

<MilestoneType
          key={"1"}
          droppableId={"Active"}
          columnNo={1}
          items={data?.[0]?.milestones}
          orgId={orgId}
          projectId={projectId}
          disabled={actionDisabled}
        />
        <MilestoneType
          key={"2"}
          droppableId={"Not Started"}
          columnNo={2}
          items={data?.[1]?.milestones}
          canAddMilestone={true}
          milestonesData={data?.[3]?.milestonesData}
          orgId={orgId}
          projectId={projectId}
          disabled={actionDisabled}
        />
        <MilestoneType
          key={"3"}
          droppableId={"Completed"}
          columnNo={3}
          items={data?.[2]?.milestones}
          orgId={orgId}
          projectId={projectId}
          disabled={actionDisabled}
        />
</>}
        
      </div>
    </DragDropContext>
  );
};

const milestoneStatusIndex = (type) => {
  switch (type) {
    case "Active":
      return 0;
    case "Not Started":
      return 1;
    case "Completed":
      return 2;
    default:
      return 0;
  }
};

export default MilestoneKanbanView;
