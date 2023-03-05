import CustomButton from "components/CustomButton";
import TextInput from "components/textInput/TextInput";
import React, { useState, memo } from "react";
import { useAddMilestone } from "react-query/milestones/useAddMilestone";

const AddMilestoneContainer = memo(
  ({ milestonesData, handleClose, projectId, orgId, projectType }) => {
    const [milestoneTitle, setMilestoneTitle] = useState("");
    const [error, setError] = useState("");
    const [loadingButton, setLoadingButton] = useState("");
    const { mutate, isLoading } = useAddMilestone(handleClose);
    const onSubmit = (buttonType) => () => {
      const tempData = milestonesData?.filter(
        (item) =>
          item?.title?.toLowerCase()?.trim() ===
          milestoneTitle.toLowerCase()?.trim()
      );
      if (tempData.length) {
        return setError("Milestone name already exists.");
      }
      if (!milestoneTitle?.trim()) {
        return setError("Milestone name is required.");
      }
      setLoadingButton(buttonType);

      let data = {
        projectId: projectId,
        orgId: orgId,
        buttonType: buttonType,
        data: {
          title: milestoneTitle,
        },
      };
      mutate(data);
      setMilestoneTitle("");
    };
    return (
      <div className="inheritParent">
        <TextInput
          className="inheritParent"
          autoFocus
          //   placeholder="Milestone Title *"
          label={
            projectType === "MARKETING" ? "Section Title" : "Milestone Title"
          }
          value={milestoneTitle}
          onChange={(e) => {
            setMilestoneTitle(e.target.value);
            setError("");
          }}
          error={error ? true : false}
          helperText={error}
          onKeyPress={(e) => {
            if (e.key === "Enter") onSubmit("save")();
          }}
        />

        <div className="alignCenter justifyContent_between mt-2">
          <CustomButton
            // loading={loadingButton === "save" ? isLoading : false}
            // disabled={isLoading}
            onClick={onSubmit("save")}
          >
            Save
          </CustomButton>

          <CustomButton
            // loading={loadingButton === "save&close" ? isLoading : false}
            // disabled={isLoading}
            onClick={onSubmit("save&close")}
          >
            Save & Close
          </CustomButton>
        </div>
      </div>
    );
  }
);

export default AddMilestoneContainer;
