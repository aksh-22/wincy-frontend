import React, { useState } from "react";
import { useAddRemoveCredentials } from "react-query/projects/useAddRemoveCredentials";
import TextField from "@material-ui/core/TextField";
import { IconButton } from "@material-ui/core";
import { LightTooltip } from "components/tooltip/LightTooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CustomRow from "components/CustomRow";
import Checkbox from "@material-ui/core/Checkbox";
import CommonDelete from "components/CommonDelete";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import classes from "./Credentials.module.css";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
function Credentials({
  orgId,
  projectId,
  showAddCredentials,
  setShowAddCredentials,
  projectCredentials,
  disabled,
}) {
  const { isLoadingCredentials, mutateCredentials } = useAddRemoveCredentials(
    orgId,
    projectId
  );
  const [error, setError] = useState({
    platform: "",
    username: "",
    password: "",
  });
  const [credentials, setCredentials] = useState({
    platform: "",
    username: "",
    password: "",
  });
  const [isSelected, setIsSelected] = useState([]);

  const onChangeCredentials = (e, type, key) => {
    if (type === undefined) {
      setCredentials({
        ...credentials,
        [e.target.name]: e.target.value,
      });

      error[e.target.name] !== "" &&
        setError({
          ...error,
          [e.target.name]: "",
        });
    } else {
      setError((previousState) => ({
        ...previousState,
        [key]: e,
      }));
    }
  };

  const onAddCredentials = () => {
    const { platform, username, password } = credentials;

    let validate = false;
    console.log("platform", platform);
    if (!platform?.trim()?.length) {
      onChangeCredentials("Platform Field is required", "", "platform");
      validate = true;
    }

    if (!username?.trim()?.length) {
      onChangeCredentials("Username Field is required", "", "username");
      validate = true;
    }

    if (!password?.trim()?.length) {
      onChangeCredentials("Password Field is required", "", "password");
      validate = true;
    }

    if (!validate) {
      mutateCredentials({
        data: {
          addCredentials: [credentials],
        },
        orgId,
        projectId,
        setShowAddCredentials,
      });
      setCredentials({
        platform: "",
        username: "",
        password: "",
      });
    }
  };

  // Multiple Select

  const onSelect = (id) => {
    if (isSelected.includes(id)) {
      setIsSelected(isSelected.filter((item) => item !== id));
    } else {
      setIsSelected([id, ...isSelected]);
    }
  };

  // Update Credentials
  const onUpdateCredentials = (data) => {
    mutateCredentials({
      data: {
        updateCredentials: [data],
      },
      orgId,
      projectId,
    });
  };

  console.log("projectInfo", projectCredentials);
  return (
    <div>
      <div className={classes.credentialsRow}>
        {/* <div> */}
        {/* <LockOutlinedIcon /> */}
        {/* </div> */}
        <p></p>
        <p className="pl-1">Platform</p>
        <p className="pl-1">User Id</p>
        <p className="pl-1">Password</p>
        <p></p>
      </div>
      {showAddCredentials && (
        <div className={classes.credentialsRowEl} style={{ height: "auto" }}>
          <div></div>
          <TextField
            onChange={onChangeCredentials}
            onKeyPress={(e) => e.key === "Enter" && onAddCredentials(e)}
            helperText={error.platform}
            placeholder="Platform Name"
            name="platform"
            error={error.platform ? true : false}
            value={credentials.platform}
            inputProps={{ maxLength: 36 }}
            className="pr-1 pl-1"
            autoFocus
          />

          <TextField
            onChange={onChangeCredentials}
            onKeyPress={(e) => e.key === "Enter" && onAddCredentials(e)}
            helperText={error.username}
            placeholder="Username or Email"
            name="username"
            error={error.username ? true : false}
            value={credentials.username}
            inputProps={{ maxLength: 36 }}
            className="pr-1"
          />

          <TextField
            onChange={onChangeCredentials}
            onKeyPress={(e) => e.key === "Enter" && onAddCredentials(e)}
            helperText={error.password}
            placeholder="Password"
            name="password"
            error={error.password ? true : false}
            value={credentials.password}
            inputProps={{ maxLength: 36 }}
          />

          <LightTooltip title="Add Credential">
            <IconButton onClick={onAddCredentials}>
              <div
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: "var(--lightBlue)",
                  borderRadius: "50%",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <AddRoundedIcon
                  //   onClick={() => setShowAddMilestone(!showAddMilestone)}
                  style={{
                    marginLeft: 2,
                    color: "var(--defaultWhite)",
                    fontSize: 26,
                  }}
                  type={"contained"}
                  // backgroundColor="secondary"
                />
              </div>
            </IconButton>
          </LightTooltip>
        </div>
      )}

      {projectCredentials?.map((item, index) => (
        <ProjectCredentialsRow
          key={item?._id}
          data={item}
          isSelected={isSelected}
          onUpdateCredentials={onUpdateCredentials}
          onSelect={onSelect}
          orgId={orgId}
          projectId={projectId}
          mutate={mutateCredentials}
          isLoading={isLoadingCredentials}
          disabled={disabled}
        />
      ))}

      <BottomActionBar
        isSelected={isSelected}
        data={{
          data: {
            removeCredentials: isSelected,
          },
          orgId,
          projectId,
          onToggle: () => setIsSelected([]),
        }}
        onClose={() => setIsSelected([])}
        mutate={mutateCredentials}
        isLoading={isLoadingCredentials}
        onDelete
      />
    </div>
  );
}

