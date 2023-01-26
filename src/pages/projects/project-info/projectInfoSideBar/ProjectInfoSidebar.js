import React, { useRef } from "react";
import projectCard from "css/ProjectCard.module.css";
import CustomAvatar from "components/CustomAvatar";

import css from "css/ProjectInfo.module.css";
import { useSelector } from "react-redux";
import SecurityOutlinedIcon from "@material-ui/icons/SecurityOutlined";
import GrainIcon from "@material-ui/icons/Grain";
import {  capitalizeFirstLetter } from "utils/textTruncate";

import { useState } from "react";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";

import { IconButton } from "@material-ui/core";

import { useUpdateProject } from "react-query/projects/useUpdateProject";

import { useDeleteProject } from "react-query/projects/useDeleteProject";
import CustomRow from "components/CustomRow";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import { useUpdateAssignees } from "react-query/projects/useUpdateAssignTeam";
import CloseButton from "components/CloseButton";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CustomButton from "components/CustomButton";
import ProjectInfoSideBarAbout from "./ProjectInfoSideBarAbout";
import ProjectInfoSidebarActivity from "./ProjectInfoSidebarActivity";




function ProjectInfoSidebar({ info, toggle, team, disabled }) {
  const [activeTab, setActiveTab] = useState("about");
  
  const { mutateUpdateAssignTeam } = useUpdateAssignees();
  const { mutateDeleteProject, isDeleteMutateLoading } = useDeleteProject();
  const userType = useSelector((state) => state.userReducer?.userType);
  const adminAccessDisable = !["Admin", "Member++"].includes(
    userType?.userType
  );
  const editorRef = React.useRef("");

  const logo_ref = useRef();


  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation._id
  );
  const { mutateUpdateProject } = useUpdateProject();

  const [projectLogo, setProjectLogo] = useState(null);




  const onValueChange = (value, undefined, key, otherKey, logo) => {
    let formData = new FormData();
    logo
      ? formData.append("logo", logo, logo?.name ?? "")
      : formData.append(
          [key],
          Array.isArray(value)
            ? JSON.stringify(value)
            : value === "On Hold"
            ? "OnHold"
            : value
        );

        if(key === "status" && value !== "On Hold"){
          formData.append("onHoldReason", "")
        }
    let sendData = {
      orgId: orgId,
      projectId: info?._id,
      formData,
      key: key,
      paymentInfo: ["amount", "currency", "paymentMode"].includes(key),
      clientData: ["client", "clientEmail", "clientCountry"].includes(key),
      projectLogo: logo ? true : false,
      isArray: Array.isArray(value),
      accessKey: otherKey,
    };

    mutateUpdateProject(sendData);
  };


  const setProjectIcon = (e) => {
    setProjectLogo((prevState) => e.target.files[0]);
    onValueChange(
      undefined,
      undefined,
      undefined,
      undefined,
      e.target.files[0]
    );
  };

  const onTeamMemberUpdate = ({ assigneeData }) => {
    let projectHeadData = {};
    let projectHeadId = "";
    let teamData = [];
    let teamIds = [];
    assigneeData?.map((item) => {
      if (item?.projectHead) {
        projectHeadId = item?._id;
        projectHeadData = item;
      } else {
        teamIds.push(item?._id);
        teamData?.push(item);
      }
      return null;
    });
    mutateUpdateAssignTeam({
      data: {
        projectHead: projectHeadId,
        team: teamIds,
      },
      projectHeadData,
      teamData,
      orgId,
      projectId: info?._id,
    });
  };
  return (
    <div>
      <div className={`${css.sidebarHeader} my-1`}>
        <div className="d_flex" style={{ width: "100%" }}>
          <div className="d_flex flex">
            <div className="logo_wrap " style={{ position: "relative" }}>
              <IconButton
                style={{ padding: 0, position: "relative" }}
                onClick={() => !disabled && logo_ref.current.click()}
              >
                {info?.logo || projectLogo ? (
                  <CustomAvatar
                    src={
                      projectLogo
                        ? URL.createObjectURL(projectLogo)
                        : info?.logo
                    }
                    large
                    className={css.avatar}
                  />
                ) : (
                  <div
                    className={css.avatar}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--logo)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 36,
                        color: "#FFF",
                        textTransform: "capitalize",
                      }}
                    >
                      {" "}
                      {info?.title[0]}
                    </p>
                  </div>
                )}
                {!disabled && (
                  <AddAPhotoOutlinedIcon
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -5,
                      zIndex: 1,
                      color: "var(--defaultWhite)",
                    }}
                  />
                )}
              </IconButton>
              <div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={logo_ref}
                  name="projectLogo"
                  accept="image/jpeg, image/png"
                  onChange={setProjectIcon}
                />
              </div>
            </div>
            <div className="ml-1 flex">
              <CustomRow
                value={capitalizeFirstLetter(info?.title)}
                inputType="text"
                apiKey="title"
                onChange={
                  !disabled
                    ? onValueChange
                    : undefined
                }
                valueClassName={`${projectCard.ProjectTitle} pl-0`}
                inputTextClassName="titleInput"
                nonTruncate
              />
              <div className="d_flex alignCenter m-1 ml-0">
                <AssigneeSelection
                  multiple
                  orgId={
                    ["Admin", "Member++"].includes(userType?.userType) ||
                    team?.filter(
                      (item) =>
                        item?._id === userType?.userId &&
                        item?.projectHead === true
                    ).length > 0
                      ? orgId
                      : undefined
                  }
                  projectId={info?._id}
                  team={team}
                  assignee={team}
                  onChange={onTeamMemberUpdate}
                  isProjectManager
                  plusDisable
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          <CloseButton
            onClick={toggle}
            type="text"
            isLoading={isDeleteMutateLoading}
            mutate={mutateDeleteProject}
            data={{
              data: "",
              orgId,
              projectId: info._id,
            }}
            otherFunction={toggle}
            normalClose={!adminAccessDisable}
          />
        </div>
      </div>

      {/* <div
        className="my-1"
        style={{
          borderBottom: "3px solid var(--divider)",
          height: 10,
          width: "100%",
        }}
      /> */}

      {/* TODO: Activity Tab */}
       <div className="btwrap my-3">
<BtnWrapper style={{ width: "220px" , margin : 0}}>
              <CustomButton
                type={activeTab === "activity" ? "contained" : "text"}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </CustomButton>
              <CustomButton
                type={activeTab === "about" ? "contained" : "text"}
                onClick={() => setActiveTab("about")}
              >
                About
              </CustomButton>
              <div />
            </BtnWrapper>
            </div>
  
{/* TODO: make my-3 t0 my-1*/}
  <div className="my-1" >
    
    {
      activeTab === "about" ? 
      <ProjectInfoSideBarAbout 
    info={info} 
     disabled={disabled} 
      onValueChange={onValueChange}
       userType={userType}
    /> 
  :
  <ProjectInfoSidebarActivity
  orgId={orgId}
  projectId={info?._id}
  />
  }
  </div>
    </div>
  );
}

export default React.memo(ProjectInfoSidebar);
