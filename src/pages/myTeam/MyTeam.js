import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ArchiveIcon from "@material-ui/icons/Archive";
import GroupIcon from "@material-ui/icons/Group";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CommonDialog from "components/CommonDialog";
import CustomButton from "components/CustomButton";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import MyTeamDialogueContent from "components/dialogContent/MyTeamDialogueContent";
import CheckBoxSquare from "components/icons/CheckBoxSquare";
import MyTeamSidebarInfo from "components/myTeamSidebarInfo/myTeamSidebarInfo";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InvitedTable from "./InvitedTable";
import styles from "./MyTeam.module.css";
import TeamTable from "./TeamTable";

function MyTeam() {
  const [state, setState] = useState(false);
  const [showTeamActive, setShowTeamActive] = useState(true);
  const [sidebarData, setSidebarData] = useState([]);

  const sidebarHandler = (el) => {
    setState(!state);
    setSidebarData(el);
  };

  const userType = useSelector((state) => state.userReducer?.userType.userType);
  const shouldShowInfo = userType === "Admin" || userType === "Member++";
  const [search, setSearch] = useState(null);
  const [showProjectName, setShowProjectName] = useState(false);
  useEffect(() => {
    setSearch(null);
  }, [showTeamActive]);

  return (
    <div>
      <CustomSideBar show={state} toggle={() => setState(!state)}>
        <MyTeamSidebarInfo userData={sidebarData} />
      </CustomSideBar>

      <div
        className="alignCenter mx-2"
        style={{
          justifyContent: "space-between",
        }}
      >
        {shouldShowInfo && showTeamActive ? (
          <div
            className="alignCenter cursorPointer"
            onClick={() => setShowProjectName(!showProjectName)}
          >
            <CheckBoxSquare className={"mr-1"} isChecked={showProjectName} />
            <p>Show Project Name</p>
          </div>
        ) : (
          <div />
        )}

        <div className="alignCenter">
          <BtnWrapper>
            <CustomButton
              // style={{ marginRight: "10px" }}
              type={showTeamActive ? "contained" : "text"}
              loading={false}
              onClick={() => {
                setShowTeamActive(true);
              }}
              // disabled={!shouldShowInfo}
            >
              <GroupIcon
                style={{
                  fontSize: 20,
                  color: showTeamActive
                    ? "var(--defaultWhite)"
                    : "var(--defaultWhite)",
                }}
              />
              <p
                style={{
                  margin: "5px",
                  color: showTeamActive
                    ? "var(--defaultWhite)"
                    : "var(--defaultWhite)",
                }}
              >
                Team
              </p>
            </CustomButton>
            {(userType === "Admin" || userType === "Member++") && (
              <CustomButton
                type={!showTeamActive ? "contained" : "text"}
                onClick={() => {
                  setShowTeamActive(false);
                }}
              >
                <ArchiveIcon
                  style={{
                    color: !showTeamActive
                      ? "var(--defaultWhite)"
                      : "var(--defaultWhite)",
                    fontSize: 20,
                  }}
                />
                <p
                  style={{
                    margin: "5px",
                    color: !showTeamActive
                      ? "var(--defaultWhite)"
                      : "var(--defaultWhite)",
                  }}
                >
                  Invited Member
                </p>
              </CustomButton>
            )}
          </BtnWrapper>
          {shouldShowInfo && (
            <CommonDialog
              actionComponent={
                <LightTooltip title="Invite Member">
                  <div className={styles.iconWrapper}>
                    <IconButton>
                      <AddIcon
                        style={{ color: "var(--defaultWhite)", fontSize: 30 }}
                      />
                    </IconButton>
                  </div>
                </LightTooltip>
              }
              modalTitle="Invite"
              content={
                <MyTeamDialogueContent
                  email={true}
                  designation={true}
                  select={true}
                  btn="Submit"
                  dialogueType="invite"
                  // onSubmit={(data) => submitHandler(data)}
                />
              }
              width={450}
              height={"auto"}
              dialogContentClass={"pt-0"}
            />
          )}
        </div>
        {showTeamActive ? (
          <div
            style={{
              // position:"absolute",
              // top:"-30%",
              // right:"1%",
              display: "flex",
              alignItems: "center",
              border: "1px solid #B6BAD5",
              height: 35,
              background: "var(--blakish)",
            }}
          >
            <input
              type="search"
              name="search"
              autoComplete="new-password"
              placeholder="Search"
              style={{
                border: "none",
                paddingLeft: 5,
              }}
              onChange={(event) => setSearch(event?.target?.value)}
            />
            <SearchRoundedIcon
              style={{
                color: "#B6BAD5",
              }}
            />
          </div>
        ) : (
          <div />
        )}
      </div>

      <div className={styles.myteam}>
        <div style={{ width: "100%" }}>
          {showTeamActive ? (
            <TeamTable
              sidebarHandler={sidebarHandler}
              search={search}
              setSearch={setSearch}
              showProjectName={showProjectName}
            />
          ) : (
            <InvitedTable sidebarHandler={sidebarHandler} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTeam;
