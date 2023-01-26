import React from "react";
import { useState } from "react";
import { useOrganisationUsers } from "react-query/organisations/useOrganisationUsers";
import CustomButton from "components/CustomButton";
import { useEffect } from "react";
import { useUpdateAssignees } from "react-query/projects/useUpdateAssignTeam";
import CustomAutoComplete from "components/CustomAutoComplete";
import { useSelector } from "react-redux";

const AssignProjectHead = ({
  orgId,
  projectId,
  projectHead,
  handleClose,
  projectTeam,
}) => {
  const [projectHeads, setProjectHeads] = useState([]);
  const [selectedProjectHead, setSelectedProjectHead] = useState(projectHead);
  const { isLoading, data } = useOrganisationUsers(orgId, projectId);
  console.log("useOrganisationUsers" , data)
  const selectedOrgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { mutateUpdateAssignTeam, isLoadingUpdateAssignTeam } =
    useUpdateAssignees(handleClose);

  useEffect(() => {
    let potentialProjectHeads = data?.users?.filter((user) =>
      user?.userType?.find(
        (type) =>
          type.organisation === selectedOrgId &&
          ["Admin", "Member++", "Member+"].includes(type.userType)
      )
    );

    // potentialProjectHeads should not contain any member from team
    potentialProjectHeads = potentialProjectHeads?.filter(
      (row) => !projectTeam.find((item) => item._id === row._id)
    );

    setProjectHeads(potentialProjectHeads);
  }, [data?.users]);

  const handleOnChange = (value) => {
    setSelectedProjectHead(value);
    //   let temp = projectHeads?.filter(
    //     ({ _id: id1 }) => !value.some(({ _id: id2 }) => id2 === id1)
    //   );
    //   setTeams([...temp]);
    //   setAssignees([...value]);
  };

  const handleSubmit = () => {
    let sendData = {
      orgId,
      projectId,
      data: {
        projectHead: selectedProjectHead?._id ?? "",
      },
    };
    mutateUpdateAssignTeam(sendData);
  };

  return (
    <>
      <CustomButton
        loading={isLoadingUpdateAssignTeam}
        disabled={isLoadingUpdateAssignTeam}
        onClick={handleSubmit}
      >
        Update
      </CustomButton>
      <CustomAutoComplete
        label="Select Project Head"
        isLoading={isLoading}
        value={selectedProjectHead}
        options={projectHeads}
        onChange={handleOnChange}
        disableClearable={false}
      />
    </>
  );
};

export default AssignProjectHead;
