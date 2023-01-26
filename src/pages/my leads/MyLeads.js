import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CustomButton from "components/CustomButton";
import React, { useState } from "react";
import AddLeads from "./AddLeads";
import classes from "./MyLeads.module.css";
import LeadCards from "./LeadCards";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import LeadInfoSideBar from "./leadInfoSideBar/LeadInfoSideBar";
import AddLeadDialog from "./addLead/AddLeadDialog";
import LeadDashboard from "./leadDashboard/LeadDashboard";

export default function MyLeads() {
  const [activeBtn, setActiveBtn] = useState("Active");
  // const [status, setStatus] = useState(initialState)

  // const showLeads = () => <LeadCards status={activeBtn} />;

  return (
    <div className={classes.myLeads}>
      {/*--------------------- Btn Area --------------------- */}

      <BtnWrapper style={{ width: "auto" }}>
      <CustomButton
          type={activeBtn === "dashboard" ? "contained" : "text"}
          onClick={() => {
            setActiveBtn("dashboard");
          }}
        >
         Dashboard
        </CustomButton>
        <CustomButton
          type={activeBtn === "Active" ? "contained" : "text"}
          onClick={() => {
            setActiveBtn("Active");
          }}
        >
          Active
        </CustomButton>
        <CustomButton
          type={activeBtn === "Idle" ? "contained" : "text"}
          onClick={() => {
            setActiveBtn("Idle");
          }}
        >
          Idle
        </CustomButton>
        <CustomButton
          type={activeBtn === "Awarded" ? "contained" : "text"}
          onClick={() => {
            setActiveBtn("Awarded");
          }}
        >
          Awarded
        </CustomButton>
        <CustomButton
          type={activeBtn === "Rejected" ? "contained" : "text"}
          onClick={() => {
            setActiveBtn("Rejected");
          }}
        >
          Rejected
        </CustomButton>
        <CustomButton
          type={activeBtn === "isFavourite" ? "contained" : "text"}
          onClick={() => {
            setActiveBtn("isFavourite");
          }}
        >
          Favourite
        </CustomButton>
      </BtnWrapper>

      {/*--------------------- End of Btn Area --------------------- */}

      {/* ----------------------Lead Area--------------------------- */}

      <div className={ activeBtn === "dashboard" ? "" : classes.leadsArea}>
        {activeBtn === "Active" && <AddLeads className={classes.leadCard} />}
    {
      activeBtn === "dashboard" ? <LeadDashboard />:  <LeadCards status={activeBtn} />
    }
      </div>

      {/* <AddLeadDialog /> */}
      {/* <LeadDashboard /> */}
      {/* <CustomSideBar
      show={true}
      >
        <LeadInfoSideBar />
      </CustomSideBar> */}

      {/* --------------------End of Lead Area----------------------- */}
    </div>
  );
}
