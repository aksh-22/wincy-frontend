import CommonDialog from "components/CommonDialog";
import CustomButton from "components/CustomButton";
import ProjectAdd from "pages/projects/project-add/ProjectAdd";
import { useProjects } from "react-query/projects/useProjects";
import React, { useState } from "react";
import ProjectCardCss from "css/ProjectCard.module.css";
import ProjectAddModalContent from "./project-add/ProjectAddModalContent";
import NoData from "components/NoData";

import ProjectCardSkeleton from "skeleton/projectCard/ProjectCardSkeleton";
import ProjectCardN from "./Project-card_new/ProjectCard";
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import { useSelector } from "react-redux";
import Organisation from "pages/organisation/Organisation";

export default function Projects({ projectType }) {
  const [activeProjectType, setActiveProjectType] = useState(0);
  const [projectStatus, setProjectStatus] = useState("Active");
  const userProfile = useSelector(
    (state) => state.userReducer?.userData?.user?.userType
  );
  const userType = useSelector((state) => state.userReducer?.userType);

  const handleActiveProject = (idx) => {
    setActiveProjectType(idx);
    if (idx === 0) {
      setProjectStatus("Active");
    } else if (idx === 1) {
      setProjectStatus("Completed");
    } else {
      setProjectStatus("OnHold");
    }
  };
  const { isLoading, data, isError } = useProjects(projectStatus, projectType);

  return isError ? (
    <NoData error errorStyleEnable />
  ) : (
    <div
      className="p-2"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {userProfile?.length <= 0 && <Organisation />}
      {userProfile?.length > 0 && (
        <BtnWrapper>
          <CustomButton
            onClick={() => handleActiveProject(0)}
            type={activeProjectType === 0 ? "contained" : "text"}

            // style={{ marginRight: 10 }}
          >
            Active Projects
          </CustomButton>
          <CustomButton
            onClick={() => handleActiveProject(1)}
            // style={{ marginRight: "10px" }}
            type={activeProjectType === 1 ? "contained" : "text"}
          >
            Completed Projects
          </CustomButton>
          <CustomButton
            onClick={() => handleActiveProject(2)}
            // style={{ marginRight: "10px" }}
            type={activeProjectType === 2 ? "contained" : "text"}
          >
            On Hold Projects
          </CustomButton>
        </BtnWrapper>
      )}
      <div
        className={ProjectCardCss.projectContainer}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        {activeProjectType === 0 &&
          !isLoading &&
          ["Admin", "Member++"].includes(userType?.userType) && (
            <CommonDialog
              actionComponent={
                <ProjectAdd className={ProjectCardCss.projectCard} />
              }
              modalTitle="Create Project"
              content={<ProjectAddModalContent projectType={projectType} />}
              width={450}
              // height={300}
            />
          )}

        {isLoading &&
          Array(activeProjectType === 0 ? 4 : 4)
            .fill("")
            .map((x, i) => <ProjectCardSkeleton key={i * Math.random()} />)}

        {/* <ProjectCardN /> */}

        {data?.projects?.map((info, i) => (
          <ProjectCardN key={info._id} info={info} />
          // <ProjectCard key={i} info={info} />
        ))}
      </div>
      {!data?.projects?.length && !isLoading && activeProjectType !== 0 && (
        <NoData />
      )}
      {!data?.projects?.length &&
        !isLoading &&
        activeProjectType === 0 &&
        ["Member++", "Member"].includes(userType?.userType) && <NoData />}
    </div>
  );
}
