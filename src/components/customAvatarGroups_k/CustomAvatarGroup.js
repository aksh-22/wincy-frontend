import Image from "components/defaultImage/Image";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useState } from "react";
import "./CustomAvatarGroup.scss";
import Icon from "components/icons/IosIcon";
import { useSelector } from "react-redux";
import { getBackgroundColor } from "pages/projects/milestone/view/table-view/module-table-view/milestone-module/taskStatus/TaskStatus";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";

function CustomAvatarGroup({
  data = [],
  style,
  plusDisable,
  maxLength,
  className,
  disabled,
  marginLeft_0
}) {
  const [isShown, setIsShown] = useState(false);
  const userType = useSelector((state) => state.userReducer?.userType);
  const [assigneeData, setAssigneeData] = useState(data);
  React.useEffect(() => {
    let idIndex = data?.findIndex((item) => item?._id === userType?.userId);

    if (idIndex !== -1) {
      let tempArray = [...data];
      [
        tempArray[
          !plusDisable && tempArray?.length > 3 ? 2 : tempArray?.length - 1
        ],
        tempArray[idIndex],
      ] = [
        tempArray[idIndex],
        tempArray[
          !plusDisable && tempArray?.length > 3 ? 2 : tempArray?.length - 1
        ],
      ];
      setAssigneeData(tempArray);
    } else {
      setAssigneeData(data);
    }
  }, [data]);
  return (
    <div
      className={`avatar-group rtl ${
        assigneeData.length ? (marginLeft_0 ? "" :"ml-1") : ""
      } ${className}`}
    >
     {(plusDisable && !disabled) && <LightTooltip title="Click to add an assignee" arrow>
        <div
		style={{
			display:"flex",
			alignItems : "center",
			marginLeft : 5
		}}
		>
          <Icon
            name="addRound"
            style={{
              height:  25,
              width:  25,
            }}
          />
        </div>
      </LightTooltip>}
      {plusDisable ??
        (assigneeData.length > (maxLength ?? 3) && (
          <div
            className="hidden-avatars"
            style={{
              height: style ?? 25,
              width: style ?? 25,
              position: "relative",
              ...style,
            }}
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
          >
            {assigneeData.length - (maxLength ?? 3)}
            <span>+</span>
            {isShown && (
              <div
                className={` boxShadow extraShow ${
                  window?.innerHeight - window?.event?.clientY < 200
                    ? "showTop"
                    : "showBottom"
                }`}
                style={{ maxHeight: 300, overflowY: "auto" }}
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
              >
                {assigneeData.map(
                  (item, index) =>
                    index >= (maxLength ?? 3) && (
                      <div
                        key={index}
                        className={`d_flex rowData  ${
                          data.length - 1 === index ? "borderNone" : ""
                        }`}
                      >
                        <p className="member_name">{item?.name}</p>
                       <div style={{
                         position:"relative"
                       }}>
                       <Image
                          small
                          src={item?.profilePicture}
                          title={item?.name ?? "No Assignee"}
                          key={index}
                          style={{
                            marginLeft: -0,
                            backgroundColor: "var(--newBlue)",
                            border: item?.projectHead
                              ? "2px solid rgb(250, 188, 42)"
                              : "2px solid var(--progressBarBgColor)",
                            ...style,
                          }}
                        />
                        {
              item?.status &&     <LightTooltip title={addSpaceUpperCase(item?.status)} arrow>
                <div 
              style={{
                background:getBackgroundColor({label : addSpaceUpperCase(item?.status)}),
                height:8,
                width:8,
                position:"absolute",
                bottom:0,
                borderRadius:"50%",
                // right:-2
              }}
              />
              </LightTooltip>
            } </div>

                      </div>
                    )
                )}
              </div>
            )}
          </div>
        ))}
      {assigneeData.map((item, index) =>
        plusDisable ? (
          <div
            className="avatar"
            style={{
              height: style ?? 25,
              width: style ?? 25,
              ...style,
            }}
            key={index}
          >
            <Image
              small
              src={item?.profilePicture}
              title={item?.name ?? "No Assignee"}
              // className="projectHead ml--1"
              key={index}
              style={{
                marginLeft: -0,
                backgroundColor: "var(--newBlue)",
                border: item?.projectHead
                  ? "2px solid rgb(250, 188, 42)"
                  : "2px solid var(--progressBarBgColor)",
                ...style,
              }}
              // className="assigneeAvatar"
            />
          </div>
        ) : (
          index < (maxLength ?? 3) && (
            <div
              className="avatar"
              style={{
                height: style ?? 25,
                width: style ?? 25,
                overflow:"inherit",
                ...style,
              }}
              key={index}
            >
              <Image
                small
                src={item?.profilePicture}
                title={item?.name ?? "No Assignee"}
                // className="projectHead ml--1"
                key={index}
                style={{
                  marginLeft: -0,
                  backgroundColor: "var(--newBlue)",
                  border: item?.projectHead
                    ? "2px solid rgb(250, 188, 42)"
                    : "2px solid var(--progressBarBgColor)",
                  ...style,
                }}
                // className="assigneeAvatar"
              />
            {
              item?.status &&     <LightTooltip title={addSpaceUpperCase(item?.status)} arrow>
                <div 
              style={{
                background:getBackgroundColor({label : addSpaceUpperCase(item?.status)}),
                height:8,
                width:8,
                position:"absolute",
                bottom:0,
                borderRadius:"50%",
                // right:-2
              }}
              />
              </LightTooltip>
            }
            </div>
          )
        )
      )}
    </div>
  );
}

export default CustomAvatarGroup;
