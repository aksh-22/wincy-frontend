import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import CustomAvatar from "components/CustomAvatar";
import { Divider, IconButton, TextField } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import EditIcon from "@material-ui/icons/Edit";
import CustomButton from "components/CustomButton";
import { useLogout } from "react-query/auth/useLogout";
import CommonDialog from "components/CommonDialog";
import { useState } from "react";
import { useAddOrganisation } from "react-query/organisations/useAddOrganisation";
import { useOrganisations } from "react-query/organisations/useOrganisations";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProfilePopup from "css/ProfilePopup.module.css";
import PersonIcon from "@material-ui/icons/Person";
import { useEditOrganisation } from "react-query/organisations/useEditOrganisation";
import ErrorMessage from "components/ErrorMessage";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import CommonDelete from "components/CommonDelete";
import { textTruncateMore } from "utils/textTruncate";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useDeleteOrganisation } from "react-query/organisations/useDeleteOrganisation";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
const useStyles = makeStyles((theme) => ({
  root: {
    width: 210,
    minHeight: 180,
    background: theme.palette.background.secondary,
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
}));

export default function ProfileCard({ handleClose }) {
  const classes = useStyles();
  const { isLoading, mutate } = useLogout();
  const { isLoading: orgLoading, data } = useOrganisations();
  const userType = useSelector((state) => state.userReducer?.userType);
  const {isLoading:deleteLoading , mutate : deleteMutate} = useDeleteOrganisation(userType)
  const user = useSelector((state) => state.userReducer?.userData?.user);
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );
  const [editOrgId, setEditOrgId] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleOrgSelect = (org) => {
    dispatch({ type: "SELECTED_ORGANISATION", payload: org });
    history.push("/main/projects");
    handleClose();
  };

  return (
    <Card
      className={`${classes.root} ${ProfilePopup.PopoverContainer} `}
      style={{
        minWidth: 270,
      }}
      variant="outlined"
    >
      <Link
        to="/main/myProfile"
        className={ProfilePopup.containerCSS}
        onClick={() => handleClose()}
      >
        <PersonIcon />
        &nbsp;
        <p>My Profile</p>
      </Link>

    {
        // ["Admin", "Member++"].includes(userType?.userType) && 
        <>   <Divider className={ProfilePopup.divider_color} />
      <div
        className={ProfilePopup.containerCSS}
        onClick={() => {
          dispatch({
            type: "SET_ORG_MODAL",
            payload: {
              type: "ADD",
              visible: true,
            },
          });
          handleClose();
        }}
      >
        <PeopleIcon />
        &nbsp;
        <p style={{ fontSize: 13 }}>Add Organisation</p>
      </div> </>
    }
      <Divider className={ProfilePopup.divider_color} />
      <div className={ProfilePopup.containerScroll}>
        {orgLoading && <TableRowSkeleton count={4} height={40} />}
        {data?.organisations?.map((x, i) => (
          <React.Fragment key={i}>
            <div
              className={`${ProfilePopup.containerCSS} p-0 ${
                selectedOrg?._id === x?._id ? "activeColor" : ""
              }`}
            >
              <IconButton
                key={i}
                onClick={() => handleOrgSelect(x)}
                className={`flex d_flex ${ProfilePopup.colorClass}`}
              >
                <LightTooltip title={x.name?.length > 25 ? x.name : ""}>
                  <p
                    style={{ flex: 1, display: "flex" }}
                    className={`${ProfilePopup.projectName} textEllipse`}
                  >
                    {textTruncateMore(x.name, 25)}
                  </p>
                </LightTooltip>
              </IconButton>
            {  ["Admin", "Member++"].includes(userType?.userType) && <><CommonDelete
                style={{
                  fontSize: 16,
                }}
                className={ProfilePopup.colorClass}
                mutate={deleteMutate}
                isLoading={deleteLoading}
                data={{
                  orgId : x?._id
                }}

              />
              <CommonDialog
                actionComponent={
                  <EditOrganisation
                    setEditOrgId={setEditOrgId}
                    editRowId={editOrgId}
                    rowId={x?._id}
                    setEditOrgId={setEditOrgId}
                  />
                }
                modalTitle="Edit Organisation"
                content={<EditOrganisationContent orgData={x} />}
                width={300}
                height={"auto"}
                shouldOpen={editOrgId === x?._id}
                minWidth={450}
              />
              </>
              }
            </div>
            {/* <Divider className={ProfilePopup.divider_color} /> */}
          </React.Fragment>
        ))}
      </div>
      <Divider className={ProfilePopup.divider_color} />
      <CustomButton
        onClick={mutate}
        disabled={isLoading}
        loading={isLoading}
        width={"100%"}
      >
        Logout
      </CustomButton>
    </Card>
  );
}

const EditOrganisation = ({
  onClick,
  editRowId,
  rowId,
  handleClose,
  setEditOrgId,
}) => (
  <IconButton
    className={`${ProfilePopup.colorClass} pl-0`}
    onClick={() => {
      setEditOrgId(rowId);
      editRowId === rowId && handleClose();
      onClick();
    }}
  >
    <EditOutlinedIcon style={{ fontSize: 13 }} />
  </IconButton>
);

const EditOrganisationContent = ({ handleClose, orgData }) => {
  const [org, setOrg] = useState(orgData?.name);
  const [orgError, setOrgError] = useState("");
  const { isLoading, mutate } = useEditOrganisation(handleClose);
  const handleSubmit = () => {
    if (!org) setOrgError("Required!");
    else {
      setOrgError("");
      mutate({ data: { name: org }, orgId: orgData._id });
    }
  };
  return (
    <div>
      <TextField
        label="Edit Organisation Name"
        fullWidth
        value={org}
        onChange={(e) => setOrg(e.target.value)}
        helperText={orgError}
        error={orgError ? true : false}
        // className="mb-1"
      />

      <div className="d_flex justifyContent_end mt-2">
        <CustomButton
          loading={isLoading}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Update
        </CustomButton>
      </div>
    </div>
  );
};
