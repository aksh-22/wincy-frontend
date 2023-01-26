import React from "react";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";

export default function EventsTimeline({ data, date, day }) {
  return (
    <Timeline classes={{ alignLeft: "alignStart" }} className="eventInfo">
      {data ? (
        data?.map((el, index) => (
          <TimelineItem key={uniqueIdGenerator()}>
            <TimelineSeparator>
              <div className="dateBox">
                <p>{day}</p>
                <p>{date}</p>
              </div>
              {index + 1 !== data?.length && (
                <TimelineConnector style={{ height: 50 }} />
              )}
            </TimelineSeparator>
            <TimelineContent style={{ minWidth: 40 }}>
              <p
                style={{
                  backgroundColor: "#2E7F43",
                  padding: 5,
                  borderRadius: 4,
                }}
              >
                {el ?? "No Event today"}
              </p>
            </TimelineContent>
          </TimelineItem>
        ))
      ) : (
        <TimelineItem key={uniqueIdGenerator()}>
          <TimelineSeparator>
            <div className="dateBox">
              {/* <p>{day.substring(0, 3)}</p> */}
              <p>{day}</p>
              <p>{date}</p>
            </div>
            {/* {index + 1 !== data?.length && <TimelineConnector />} */}
          </TimelineSeparator>
          <TimelineContent>
            <p
              style={{
                backgroundColor: "#2E7F43",
                padding: 5,
                borderRadius: 4,
              }}
            >
              No Event Today
            </p>
          </TimelineContent>
        </TimelineItem>
      )}
    </Timeline>
  );
}
