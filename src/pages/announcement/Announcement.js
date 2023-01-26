import React from "react";
import GavelIcon from "@mui/icons-material/Gavel";
import "./Announcement.css";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
const workingHours = [
  "All the employees are expected to complete at least 8 working hours in a day in the office.",
  `For some reason, if an employee is not able to complete the dedicated 8 hours on a specific day, the company offers the flexibility to adjust the remaining hours on another day of the current month. `,
  `The employer has the right to deduct the salary of an employee in case total official working hours are not completed in the month. `,
];

const Leaves = [
    `For getting the permission of leave, an employee should inform 3 days prior to taking a leave. It is compulsory to send an email to HR with a valid reason and then HR will send the confirmation email.  `,
    `If any employee takes leave on an urgent basis then it will not adjusted in C.L.`,
    `C.L only be adjusted in prior notice and it should be informed first.`
]
function Announcement() {
  return (
    <div className="m-2">
      <div className="ruleContainer">
        <GavelIcon /> <p className="title"> Rules</p>
      </div>

      <div className="containerRowAnnouncement">
        <AssistantPhotoRoundedIcon /> <p className="title"> Working Hours</p>
      </div>
      <div className="subContainerAnnouncement">
        {workingHours?.map((item, index) => (
          <div className="subContainerAnnouncement_row" key={index}>
            <CheckRoundedIcon />
            <p>{item}</p>
          </div>
        ))}
      </div>
      <div className="containerRowAnnouncement">
        <AssistantPhotoRoundedIcon /> <p className="title">Leaves</p>
      </div>
      <div className="subContainerAnnouncement">
      {Leaves?.map((item, index) => (
          <div className="subContainerAnnouncement_row" key={index}>
            <CheckRoundedIcon />
            <p>{item}</p>
          </div>
        ))}
        </div>

        <div className="containerRowAnnouncement">
        <AssistantPhotoRoundedIcon /> <p className="title">Work From Home</p>
      </div>
      <div className="subContainerAnnouncement">
      <div className="subContainerAnnouncement_row">
            <CheckRoundedIcon />
            <p>After 7th of Nov 2021, no WFH is allowed unless there is an emergency case and it should be first approved by project manager via email or head of the company.</p>
          </div>
        </div>
    </div>
  );
}

export default Announcement;
