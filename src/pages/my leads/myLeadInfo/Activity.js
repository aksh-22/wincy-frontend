import CustomButton from "components/CustomButton";
import React, { useState } from "react";
import classes from "./MyLeadInfo.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import HotelIcon from "@material-ui/icons/Hotel";
import RepeatIcon from "@material-ui/icons/Repeat";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import TextInput from "components/textInput/TextInput";
import { ClickAwayListener, IconButton } from "@material-ui/core";
import checkbox from "assets/svg/checkbox.svg";
import CloseIcon from "@material-ui/icons/Close";
import CommonDialog from "components/CommonDialog";
import { LightTooltip } from "components/tooltip/LightTooltip";
import AddIcon from "@material-ui/icons/Add";
import MyTeamDialogueContent from "components/dialogContent/MyTeamDialogueContent";
import InputModalData from "./InputModalData";

const activity = [{ name: "Meeting done", date: "Aug 19 2021, 06:45 PM" }];

export default function Activity() {
  const [addActivity, setAddActivity] = useState(false);

  const [input1, setInput1] = useState();
  const [input2, setInput2] = useState();

  const [activities, setActivities] = useState([...activity]);

  return (
    <div className={classes.activity}>
      <div className={classes.activity_header}>
        <h2>Activity</h2>
        <CommonDialog
          actionComponent={<CustomButton>Add Activity</CustomButton>}
          modalTitle="Invite"
          content={<InputModalData />}
          width={450}
          height={"auto"}
          dialogContentClass={"pt-0"}
        />
      </div>
      <Timeline classes={{ alignLeft: "alignStart" }}>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              style={{
                color: "#47BB66",
                background: "transparent",
                borderColor: "#47BB66",
                cursor: "pointer",
              }}
            >
              {!addActivity ? (
                <IconButton
                  onClick={() => {
                    setAddActivity(!addActivity);
                  }}
                  style={{ color: "#47BB66", padding: 0 }}
                >
                  <AddOutlinedIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setAddActivity(!addActivity);
                  }}
                  style={{ color: "#47BB66", padding: 0 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </TimelineDot>
            <TimelineConnector
              style={{
                background: "#47BB66",
                height: 50,
              }}
            />
          </TimelineSeparator>
          {addActivity && (
            <TimelineContent>
              <ClickAwayListener
                onClickAway={() => {
                  // setAddActivity(false);
                }}
              >
                <div
                  style={{
                    flex: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextInput
                    onChange={(e) => {
                      setInput1(e.target.value);
                    }}
                  />
                  <TextInput
                    onChange={(e) => {
                      setInput2(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      e.key === "Enter" &&
                        setActivities([
                          { name: input1, date: input2 },
                          ...activities,
                        ]);
                      e.key === "Enter" && setAddActivity(false);
                    }}
                  />
                </div>
              </ClickAwayListener>
            </TimelineContent>
          )}
        </TimelineItem>
        {activities?.map((el, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <img
                src={checkbox}
                style={{ width: 30, height: 30, objectFit: "contain" }}
              />
              {/* <TimelineDot
              style={{
                color: "#47BB66",
                background: "transparent",
                borderColor: "#47BB66",
              }}
            > */}
              {/* <Checkbox /> */}
              {/* <DoneOutlinedIcon /> */}
              {/* </TimelineDot> */}
              {index !== activities.length - 1 && (
                <TimelineConnector
                  style={{
                    background: "#47BB66",
                    height: 50,
                  }}
                />
              )}
            </TimelineSeparator>
            <TimelineContent style={{ flex: "100%" }}>
              <h3>{el.name}</h3>
              <p style={{ color: "#0098EB" }}>{el.date}</p>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
