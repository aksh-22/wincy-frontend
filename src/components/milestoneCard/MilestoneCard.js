import EventIcon from "@mui/icons-material/Event";
import CustomProgressBar from "components/customProgressBar/CustomProgressBar";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import moment from "moment";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "utils/textTruncate";
import "./MilestoneCard.scss";

const getProjectProgress = (milestoneCount) => {
  if (!milestoneCount) {
    return 0;
  } else if (!milestoneCount.Completed) {
    return 0;
  } else {
    let denominator =
      (milestoneCount.Active ?? 0) +
      (milestoneCount?.NotStarted ?? 0) +
      (milestoneCount?.Completed ?? 0) +
      (milestoneCount?.UnderReview ?? 0) +
      (milestoneCount?.ReviewFailed ?? 0) +
      (milestoneCount?.WaitingForReview ?? 0);
    return (milestoneCount?.Completed / denominator) * 100;
  }
};

function MilestoneCard({ info, isDragging, projectId, disabled, orgId }) {
  return (
    <Link
      style={{ color: "white" }}
      to={{
        pathname: `/main/projects/${projectId}/${info?._id}`,
        state: { _id: info?._id, module: true, milestoneInfo: info },
      }}
    >
      <div
        className="milestoneCard"
        style={{
          backgroundColor: isDragging ? "none" : "var(--milestoneCard)",
          transform: isDragging ? "rotateZ(0deg)" : "rotateZ(0deg)",
        }}
      >
        <div className="milstoneName">{capitalizeFirstLetter(info?.title)}</div>
        <CustomProgressBar value={getProjectProgress(info?.taskCount)} />
        <div className="milestoneCard_footer">
          <div className="milestoneCard_footer__left">
            <LightTooltip title="Due Date" arrow>
              <div style={{ position: "relative" }} className="alignCenter">
                <EventIcon
                  style={{
                    height: 15,
                    width: 15,
                    color: "var(--red)",
                    marginRight: 5,
                  }}
                />
                <p style={{ fontSize: 12, color: "var(--red)" }}>
                  {info?.dueDate
                    ? moment(info?.dueDate).format("DD MMM YY")
                    : "N/A"}
                </p>
              </div>
            </LightTooltip>
            {/* <div className='dateContainer'>
              <DateRangeOutlinedIcon style={{ fontSize: 10 }} />
              <div className='dateText'>
                {info?.dueDate ?moment(info?.dueDate)?.format('DD MMM YYYY') : "N/A"}
              </div>
            </div> */}
            {info?.description && (
              <Icon
                name="menu"
                style={{ height: 15, width: 15, marginLeft: 15 }}
              />
            )}
          </div>
          <div className="milestoneCard_footer__right">
            <div className="mr-2">
              <p className="commonFontSize">Module</p>
              <div className="alignCenter">
                <Icon name="module" style={{ height: 10, width: 10 }} />
                <p style={{ fontSize: 10, paddingLeft: 3, marginTop: 2 }}>
                  {info?.moduleCount ?? 0}
                </p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10 }}>Task</p>
              <div className="alignCenter">
                <Icon name="task" style={{ height: 10, width: 10 }} />
                <p style={{ fontSize: 10, paddingLeft: 3, marginTop: 2 }}>
                  {(info?.taskCount?.NotStarted ?? 0) +
                    (info?.taskCount?.Active ?? 0) +
                    (info?.taskCount?.Completed ?? 0) +
                    (info?.taskCount?.UnderReview ?? 0) +
                    (info?.taskCount?.ReviewFailed ?? 0) +
                    (info?.taskCount?.WaitingForReview ?? 0) +
                    (info?.taskCount?.OnHold ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(MilestoneCard);
