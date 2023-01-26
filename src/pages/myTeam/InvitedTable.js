import React from "react";
import { useInvitedOrgUser } from "react-query/organisations/useInvitedOrgUser";
import { useRevokeInvite } from "react-query/organisations/useRevokeInvite";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import ListElIn from "./ListElIn";
import styles from "./MyTeam.module.css";
import { useSelector } from "react-redux";
import NoData from "components/NoData";

export default function InvitedTable({ sidebarHandler }) {
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );
  const orgId = selectedOrg?._id;
  const { isLoading, data } = useInvitedOrgUser(orgId);

  const { mutate, isLoading: revokeLoading } = useRevokeInvite();

  const revokeHandler = (email) => {
    const data = {
      orgId,
      data: {
        email: email,
      },
    };
    mutate(data);
  };

  const showListEl = () => {
    return data?.invitations?.length === 0 ? (
      <NoData />
    ) : (
      data?.invitations?.map((el) => (
        <ListElIn
          el={el}
          sidebarHandler={sidebarHandler}
          email={el.sentTo}
          role={el.userType}
          designation={el.designation}
          revokeHandler={revokeHandler}
          key={Math.floor(Math.random() * 10000)}
          isLoading={revokeLoading}
          orgId={orgId}
        />
      ))
    );
  };

  return (
    <div className={styles.tableArea}>
      <div className={styles.tableHeadIn}>
        <p>Mail Id</p>
        <p>Role</p>
        <p>Designation</p>
        <p></p>
      </div>
      {isLoading ? <TableRowSkeleton count={7} height={50} /> : showListEl()}
    </div>
  );
}
