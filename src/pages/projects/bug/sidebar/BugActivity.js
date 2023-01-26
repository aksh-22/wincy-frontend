import React from "react";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Paper from "@material-ui/core/Paper";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import theme from "./theme";
import Image from "components/defaultImage/Image";
import moment from "moment";
import { useBugActivity } from "react-query/bugs/useBugActivity";
const useStyles = makeStyles((theme) => ({
  paper: {
    // padding: "0",
    // margin: theme.spacing(0, 0, 3, 0),
    backgroundColor: "var(--projectCardBg)",
    color: "#FFF",
    padding: 10,
  },
  secondaryTail: {
    // backgroundColor: theme.palette.secondary.main,
  },
  timestamp: {
    // margin: theme.spacing(0, 0, 0.25, 0),
  },
}));

function BugActivity({ data = [], orgId, bugId, type }) {
  const { bugActivityLoading, bugActivity } = useBugActivity(
    orgId,
    "Bug",
    bugId
  );
  const classes = useStyles();
  console.log(bugActivity);
  return (
    <div>
      {bugActivityLoading ? (
        <TableRowSkeleton count={5} height={40} />
      ) : (
        <ThemeProvider theme={theme}>
          <Timeline align="">
            {bugActivity?.activities?.map((row, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot
                    variant="outlined"
                    className="activityDot"
                    style={{ border: "none", padding: 0 }}
                  >
                    <Image
                      src={row?.createdBy?.profilePicture}
                      title={row?.createdBy?.name}
                      style={{
                        height: 30,
                        width: 30,
                        fontSize: "1.2em",
                      }}
                    />
                  </TimelineDot>
                  {bugActivity?.activities?.length - 1 !== index && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={0} className={classes.paper}>
                    <div className="d_flex alignCenter mb-05">
                      <p
                        style={{
                          textTransform: "capitalize",
                          fontSize: 16,
                          flex: 1,
                        }}
                      >
                        {row?.field} Changed
                      </p>

                      <p
                        style={{
                          color: "var(--primary)",
                          fontSize: 12,
                        }}
                      >
                        {" "}
                        {moment(row?.createdAt).fromNow()}
                      </p>
                    </div>
                    <div className="d_flex alignCenter mb-05">
                      <p
                        style={{
                          fontFamily: "Lato-Light",
                          fontSize: 13,
                          opacity: 0.6,
                          flex: 1,
                        }}
                      >
                        {/* {row?.description} */}
                        {row?.field} changed from{" "}
                        <span className="ff_Lato_Bolds">"{row?.from}"</span> to{" "}
                        <span className="ff_Lsato_Bold">"{row?.to}"</span>
                      </p>
                 
                    </div>

                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </ThemeProvider>
      )}
    </div>
  );
}

export default BugActivity;
