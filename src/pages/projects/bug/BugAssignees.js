// TODO: Delete File and reference
import React from "react";
import { useState } from "react";
// import { useOrganisationUsers } from "react-query/organisations/useOrganisationUsers";
import CustomButton from "components/CustomButton";
import { useEffect } from "react";
// import { useUpdateAssignees } from "react-query/projects/useUpdateAssignTeam";
import CustomAutoComplete from "components/CustomAutoComplete";
// import { useSelector } from "react-redux";
import { useUpdateBug } from "react-query/bugs/useUpdateBug";
import { useUpdateTask } from "react-query/milestones/task/useUpdateTask";
import { useMyworkUpdateBug } from "react-query/mywork/useMyworkUpdateBug";

const BugAssignees = ({
  orgId,
  bugId,
  projectInfo,
  currentAssignee,
  handleClose,
  pageNo,
  platform,
  hideButton,
  type,
  currentMilestoneId,
  fromModule,
}) => {
  // projectInfo?.projectHead && projectInfo?.projectHead,
  const [team, setTeam] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(
    currentAssignee || { name: "" }
  );
  const { mutateUpdateBug, isLoadingUpdateBug } = useUpdateBug(
    orgId,
    projectInfo?._id,
    platform,
    pageNo,
    handleClose
  );

  const { isLoadingMyworkUpdateBug, mutateMyworkUpdateBug } =
    useMyworkUpdateBug(orgId, projectInfo?._id, pageNo, handleClose, platform);

  const { isLoading: isLoadingTask, mutate: mutateUpdateTask } =
    useUpdateTask(handleClose);

  useEffect(() => {
    // alert('aa');

    let tempTeam = team.filter((x) => x?._id !== currentAssignee?._id);
    setTeam([...tempTeam]);
    //   // setProjectHeads(potentialProjectHeads);
  }, [currentAssignee?._id]);
  useEffect(() => {
    let tempTeam = [];
    if (
      projectInfo?.projectHead &&
      projectInfo?.projectHead?._id !== currentAssignee?._id
    ) {
      tempTeam.push(projectInfo?.projectHead);
    }

    let localTeam = projectInfo?.team.filter(
      (x) => x._id !== currentAssignee?._id
    );

    if (localTeam) {
      tempTeam = [...tempTeam, ...localTeam];
    }
    setTeam(tempTeam);
  }, [projectInfo]);

  const handleOnChange = (value) => {
    let tempTeam = team.filter((x) => x?._id !== value?._id);
    selectedAssignee?.name
      ? setTeam([selectedAssignee, ...tempTeam])
      : setTeam([...tempTeam]);
    setSelectedAssignee(value);
  };

  const handleSubmit = () => {
    if (type === "subTask") {
      mutateUpdateTask({
        taskId: bugId,
        data: {
          assignee: selectedAssignee?._id ?? "",
        },
        orgId: orgId,
        milestoneId: currentMilestoneId,
        assignee: true,
      });
    } else {
      let sendData = {
        orgId: orgId,
        bugId: bugId,
        data: {
          assignee: selectedAssignee?._id ?? "",
        },
        additionalInfo: {
          assignee: selectedAssignee,
        },
      };

      if (fromModule === "mywork") {
        mutateMyworkUpdateBug(sendData);
      } else {
        mutateUpdateBug(sendData);
      }
    }
  };
  return (
    <>
      <CustomAutoComplete
        width={200}
        label="Select Assignee"
        // isLoading={isLoading}
        value={selectedAssignee}
        options={team}
        onChange={handleOnChange}
      />
      {!hideButton && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 10,
            backgroundColor: "var(--lightGray)",
          }}
        >
          <CustomButton
            // loading={
            //   fromModule === "mywork"
            //     ? isLoadingMyworkUpdateBug
            //     : type === "subTask"
            //     ? isLoadingUpdateBug
            //     : false
            // }
            loading={
              fromModule === "mywork"
                ? isLoadingMyworkUpdateBug
                : type === "subTask"
                ? isLoadingTask
                : isLoadingUpdateBug
            }
            // loading={type === "subTask" ? isLoadingTask : isLoadingUpdateBug}
            disabled={
              fromModule === "mywork"
                ? isLoadingMyworkUpdateBug
                : type === "subTask"
                ? isLoadingTask
                : isLoadingUpdateBug
            }
            onClick={handleSubmit}
          >
            Update
          </CustomButton>
        </div>
      )}
    </>
  );
};

export default BugAssignees;
