import { TextField } from "@material-ui/core";
import CustomButton from "components/CustomButton";
import CustomSelect from "components/CustomSelect";
import moment from "moment";
import React, { useState } from "react";
import { useAddProject } from "react-query/projects/useAddProject";
import { useSelector } from "react-redux";

export default function ProjectAddModalContent({ handleClose, projectType }) {
  const [platform, setPlatform] = React.useState([]);
  const [technology, setTechnology] = React.useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState({});
  const platforms = useSelector(
    (state) => state.userReducer?.userData?.platforms
  );
  const technologies = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );

  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { mutate, isLoading } = useAddProject(handleClose);

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
    removeError("platform");
  };
  const handleTechnologyChange = (event) => {
    setTechnology(event.target.value);
    removeError("technology");
  };

  const removeError = (key) => {
    setError({
      ...error,
      [key]: "",
    });
  };
  const validate = () => {
    let titleError = "",
      platformError = "",
      technologyError = "";

    if (!title) titleError = "Required!";
    if (projectType === "DEVELOPMENT") {
      if (!platform?.length) platformError = "Required!";
      if (!technology?.length) technologyError = "Required!";
    }

    if (titleError || platformError || technologyError) {
      setError({
        ...error,
        title: titleError,
        platform: platformError,
        technology: technologyError,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      setError({});
      let data = new FormData();
      data.append("title", title);
      if (projectType === "DEVELOPMENT") {
        data.append("platforms", JSON.stringify(platform));

        data.append("technologies", JSON.stringify(technology));
      }

      data.append("startedAt", moment(new Date()).format("MM-DD-YYYY"));

      data.append("projectType", projectType);

      let sendData = {
        data: data,
        orgId: orgId,
      };
      mutate(sendData);
    }
  };

  return (
    <div className="selectPopOver">
      <TextField
        label="Title"
        fullWidth
        onChange={(e) => {
          setTitle(e.target.value);

          e.target.value?.length < 2 &&
            setError({
              ...error,
              title: "",
            });
        }}
        className="mb-1"
        InputProps={{ className: "normalFont" }}
        InputLabelProps={{ className: "normalFont" }}
        autoFocus
        helperText={error?.title}
        error={error?.title ? true : false}
      />
      {/* {error?.title && <p className="validationError">{error?.title}</p>} */}
      {projectType === "DEVELOPMENT" && (
        <>
          <CustomSelect
            inputLabel="Platforms"
            handleChange={handlePlatformChange}
            errorText={error?.platform ?? ""}
            value={platform}
            menuItems={platforms}
            multiple
            labelClassName={"normalFont"}
            containerClassName="mb-1"
            className="flex"
          />

          <CustomSelect
            inputLabel="Technologies"
            handleChange={handleTechnologyChange}
            errorText={error?.technology ?? ""}
            value={technology}
            menuItems={technologies}
            multiple
            labelClassName={"normalFont flex"}
            className="flex"
          />
        </>
      )}

      <div style={{ float: "right", marginTop: 20 }}>
        <CustomButton
          onClick={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
        >
          Create
        </CustomButton>
      </div>
    </div>
  );
}
