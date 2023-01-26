import { Avatar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import DeleteIcon from "@material-ui/icons/Delete";
import LinkIcon from "@material-ui/icons/Link";
import CommonDialog from "components/CommonDialog";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useRevokeInvite } from "react-query/organisations/useRevokeInvite";
import { useSendInvite } from "react-query/organisations/useSendInvite";
import { successToast } from "utils/toast";
import styles from "./MyTeam.module.css";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function ListElIn({
  el,
  name,
  email,
  role,
  designation,
  orgId,
}) {
  const classes = useStyles();

  const { mutate: inviteMutate, isLoading: mutateLoading } =
    useSendInvite(true);

  const { mutate, isLoading } = useRevokeInvite();

  const revokeHandler = () => {
    const data = {
      orgId,
      data: {
        email: email,
      },
    };
    mutate(data, {
      onSuccess: () => {
        // handleClose();
      },
    });
  };

  const sendLinkHandler = () => {
    const data = {
      orgId,
      data: {
        email: email,
        designation: designation,
        userType: role,
      },
    };
    inviteMutate(data, {
      onSuccess: () => {
        successToast("invitation sent again");
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        opacity: el.newData ? 0.2 : 1,
      }}
    >
      <div className={styles.tableElHead}>
        {name && <p>Team</p>}
        <p>Mail Id</p>
        <p>Role</p>
        <p>Designation</p>
      </div>
      <div
        className={styles.tableElIn}
        style={{
          backgroundColor: "var(--milestoneRowElColor)",
        }}
        key={el.name + el.email}
      >
        <div className={styles.side}></div>
        {name && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar className={classes.small} src={el.profilePicture} />
            <p style={{ marginLeft: "10px" }}>{name && name}</p>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "auto",
          }}
        >
          <p style={{ marginRight: 10 }}>{email ?? "user email"}</p>
        </div>
        <p>{role ?? "abc"}</p>
        <p>{designation ?? "abc"}</p>
        <div className={`${styles.elIcon}`}>
          {mutateLoading ? (
            <div className={styles.loadingIcon}>
              <AutorenewIcon style={{ color: "var(--defaultWhite)" }} />
            </div>
          ) : (
            <LightTooltip title="Send invite again">
              <IconButton onClick={sendLinkHandler}>
                <LinkIcon
                  className="cursorPointer"
                  style={{ color: "var(--defaultWhite)" }}
                />
              </IconButton>
            </LightTooltip>
          )}
          <CommonDialog
            actionComponent={
              <LightTooltip title="Revoke invitation">
                <DeleteIcon style={{ color: "var(--red)" }} />
              </LightTooltip>
            }
            modalTitle="Revoke Invitation"
            content={
              <ConfirmDialog
                onClick={() => revokeHandler(email)}
                isLoading={isLoading}
                warning="Are you sure you want to revoke this invitation?"
              />
            }
            width={450}
            height={"auto"}
            dialogContentClass={"pt-0"}
          />
        </div>
      </div>
    </div>
  );
}
