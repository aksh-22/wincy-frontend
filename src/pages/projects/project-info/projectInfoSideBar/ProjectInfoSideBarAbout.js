import GrainIcon from "@material-ui/icons/Grain";
import SecurityOutlinedIcon from "@material-ui/icons/SecurityOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CustomRow from "components/CustomRow";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import projectCard from "css/ProjectCard.module.css";
import css from "css/ProjectInfo.module.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";

function ProjectInfoSideBarAbout({ info, disabled, onValueChange, userType }) {
  const editorRef = React.useRef("");
  const [showInfo, setShowInfo] = useState(false);
  const technology = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );
  const platform = useSelector(
    (state) => state.userReducer?.userData?.platforms
  );

  return (
    <div>
      <div className="mb-3">
        <CustomTextEditor
          value={info?.description}
          ref={editorRef}
          disable={disabled}
          updateData={(data) => {
            console.log(data);
            info?.description !== data &&
              onValueChange(data, undefined, "description");
          }}
        />
      </div>

      <div
        className={`${projectCard.blockSensitive} mb-1 d_flex alignCenter`}
        style={{
          border: "1px solid var(--divider)",
        }}
      >
        <GrainIcon style={{ fontSize: 16 }} />
        &nbsp; <p className="ff_Lato_Regular">Basic Information</p>{" "}
      </div>
      <div className="firstSection">
        <div className={`${projectCard.header} d_flex`}></div>
      </div>
      <div style={{ overflowY: "auto", height: "inherit" }}>
        <div className={css.secondSection}>
          {/* Table */}
          <div className={css.tableContainer}>
            {
              // New Code Custom Row
              sectionOne?.map((item, index) => (
               (( info?.status === "OnHold" ) || (info?.status !== "OnHold" && item?.apiKey !== "onHoldReason")) &&    <CustomRow
                  key={item?.apiKey}
                  value={item?.apiKey === "status" ? addSpaceUpperCase(info?.[item?.apiKey]) : info?.[item?.apiKey]}
                  apiKey={item?.apiKey}
                  field={item?.field}
                  inputType={item?.type}
                  onChange={onValueChange}
                  menuItems={selectMenuItems(item?.apiKey , item?.apiKey === "platforms" ? platform: technology)}
                  multiple={item?.multiple ?? false}
                  minDate={new Date()}
                  disabled={disabled}
                />
              ))
            }
          </div>
        </div>

        {["Admin", "Member++"].includes(userType?.userType) && (
          <div className="thirdSection my-1">
            <div
              className={`${projectCard.blockSensitive} mb-1 d_flex alignCenter`}
              style={{
                border: "1px solid var(--divider)",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowInfo((prev) => !prev);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <SecurityOutlinedIcon style={{ fontSize: 16 }} />
                &nbsp;
                <p className="ff_Lato_RegWincyular">Sensitive Information</p>
              </div>

              <KeyboardArrowRightIcon
                className={projectCard.ArrowIcon}
                style={{
                  transform: `${!showInfo ? "rotate(0deg)" : "rotate(90deg)"}`,
                  transition: "all .3s linear",
                }}
              />
            </div>
            {showInfo && (
              <div
                className={`${
                  showInfo
                    ? projectCard.tableContainer
                    : projectCard.tableContainer2
                }`}
              >
                {secondSection?.map((item, index) => (
                  <CustomRow
                    key={item?.apiKey}
                    value={info?.paymentInfo?.[item?.apiKey]}
                    apiKey={item?.apiKey}
                    field={item?.field}
                    inputType={item?.type}
                    onChange={onValueChange}
                    menuItems={selectMenuItems(item?.apiKey)}
                    multiple={item?.multiple ?? false}
                    minDate={new Date()}
                  />
                ))}
                {clientData?.map((item, index) => (
                  <CustomRow
                    key={item?.apiKey}
                    value={info?.clientData?.[item?.accessKey]}
                    apiKey={item?.apiKey}
                    field={item?.field}
                    inputType={item?.type}
                    onChange={onValueChange}
                    menuItems={selectMenuItems(item?.apiKey)}
                    multiple={item?.multiple ?? false}
                    otherKey={item?.accessKey}
                    minDate={new Date()}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectInfoSideBarAbout;

const sectionOne = [
  {
    field: "Status",
    apiKey: "status",
    type: "select",
  },
  {
    field: "On Hold Reason",
    apiKey: "onHoldReason",
    type: "text",
  },
  {
    field: "Category",
    apiKey: "category",
    type: "text",
  },
  {
    field: "Start Date",
    apiKey: "startedAt",
    type: "date",
  },
  {
    field: "Deadline",
    apiKey: "dueDate",
    type: "date",
  },
  // {
  //   field: "Screens",
  //   apiKey: "screens",
  //   type: "inputTags",
  // },
  {
    field: "Platforms",
    apiKey: "platforms",
    type: "select",
    multiple: true,
  },
  {
    field: "Technologies",
    apiKey: "technologies",
    type: "select",
    multiple: true,
  },
];

const secondSection = [
  {
    field: "Amount",
    apiKey: "amount",
    type: "number",
  },
  {
    field: "Currency",
    apiKey: "currency",
    type: "select",
  },
  {
    field: "Payment Mode",
    apiKey: "paymentMode",
    type: "select",
  },
];

const clientData = [
  {
    field: "Client's Name",
    apiKey: "client",
    type: "text",
    accessKey: "name",
  },
  {
    field: "Client's Email",
    apiKey: "clientEmail",
    type: "text",
    accessKey: "email",
  },
  {
    field: "Country",
    apiKey: "clientCountry",
    type: "autoComplete",
    accessKey: "country",
  },
];

const selectMenuItems = (key, menu) => {
  switch (key) {
    case "platforms":
      return menu;
    case "technologies":
      return menu;
    case "status":
      return ["Active", "Completed", "On Hold"];
    case "paymentMode":
      return ["Paypal", "Net Banking", "UPI"];
    case "currency":
      return ["USD", "SAR", "INR"];
    default:
      return [];
  }
};