export default Credentials;

function ProjectCredentialsRow({
  data,
  isSelected,
  onSelect,
  mutate,
  isLoading,
  orgId,
  projectId,
  onUpdateCredentials,
  disabled,
}) {
  console.log(data);
  const updateCredentials = (value, field, key) => {
    console.log(value, key);
    onUpdateCredentials({
      [key]: value,
      _id: data?._id,
    });
  };
  return (
    <div className={classes.credentialsRowEl}>
      <div
        // className={classes.checkBox}
        // style={{
        //   width: !isSelected.length > 0 ? "10%" : "90%",
        // }}
        className={`subMilestone_sideLine d_flex alignCenter ${
          isSelected.length !== 0 ? "rowSelected" : ""
        } `}
      >
        <Checkbox
          size="small"
          checked={isSelected?.includes(data?._id)}
          onClick={() => onSelect(data?._id)}
          // style={{ display: !isSelected.length > 0 ? "none" : "block" }}
        />
      </div>
      <div
        style={{
          overflow: "hidden",
          paddingLeft: 10,
        }}
      >
        <CustomRow
          value={data?.platform}
          apiKey={"platform"}
          inputType="text"
          onChange={updateCredentials}
          containerClassName="pl-0"
          disabled={disabled}
          inputStyle={{ border: "1px solid var(--lightBlue)" }}
        />
      </div>
      <div
        style={{
          overflow: "hidden",
          paddingLeft: 10,
        }}
      >
        <CustomRow
          value={data?.username}
          apiKey={"username"}
          inputType="text"
          onChange={updateCredentials}
          disabled={disabled}
          inputStyle={{ border: "1px solid var(--lightBlue)" }}
        />
      </div>
      <div
        style={{
          overflow: "hidden",
          paddingLeft: 10,
        }}
      >
        <CustomRow
          value={data?.password}
          apiKey={"password"}
          inputType="text"
          onChange={updateCredentials}
          disabled={disabled}
          inputStyle={{ border: "1px solid var(--lightBlue)" }}
        />
      </div>
      {!disabled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CommonDelete
            mutate={mutate}
            isLoading={isLoading}
            data={{
              data: {
                removeCredentials: [data?._id],
              },
              orgId,
              projectId,
            }}
          />{" "}
        </div>
      )}
    </div>
  );
}
