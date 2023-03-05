import CustomChip from "components/CustomChip";
import CustomProgressBar from "components/customProgressBar/CustomProgressBar";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useProjectTeam } from "hooks/useUserType";
import MilestoneInfoSidebar from "pages/projects/milestone/MilestoneInfoSidebar";
import React, { memo, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useMilestoneInfo } from "react-query/milestones/useMilestoneInfo";
import { useMilestones } from "react-query/milestones/useMilestones";
import { useHistory } from "react-router";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { capitalizeFirstLetter } from "utils/textTruncate";
import ModuleWrapper from "../../kanban-view/module/ModuleWrapper";
import AddNewModule from "./milestone-module/AddNewModule";
import "./milestone-module/MilestoneModule.scss";
import MilestoneChanger from "./milestoneChanger/MilestoneChanger";
import MilestoneModuleDraggable from "./MilestoneModuleDraggable";

function MilestoneModuleTable({ viewType, orgId, milestoneId, projectId }) {
  const { actionDisabled, platforms } = useProjectTeam();
  const { location, push } = useHistory();
  const queryClient = useQueryClient();
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const { data } = useMilestoneInfo(orgId, projectId, milestoneId);
  const { data: milestonesList } = useMilestones(orgId, projectId);
  useEffect(() => {
    const milestones = queryClient.getQueryData([
      "milestones",
      orgId,
      projectId,
    ]);
    const tempCurrentMilestone = milestones?.milestones?.find(
      (item) => item?._id === milestoneId
    );
    setCurrentMilestone(tempCurrentMilestone);
    // setSelectedMilestone(data?.milestone);
  }, [data, milestonesList]);
  // const [selectedMilestone, setSelectedMilestone] = useState({});

  const milestoneInfo = location?.state?.milestoneInfo;
  const [milestoneInfoToggle, setMilestoneInfoToggle] = useState(false);

  const toggleMilestoneInfo = (e) => {
    e?.stopPropagation();
    setMilestoneInfoToggle(!milestoneInfoToggle);
  };
  // const getMilestoneCompletionPercentage = () => {
  //   let percentage =
  //     (parseInt(currentMilestone?.taskCount?.Completed ?? 0) /
  //       (parseInt(currentMilestone?.taskCount?.NotStarted ?? 0) +
  //         parseInt(currentMilestone?.taskCount?.Completed ?? 0) +
  //         parseInt(currentMilestone?.taskCount?.Active ?? 0))) *
  //     100;

  //   return isNaN(percentage) ? 0 : percentage;
  // };

  return (
    <div className="containerMilestoneView">
      <div
        style={{
          // background: "var(--projectCardBg)",
          borderRadius: 4,
          // padding: 10,
          marginBottom: 20,
          maxWidth: viewType === "kanban" ? "91vw" : "95vw",
        }}
      >
        <MilestoneChanger
          currentMilestone={capitalizeFirstLetter(
            data?.milestone?.title ?? milestoneInfo?.title
          )}
          orgId={orgId}
          projectId={projectId}
          milestoneInfo={currentMilestone}
          toggleMilestoneInfo={toggleMilestoneInfo}
        />
        {/* <div className="d_flex">
          <MilestoneChanger
            currentMilestone={capitalizeFirstLetter(
              data?.milestone?.title ?? milestoneInfo?.title
            )}
            orgId={orgId}
            projectId={projectId}
          />
          <div className="flex justifyContent_end alignCenter">
            <LightTooltip title="Info" arrow>
              <div className="alignCenter" onClick={toggleMilestoneInfo}>
                <Icon
                  name="info"
                  style={{ marginRight: 10, cursor: "pointer" }}
                />
              </div>
            </LightTooltip>
            <CustomChip
              label={addSpaceUpperCase(
                milestoneInfo?.status ?? data?.milestone?.status
              )}
            />
          </div>
        </div> */}

        {/* <CustomProgressBar value={getMilestoneCompletionPercentage().toFixed()} /> */}
      </div>

      {viewType === "kanban" ? (
        <ModuleWrapper
          projectId={projectId}
          milestoneId={milestoneId}
          orgId={orgId}
          disabled={actionDisabled}
        />
      ) : (
        <>
          <MilestoneModuleDraggable
            projectId={projectId}
            milestoneId={milestoneId}
            orgId={orgId}
            disabled={actionDisabled}
            isPlatformShow={!!platforms?.length}
          />
        </>
      )}

      <CustomSideBar show={milestoneInfoToggle} toggle={toggleMilestoneInfo}>
        <MilestoneInfoSidebar
          orgId={orgId}
          projectId={projectId}
          milestoneId={milestoneId}
          disabled={actionDisabled}
        />
      </CustomSideBar>
    </div>
  );
}

export default memo(MilestoneModuleTable);

// function SelectRender({ item, css }) {
//   return (
//     <div
//       className={`${"css?.selectRo1w"} normalFont d_flex alignCenter`}
//       style={
//         {
//           // background:"red"
//         }
//       }
//     >
//       {/* <CustomAvatar src={item?.profilePicture} small variant="circle" /> */}
//       <p className="" style={{ color: "#FFF" }}>
//         {capitalizeFirstLetter(item?.title)}
//       </p>
//     </div>
//   );
// }
