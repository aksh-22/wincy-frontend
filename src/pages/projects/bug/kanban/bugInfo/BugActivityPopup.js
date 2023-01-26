import React, { useState, useEffect } from "react";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import { useBugActivity } from "react-query/bugs/useBugActivity";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Paper from "@material-ui/core/Paper";
import Image from "components/defaultImage/Image";
import moment from "moment";
import theme from "../../sidebar/theme";
import CustomButton from "components/CustomButton";

function BugActivityPopup({ orgId, bugId }) {
  const classes = useStyles();

  const { bugActivityLoading, bugActivity, refetch } = useBugActivity(
    orgId,
    "Bug",
    bugId
  );

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    isOpen && refetch();
  }, [isOpen]);

  return (
    <div>
      <div className="alignCenter mb-1">
        <div className="alignCenter mb-1 flex">
          <ListRoundedIcon
            style={{
              marginRight: 10,
              color: "#8a9aff"
            }}
          />
          <p>Activity</p>
        </div>

 
        <CustomButton   onClick={(e) => {
        setIsOpen(!isOpen)
      }}>
<p>{!isOpen ? "Show Details" : "Hide Details"}</p>
  </CustomButton>
        {/* <div
          className="bugInfoPopup_actionButton "
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}
        >
          {!isOpen ? "Show Details" : "Hide Details"}
        </div> */}
      </div>

      {isOpen && (
        <div>
          {bugActivityLoading ? (
            <TableRowSkeleton count={4} height={50} />
          ) : (
            <ThemeProvider theme={theme}>
              <Timeline
                align=""
                classes={{
                  root: "p-0",
                }}
              >
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
                    <TimelineContent 
                    style={{
                        padding :"6px 0px 6px 16px"
                    }}
                    >
                      <Paper
                        elevation={0}
                        className={classes.paper}
                        style={{
                          background: "var(--divider)",
                        }}
                      >
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
                            <span className="ff_Lato_Bolds">"{row?.from}"</span>{" "}
                            to{" "}
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
      )}
    </div>
  );
}

export default BugActivityPopup;

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
