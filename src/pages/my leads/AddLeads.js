import { Card, CardContent, makeStyles } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { Link } from "react-router-dom";
import AddLeadDialog from "./addLead/AddLeadDialog";
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

export default function AddLeads({ className }) {
  const classes = useStyles();
  const [addLeadPopup , setAddLeadPopup]=useState(false)
const handleClosePopup = useCallback(() => {
  setAddLeadPopup(false)
}, []);

  return (
    <>
      <Card
        className={className}
        onClick={() => setAddLeadPopup(true)}
        style={{ cursor: "pointer" }}
      >
        <CardContent
          style={{
            height: "100%",
            textAlign: "center",
            padding: 20,
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
              marginTop: 10,
            }}
          >
            Add Lead
          </p>

          {/* <CustomButton >Add Project</CustomButton> */}
        </CardContent>
      </Card>
      <AddLeadDialog 
      open={addLeadPopup}
      handleClose={handleClosePopup}
      />

    </>
  );
}
