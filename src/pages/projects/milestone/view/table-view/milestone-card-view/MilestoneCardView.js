import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { sortMilestone } from "api/milestone";
import CommonDialog from "components/CommonDialog";
import ProjectCardCss from "css/ProjectCard.module.css";
import { useProjectTeam } from "hooks/useUserType";
import React, { memo, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useMilestones } from "react-query/milestones/useMilestones";
import { useProjectInfo } from "react-query/projects/useProjectInfo";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ProjectCardSkeleton from "skeleton/projectCard/ProjectCardSkeleton";
import { jsonParser } from "utils/jsonParser";
import AddMilestoneAction from "./addMilestoneCard/AddMilestoneAction";
import AddMilestoneContainer from "./addMilestoneCard/AddMilestoneContainer";
import MilestoneCard from "./milestoneCard/MilestoneCard";

function MilestoneCardView({ disabled, filter = {} }) {
  const { projectType } = useProjectTeam();
  const [items, setItems] = useState([
    { _id: "1" },
    { _id: "2" },
    { _id: "3" },
    { _id: "4" },
    { _id: "5" },
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Code ....
  const { location } = useHistory();
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const [projectId, setProjectId] = useState(null);
  const { data, isLoading } = useMilestones(
    orgId,
    location?.pathname.split("/")?.[3]
  );

  useEffect(() => {
    setProjectId(location?.pathname.split("/")[3]);
  }, []);

  useEffect(() => {
    setItems(data?.[3]?.milestonesData);
  }, [data?.[3]?.milestonesData]);

  const onFilterApply = () => {
    const { milestoneIds, status } = filter;
    return milestoneIds?.length || status?.length
      ? items?.map(
          (item, i) =>
            // test
            // (filter?.assigneeIds?.includes(row?.assignees?._id) ||
            (milestoneIds?.includes(item?._id) ||
              status?.includes(item?.status)) && (
              // platforms?.includes(item?.platform)
              <MilestoneCard
                info={item}
                distance={1}
                key={item?._id}
                projectId={projectId}
                disabled={disabled || milestoneIds?.includes(item?._id)}
                orgId={orgId}
                id={item?._id}
                handle={true}
                value={item?._id}
              />
            )
        )
      : items?.map((item, i) => (
          <MilestoneCard
            info={item}
            distance={1}
            key={item?._id}
            projectId={projectId}
            disabled={disabled}
            orgId={orgId}
            id={item?._id}
            handle={true}
            value={item?._id}
          />
        ));
  };

  return isLoading ? (
    <div
      className={ProjectCardCss.projectContainer2}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gridTemplateColumns: "repeat(auto-fill, minmax(25em, 1fr))",
      }}
    >
      {new Array(4).fill("").map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  ) : (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(({ _id }) => _id)}
        strategy={rectSortingStrategy}
      >
        <div className={ProjectCardCss.projectContainer2}>
          {!disabled && (
            <CommonDialog
              actionComponent={
                <AddMilestoneAction
                  className={ProjectCardCss.projectCard2}
                  projectType={projectType}
                />
              }
              modalTitle={
                projectType === "MARKETING"
                  ? "Create Segment"
                  : "Create Milestone"
              }
              content={
                <AddMilestoneContainer
                  milestonesData={data?.[3]?.milestonesData}
                  projectId={projectId}
                  orgId={orgId}
                  projectType={projectType}
                />
              }
              width={450}
            />
          )}
          {onFilterApply()}
          {/* {items.map((item) => (
          assigneeIds?.length ||
          taskIds?.length ||
          platforms?.length ||
          status?.length ||
          priority?.length &&  <MilestoneCard
              info={item}
              distance={1}
              key={item?._id}
              projectId={projectId}
              disabled={disabled}
              orgId={orgId}
              id={item?._id}
              handle={true}
              value={item?._id}
            />
          ))} */}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(({ _id }) => _id === active.id);
        const newIndex = items.findIndex(({ _id }) => _id === over.id);
        let tempArray = jsonParser(data?.[3]?.milestonesData ?? []);
        let tempValue = [...data?.[3]?.milestonesData];
        let finalArray = arrayMove(tempValue, oldIndex, newIndex);
        let tempIds = {};
        finalArray?.map((item, index) => {
          tempIds[item?._id] = index + 1;
          return null;
        });

        queryClient.setQueryData(["milestones", orgId, projectId], {
          milestones: [...finalArray],
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
              milestones: [...tempArray],
            });
          });

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

export default memo(MilestoneCardView);
