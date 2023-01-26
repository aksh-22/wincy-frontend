import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    // width: 275,
    // margin: '10px 10px 10px 0px',
    // background: theme.palette.background.secondary,
    // color: 'secondary',
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    color: theme.palette.text.primary,
  },
}));

function AddMilestoneAction({ onClick, className }) {
  const classes = useStyles();
  return (
    <Card
      className={className}
      onClick={onClick}
      variant="outlined"
      style={{ cursor: "pointer" }}
    >
      <CardContent
        style={{
          height: "100%",
          textAlign: "center",
        }}
        className={`${classes.content} d_flex flexColumn alignCenter justifyContent_center`}
      >
        <div
          style={{
            backgroundColor: "var(--projectCardBg)",
            height: 60,
            width: 60,
            borderRadius: "50%",
          }}
          className="d_flex alignCenter justifyContent_center"
        >
          <AddRoundedIcon
            style={{
              fontSize: 54,
              color: "var(--defaultWhite)",
              marginLeft: 2,
              // margin:"20px 0px"
            }}
          />
        </div>
        <p
          style={{
            fontSize: 18,
            color: "var(--defaultWhite)",
          }}
          className="mt-2"
        >
          Create Milestone
        </p>
        {/* <p
          style={{
            fontSize: 13,
            marginTop: 5,
            color: "var(--textColor)",
          }}
        >
          Create a project, where you can add and keep track of tasks.
        </p> */}
        {/* <CustomButton >Add Project</CustomButton> */}
      </CardContent>
    </Card>
  );
}

export default AddMilestoneAction;
