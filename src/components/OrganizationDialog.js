import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ProfilePopup from "css/ProfilePopup.module.css";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";
import PeopleIcon from "@material-ui/icons/People";
import EditIcon from "@material-ui/icons/Edit";

import { IconButton, TextField } from "@material-ui/core";

import CustomButton from "components/CustomButton";
import { useAddOrganisation } from "react-query/organisations/useAddOrganisation";
import { useEditOrganisation } from "react-query/organisations/useEditOrganisation";
import ErrorMessage from "components/ErrorMessage";
import { useEffect } from "react";

const useStyles = makeStyles((theme, props) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(0),
    top: theme.spacing(0),
    color: "var(--defaultWhite)",
    padding: 16,
  },
  paper: {
    background: theme.palette.background.default,
    color: "var(--defaultWhite)",
    width: (props) => props.width,
    minHeight: (props) => props.height,
    // padding: '20px 10px',
  },
}));

const DialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  const classes = useStyles();
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className="headerFont">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon style={{ fontSize: 22 }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const OrganizationDialog = ({
  actionComponent,
  modalTitle = "",
  content,
  width,
  height,
  dialogContentClass,
}) => {
  const props = { width: width, height: height };
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({
      type: "SET_ORG_MODAL",
      payload: {
        type: "ADD",
        visible: false,
      },
    });
  };
  const { type, visible } = useSelector(
    (state) => state.organizationModal.orgModal
  );

  return (
    <>
      <Dialog
        classes={{ paper: classes.paper }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={visible}
        className="boxShadow"
        PaperProps={{ className: "boxShadow" }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{
            padding: 16,
            boxShadow: "none",
            borderBottom: "1px solid var(--divider)",
          }}
        >
          Add Organization
        </DialogTitle>
        <DialogContent dividers className={dialogContentClass}
        style={{
          minWidth:450
        }}
        >
          <AddOrganisationContent handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationDialog;

// =========

const AddOrganisation = ({ onClick }) => (
  <div className={ProfilePopup.containerCSS} onClick={onClick}>
    <PeopleIcon />
    &nbsp;
    <p style={{ fontSize: 13 }}>Add Organisation</p>
  </div>
);

const AddOrganisationContent = ({ handleClose }) => {
  const [org, setOrg] = useState("");
  const [orgError, setOrgError] = useState("");
  const { isLoading, mutate } = useAddOrganisation(handleClose);
  const handleSubmit = () => {
    if (!org) setOrgError("Required!");
    else {
      setOrgError("");
      mutate({ name: org });
    }
  };
  return (
    <div>
      <TextField
        label="Enter Organisation Name"
        fullWidth
        onChange={(e) => {
          setOrg(e.target.value)
          setOrgError("")
        }}
        // className="mb-1"
        autoFocus
        helperText={orgError}
        error={orgError ? true : false}
      />
      <div className="d_flex justifyContent_end mt-2">
        <CustomButton
          loading={isLoading}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Create
        </CustomButton>
      </div>
    </div>
  );
};
