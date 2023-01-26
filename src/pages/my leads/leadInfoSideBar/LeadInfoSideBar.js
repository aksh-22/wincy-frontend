import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CustomButton from "components/CustomButton";
import React, { useState, useCallback } from "react";
import LeadInfoAboutTab from "./LeadInfoAboutTab";
import LeadInfoActivityTab from "./LeadInfoActivityTab";
import "./LeadInfoSideBar.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CustomChip from "components/CustomChip";
import { leadChipStatusColor } from "utils/leadChipStatusColor";
import CloseButton from "components/CloseButton";
import { useSelector } from "react-redux";
import { useUpdateLead } from "react-query/lead/useUpdateLead";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import { capitalizeFirstLetter } from "utils/textTruncate";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CustomMenu from "components/CustomMenu";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import { useDeleteLead } from "react-query/lead/useDeleteLead";
import { dateCondition } from "utils/dateCondition";
import { LightTooltip } from "components/tooltip/LightTooltip";
import CustomPopper from "components/CustomPopper";
const statusOption = ["Active", "Idle", "Awarded", "Rejected"];

function LeadInfoSideBar({ toggle, info  ,tabStatus}) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { mutate: mutateUpdate } = useUpdateLead(tabStatus);
  const [activeTab, setActiveTab] = useState("activity");
  const { mutate:mutateDeleteLead, isLoading: isLoadingDelete } = useDeleteLead(
    orgId,
    info?._id,
    info?.status
  );
  const onHandleUpdate = useCallback(
    (fieldName, fieldValue) => {
      const obj = {
        orgId: orgId,
        leadId: info?._id,
        leadStatus: info?.status,
        data: {
          [fieldName]: fieldValue,
        },
      };

      mutateUpdate(obj);
    },
    [orgId, info, mutateUpdate]
  );
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <div className="leadInfoHeader">
        <div className="d_flex justifyContent_end">
          <CloseButton
            onClick={toggle}
            isLoading={isLoadingDelete}
            mutate={mutateDeleteLead}
            data={{
              orgId,
              leadId: info?._id,
            }}
            otherFunction={toggle}
            normalClose={true}
          />
          {/* <span className="cursorPointer" onClick={toggle}>
                <CloseRoundedIcon style={{
                    fontSize:24,
                    color:"#fff"
                }}/>
                </span> */}
        </div>

        <div className="leadinfoHeading">
          <InputTextClickAway
            onChange={(value) => onHandleUpdate("name", value)}
            value={capitalizeFirstLetter(info?.name)}
            textClassName={"pl-0 m-0"}
            flexDisable
            textStyle={{
              fontSize: 21,
              fontWeight: "bold",
            }}
            style={{
              fontSize: 21,
              fontWeight: "bold",
            }}
          />

<CustomPopper 
value={<CustomChip
  label={info?.status ?? "N/A"}
  bgColor={leadChipStatusColor[info?.status]}
  style={{ padding: 8, fontSize: 12 ,   cursor:"pointer" }}
  className={"mx-1 cursorPointer"}
 
/> }
buttonClassName="cursorPointer"
valueStyle={{
  cursor:"pointer"
}}
content={<LeadStatusOptions onHandleUpdate={onHandleUpdate} />}
/>
          {/* <CustomChip
            label={info?.status ?? "N/A"}
            bgColor={leadChipStatusColor[info?.status]}
            style={{ padding: 8, fontSize: 12 }}
            className={"mx-1"}
          /> */}
          {/* <span className="badge cursorPointer">Active</span> */}
          <div className="heartIcn cursorPointer">
            {info?.isFavourite ? (
              <FavoriteRoundedIcon
                style={{
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => onHandleUpdate("isFavourite", false)}
              />
            ) : (
              <FavoriteBorderIcon
                style={{
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => onHandleUpdate("isFavourite", true)}
              />
            )}
          </div>
        </div>
        <div className="leadinginfoTab">
          <div className="btwrap">
            <BtnWrapper style={{ width: "220px" }}>
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
              {/* need this div */}
              <div />
            </BtnWrapper>
          </div>
          <CustomDatePicker
            containerStyle={{
              width: "auto",
            }}
            onChange={(date) => onHandleUpdate("nextFollowUp", date)}
            defaultValue={info?.nextFollowUp}
          >
            <LightTooltip title={info?.nextFollowUp ? "Next Follow-up Date"  : ""} arrow>
            <div>
              <span className="folowBtn cursorPointer"
              style={{
                background:info?.nextFollowUp ? "none" :"var(--primary)",
                border : info?.nextFollowUp ? "1px solid var(--primary)" : "none",
                color : info?.nextFollowUp ? "var(--primary)" : "var(--defaultWhite)"
              }}
              >
                {info?.nextFollowUp ? dateCondition(info?.nextFollowUp , 'ddd, Do MMM YYYY') : "Next Follow-up Date"}
              </span>
            </div>
            </LightTooltip>
          </CustomDatePicker>
        </div>
      </div>
      {activeTab === "activity" ? (
        <LeadInfoActivityTab info={info} tabStatus={tabStatus} />
      ) : (
        <LeadInfoAboutTab info={info} tabStatus={tabStatus} statusOption={statusOption}/>
      )}
    </div>
  );
}

export default LeadInfoSideBar;


export const LeadStatusOptions = ({handleClose , onHandleUpdate , options}) => {
  return <div className="mt-1">
    {
    (options ? options : statusOption)?.map((item, index) => (
      <div
      onClick={(event) => {
        event?.preventDefault();
        event?.stopPropagation();
        onHandleUpdate( "status" , item)
        handleClose()
      }}
      

      style={{
        backgroundColor : leadChipStatusColor[item]??"var(--lightBlue)",
        minWidth :100,
        height : 40,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        color:"#FFF",
        cursor:"pointer",
      }}
      >
        {item} </div>
    ))
    }
  </div>
}