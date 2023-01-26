import React from "react";
import styles from "./myTeamSidebarInfo.module.css";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { IconButton } from "@material-ui/core";
import CustomAvatar from "components/CustomAvatar";
import CustomButton from "components/CustomButton";
import ArchiveIcon from "@material-ui/icons/Archive";
import CommonDialog from "components/CommonDialog";
import MyTeamDialogueContent from "components/dialogContent/MyTeamDialogueContent";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useRemoveOrgUser } from "react-query/organisations/useRemoveOrgUser";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  btn: {
    color: "red",
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translate(-50%,-30px)",
  },
}));

export default function MyTeamSidebarInfo({ toggle, userData }) {
  const classes = useStyles();

  const userType = useSelector((state) => state.userReducer?.userType.userType);

  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );

  const { mutate, isLoading } = useRemoveOrgUser();

  const orgId = selectedOrg?._id;

  const removeHandler = (handleClose) => {
    const data = {
      orgId,
      userId: userData._id,
    };

    mutate(data, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <div className={styles.myTeamSidebarInfo}>
      <div className={styles.myTeamSidebarInfoHead}>
        <div className={styles.myTeamSidebarInfoHeadEL}>
          <CustomAvatar />
          <p>{userData.name}</p>
        </div>
        <div className={styles.myTeamSidebarInfoHeadEL}>
          <IconButton onClick={toggle}>
            <CloseRoundedIcon
              style={{ color: "var(--primary)", fontSize: 30 }}
            />
          </IconButton>
        </div>
      </div>
      {userData.invitationAccepted ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 100,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            User haven't accepted invitation yet!!
          </h3>
        </div>
      ) : (
        <>
          <div className={styles.btnArea}>
            <CommonDialog
              actionComponent={
                <CustomButton type="outlined">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <ArchiveIcon
                      style={{ color: "var(--primary)", fontSize: 20 }}
                    />
                    <p
                      style={{
                        margin: "5px",
                        color: "var(--primary)",
                        textTransform: "capitalize",
                      }}
                    >
                      Assign Role
                    </p>
                  </div>
                </CustomButton>
              }
              modalTitle="Invite"
              content={
                <MyTeamDialogueContent
                  email={false}
                  designation={true}
                  select={true}
                  btn="Assign"
                  onSubmit={(data) => console.log(data)}
                />
              }
              width={450}
              height={"auto"}
              dialogContentClass={"pt-0"}
            />
          </div>
          <div className={styles.details}>
            <p>Account Details :</p>
            <div className={styles.table}>
              <p>IFSC Code</p>
              <p>Account No.</p>
              <p>{userData.ifsc}</p>
              <p>{userData.accNo}</p>
            </div>
          </div>
        </>
      )}
      {(userType === "Admin" || userType === "Member++") && (
        <CommonDialog
          actionComponent={
            <Button
              variant="contained"
              className={classes.btn}
              // onClick={}
            >
              <DeleteForeverIcon />
              Remove User
            </Button>
          }
          modalTitle="Are you sure"
          content={
            <ConfirmDialog
              onClick={(handleClose) => removeHandler(handleClose)}
              isLoading={isLoading}
            />
          }
          width={450}
          height={"auto"}
          dialogContentClass={"pt-0"}
        />
      )}
    </div>
  );
}

// function SelectRender({ item }) {
//   return (
//     <div className={`${css.selectRo1w} normalFont d_flex alignCenter`}>
//       <CustomAvatar src={item?.profilePicture} small variant="circle" />
//       <p className="pl-1"> {item?.name}</p>
//     </div>
//   );
// }
