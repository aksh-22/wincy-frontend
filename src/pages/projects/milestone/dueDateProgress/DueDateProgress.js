import React, { memo } from "react";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import moment from "moment";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import ErrorIcon from "@material-ui/icons/Error";
import CustomCircularProgressBar from "components/CustomCircularProgressBar";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { dateCondition } from "utils/dateCondition";

function DueDateProgress({
  dueDate,
  completedOn,
  status,
  onChange,
  disabled,
  removeButton,
  innerContainerClassName
}) {
  const returnDateToolTip = (dueDate, overdue) => {
    if (overdue) {
      return `${Math.abs(moment(dueDate).diff(new Date(), "days"))} ${
        Math.abs(moment(dueDate).diff(new Date(), "days")) === 1
          ? "day"
          : "days"
      } Overdue`;
    }
    if (
      moment(dueDate).format("DD-MM-YYYY") ===
      moment(new Date()).format("DD-MM-YYYY")
    ) {
      return "Today";
    }

    return `${
      Math.abs(moment(dueDate).diff(new Date(), "days")) + 1
    } days left`;
  };

  const renderToopTipOnCompleteion = (dueDate, completedOn, newDate) => {
    if (
      moment(dueDate).format("DD-MM-YYYY") ===
      moment(completedOn).format("DD-MM-YYYY")
    ) {
      return "Completed on Time";
    }

    if (moment(dueDate).diff(completedOn, "days") >= 0) {
      return "Completed on Time";
    }

    if (moment(dueDate).diff(completedOn, "days") <= 0) {
      return `${Math.abs(moment(dueDate).diff(completedOn, "days"))} ${
        Math.abs(moment(dueDate).diff(completedOn, "days")) === 1
          ? "day"
          : "days"
      } delayed`;
    }
  };

  const renderPercentageDueDate = (dueDate) => {
    if (
      moment(dueDate).format("DD-MM-YYYY") ===
      moment(new Date()).format("DD-MM-YYYY")
    ) {
      return 100;
    }
    if (Math.abs(moment(dueDate).diff(new Date(), "days")) + 1 > 7) {
      return 0;
    }
    return Math.abs(
      ((Math.abs(moment(dueDate).diff(new Date(), "days")) + 1) / 7) * 100 - 100
    );
  };

  return (
    <CustomDatePicker
      // minDate={new Date()}
      onChange={onChange}
      defaultValue={dueDate}
      disabled={disabled}
      className={"dueDate__"}
      innerContainerStyle={innerContainerClassName}
    >
      {(!dueDate) ? (
        <LightTooltip
          title={disabled ? "Due date not assignee yet!" : "Add Due Date"}
          arrow
        >
          <div>
            <Icon name="calendar" />
          </div>
        </LightTooltip>
      ) : (
        <div className="d_flex alignCenter " style={{ fontSize: 13 }}>
          {removeButton && !disabled && (
            <>
              <div className="myStatusTag" />
              <LightTooltip title="Remove Due Date" arrow placement="top">
                <div
                  className="cross_"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange('')
                  }}
                >
                  +
                </div>
              </LightTooltip>
            </>
          )}
          {dueDate ? (
            <div className="d_flex alignCenter" style={{ fontSize: 13 }}>
              {(status === "Active" || status === "NotStarted") && (
                <LightTooltip
                  arrow
                  title={returnDateToolTip(
                    dueDate,
                    moment(dueDate).diff(new Date(), "days") < 0
                  )}
                >
                  <div
                    className={`${
                      moment(dueDate).diff(new Date(), "days") < 0
                        ? "d_flex alignCenter"
                        : ""
                    }`}
                  >
                    {moment(dueDate).diff(new Date(), "days") < 0 ? (
                      <ErrorIcon
                        // className="blink"
                        style={{ color: "var(--red)", fontSize: 18 }}
                      />
                    ) : (
                      <div style={{ height: 18, width: 18 }}>
                        <CustomCircularProgressBar
                          strokeLinecap="butt"
                          percentage={renderPercentageDueDate(dueDate)}
                          strokeWidth={50}
                          percentageDisable
                        />
                        &nbsp;
                      </div>
                    )}
                  </div>
                </LightTooltip>
              )}
              {status === "Completed" && (
                <LightTooltip
                  arrow
                  title={renderToopTipOnCompleteion(
                    dueDate,
                    completedOn,
                    new Date()
                  )}
                >
                  <CheckCircleRoundedIcon
                    style={{
                      color: "var(--red)",
                      fontSize: 18,
                      color: "rgb(44, 222, 86)",
                    }}
                  />
                </LightTooltip>
              )}
              &nbsp;&nbsp;{" "}
              <div
                className={`${
                  moment(dueDate).diff(new Date(), "days") < 0 ? "" : "pt-05"
                }`}
              >
                {dateCondition(dueDate , "MMM DD")}
                {/* {moment(dueDate).format("MMM DD")} */}
              </div>{" "}
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex" }} />
          )}
        </div>
      )}
    </CustomDatePicker>
  );
}

export default memo(DueDateProgress);
