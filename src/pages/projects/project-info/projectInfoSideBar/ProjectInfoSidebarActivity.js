import { LightTooltip } from "components/tooltip/LightTooltip";
import moment from "moment";
import React from "react";
import { useBugActivity } from "react-query/bugs/useBugActivity";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { capitalizeFirstLetter } from "utils/textTruncate";
import "./ProjectInfoSidebar.scss";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
function ProjectInfoSidebarActivity({ orgId, projectId }) {
  const { bugActivity, bugActivityLoading } = useBugActivity(
    orgId,
    "project",
    projectId
  );
  console.log("data", bugActivity?.activities);
  return (
    <div>
      {bugActivityLoading ? (
        <TableRowSkeleton count={5} />
      ) : (
        bugActivity?.activities?.map((item, index) => (
          <ActivityRow
            item={item}
            key={index}
            pointerNone={bugActivity?.activities?.length - 1 === index}
          />
        ))
      )}
    </div>
  );
}

export default ProjectInfoSidebarActivity;

const ActivityRow = ({ item, pointerNone }) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div className="project_activity_row boxShadow">
        <div className="spanBox">
          {moment(item?.createdAt).format("DD")}

          <span> {moment(item?.createdAt).format("MMM")}</span>
        </div>
        <div className="d_flex flex">
          <div className="flex">
            <p className="activityName_activity">
              {item?.field === "description" ? (
                `${item?.type} description updated.`
                // <div
                //   dangerouslySetInnerHTML={{ __html: item?.description }}
                // ></div>
              ) : (
                item?.description ?? "N/A"
              )}
            </p>
            <p className="userName_activity">
              By {capitalizeFirstLetter(item?.createdBy?.name)}
            </p>
            <p className="userName_activity">
            {moment(item?.createdAt).format("LT")}
            </p>
          </div>
          {item?.meta?.title && (
            <LightTooltip
              title={item?.meta ? capitalizeFirstLetter(item?.meta?.title) : ""}
              arrow
            >
              <InfoRoundedIcon />
            </LightTooltip>
          )}
        </div>
      </div>
      {!pointerNone && <div className="line-vertical arrow-up arrow-down" />}
    </div>
  );
};
