import React, { useEffect , useState} from "react";
import { useGetLeads } from "react-query/lead/useGetLeads";
import { useSelector } from "react-redux";
import ProjectCardSkeleton from "skeleton/projectCard/ProjectCardSkeleton";
import Card from "./Card";
import {
  closestCenter, DndContext, KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove, rectSortingStrategy, SortableContext,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";
import { sortLeads } from "api/lead";
export default function LeadCards({ status }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
const queryClient = useQueryClient()

  // const [items, setItems] = useState([
  //   { _id: "1" },
  //   { _id: "2" },
  //   { _id: "3" },
  //   { _id: "4" },
  //   { _id: "5" },
  // ]);

  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );

  const orgId = selectedOrg?._id;

  const { data, isLoading } = useGetLeads(orgId, status);
console.log("data" ,data)

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (active.id !== over.id) {
    const oldIndex = data?.data?.leads.findIndex(({ _id }) => _id === active.id);
    const newIndex = data?.data?.leads.findIndex(({ _id }) => _id === over.id);
    let tempValue = jsonParser(data?.data?.leads)
    console.log("oldIndex" , oldIndex)
        console.log("newIndex" , newIndex)
        let finalArray = arrayMove(tempValue, oldIndex, newIndex);
        console.log("finalArray" , finalArray)
        let tempIds = {}
        finalArray?.map((item, index) => {
          tempIds[item?._id]= index + 1;
          return null;
        });
        console.log("tempIds" , tempIds)
let newData = {
  data : {
    leads:[...finalArray]
  }
}

sortLeads(orgId , {
  
    leads :tempIds 
  
}).then(res => console.log("res" , res)).catch(err => {
  console.error(err)
  queryClient.setQueryData([ "leads", orgId, status],{
    data : {
      leads:[...tempValue]
    }
  });

})

console.log("newData" , newData)
        queryClient.setQueryData([ "leads", orgId, status],newData);


  }
}

  const showCards = () =>
  <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={data?.data?.leads.map(({ _id }) => _id)}
        strategy={rectSortingStrategy}
      >
    {data?.data?.leads?.map((el , index) => (
      <Card
        key={index}
        name={el.name}
        status={el.status}
        email={el.email}
        country={el.country}
        dateContactedFirst={el.dateContactedFirst}
        nextFollowUp={el.nextFollowUp}
        id={el._id}
        item={el}
        tabStatus={status}
      />
    ))}
    </SortableContext>
    </DndContext>
  return (
    <>
      {isLoading
        ? new Array(4)
            .fill("")
            .map((item, index) => <ProjectCardSkeleton key={index} />)
        : showCards()}
    </>
  );
}
