import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { useState } from "react";
import { useOrganisationUsers } from "react-query/organisations/useOrganisationUsers";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomAvatar from "components/CustomAvatar";
import CustomChip from "components/CustomChip";
import CustomButton from "components/CustomButton";
import { useEffect } from "react";
import { useUpdateAssignees } from "react-query/projects/useUpdateAssignTeam";
import CustomAutoComplete from "components/CustomAutoComplete";

const AssignProjectTeam = ({
  orgId,
  projectId,
  projectHead,
  projectTeam,
  handleClose,
}) => {
  console.log("Assignee Team Render")
  const [assignees, setAssignees] = useState([...projectTeam]);
  const { isLoading, data } = useOrganisationUsers(orgId, projectId);
  const { mutateUpdateAssignTeam, isLoadingUpdateAssignTeam } =
    useUpdateAssignees(handleClose);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let users = data?.users?.filter((user) => user?._id !== projectHead?._id);

    let temp = users?.filter(
      ({ _id: id1 }) => !projectTeam.some(({ _id: id2 }) => id2 === id1)
    );
    setTeams(temp);
  }, [data?.users]);

  const handleOnChange = (value) => {
    let temp = teams?.filter(
      ({ _id: id1 }) => !value.some(({ _id: id2 }) => id2 === id1)
    );
    setTeams([...temp]);
    setAssignees([...value]);
  };

  const handleRemove = (id) => {
    let temp = assignees?.filter((x) => x?._id !== id);

    let teamToAdd = data?.users?.filter((y) => y?._id === id);
    setAssignees([...temp]);
    setTeams([...teams, teamToAdd[0]]);
  };

  const handleSubmit = () => {
    let teamArr = [];
    assignees?.map((x) => teamArr.push(x?._id));
    let sendData = {
      orgId,
      projectId,
      data: {
        team: teamArr,
      },
    };

    mutateUpdateAssignTeam(sendData);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 10,
          backgroundColor: "var(--lightGray)",
        }}
      >
        <CustomButton
          loading={isLoadingUpdateAssignTeam}
          disabled={isLoadingUpdateAssignTeam}
          onClick={handleSubmit}
        >
          Update
        </CustomButton>
      </div>
      
      <CustomAutoComplete
        label="Select Assignees"
        isLoading={isLoading}
        value={assignees}
        options={teams}
        onChange={handleOnChange}
        multiple
        width={400}
        handleRemove={handleRemove}
      />
    </>
  );
};

export default AssignProjectTeam;
