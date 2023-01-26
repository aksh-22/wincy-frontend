import React, { useState, useEffect, useRef, memo } from "react";
import InfoIcon from "@material-ui/icons/Info";
import CustomAvatar from "components/CustomAvatar";
import CustomMenu from "components/CustomMenu";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import BugInfoSidebar from "pages/projects/bug/BugInfoSidebar";
import CommonDialog from "components/CommonDialog";
import AddBugModal from "pages/projects/bug/AddBugModal";
import { useQueryClient } from "react-query";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import CustomPopper from "components/CustomPopper";
import BugAssignees from "pages/projects/bug/BugAssignees";
import { useMyworkUpdateBug } from "react-query/mywork/useMyworkUpdateBug";
import { Checkbox } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { useSelector } from "react-redux";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import { useMyworkBugs } from "react-query/mywork/useMyworkBugs";
import CustomCheckbox from "./CustomCheckbox";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { infoToast, warnToast } from "utils/toast";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { textTruncateMore } from "utils/textTruncate";
let bugName = "";
const BugTableData =
  // memo(
  ({
    platform,
    projectInfo,
    projectId,
    orgId,
    checkedBug,
    handleCheckedBug,
    setPlatform,
    team,
    filter,
    bugsData,
    data
  }) => {
    console.log(data)
    const [currentBugIndex, setCurrentBugIndex] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const loggedInUser = useSelector(
      (state) => state.userReducer?.userData?.user
    );
    // loggedInUser._id
    const userRole = useSelector(
      (state) => state.userReducer?.userType?.userType
    );

    // const { isBugsLoading, bugsData, statusBugs } = useMyworkBugs(
    //   orgId,
    //   projectId,
    //   pageNo
    // );

    console.log("* bugsData:", bugsData);

    // console.log("currentBugIndex:", currentBugIndex);
    const [currentBugId, setCurrentBugId] = useState("");

    const handleBugNameChange = (e) => {
      // console.log("e:", e.target.name, e.target.value);
      // setBugName(e.target.value);
      bugName = e.target.value;
    };

    const onSubmitBugName = (e) => {
      // console.log("bugName:", bugName.current);
      if (bugName) {
        // console.log("bugName:", bugName);
        let data = {
          title: bugName,
        };

        let sendData = {
          orgId: orgId,
          bugId: currentBugId,
          data: data,
        };
        // console.log("sendData:", sendData);
        mutateMyworkUpdateBug(sendData);
      } else {
        // infoToast("Please enter something");
        setCurrentBugId("");
      }
    };

    const [currentlyEditingMenu, setCurrentlyEditingMenu] = useState(null);

    const { isLoadingMyworkUpdateBug, mutateMyworkUpdateBug } =
      useMyworkUpdateBug(
        orgId,
        projectInfo?.project?._id,
        pageNo,
        // setEditEnable,
        currentBugId !== "" ? setCurrentBugId : setCurrentlyEditingMenu,
        platform
      );
    const handlePriority = (bugId) => (selectedMenuItem) => {
      console.log('dcscc', bugId, selectedMenuItem)
      let data = {
        priority: selectedMenuItem.value,
      };
      setCurrentlyEditingMenu("priority");

      let sendData = {
        orgId: orgId,
        bugId: bugId,
        data: data,
      };
      mutateMyworkUpdateBug(sendData);
    };

    const handleTesterStatus = (bugId) => (selectedMenuItem) => {
      let data = {
        testerStatus: selectedMenuItem.value,
      };
      setCurrentlyEditingMenu("testerStatus");

      let sendData = {
        orgId: orgId,
        bugId: bugId,
        data: data,
      };
      mutateMyworkUpdateBug(sendData);
    };

    const handleDeveloperStatus = (bugId) => (selectedMenuItem) => {
      let data = {
        developerStatus: selectedMenuItem.value,
      };
      setCurrentlyEditingMenu("developerStatus");

      let sendData = {
        orgId: orgId,
        bugId: bugId,
        data: data,
      };
      mutateMyworkUpdateBug(sendData);
    };

    // filter variables
    const { projectIds, priority, developerStatus, testerStatus } = filter;

    // console.log("bugTableData 3 filter: ", filter);
    // console.log("developerStatus:", developerStatus);
    const handleAssigneeUpdate = ({ assigneeId, otherId, assigneeData }) => {
      mutateMyworkUpdateBug({
        orgId: orgId,
        bugId: otherId,
        data: {
          assignee: assigneeId ?? "",
        },
        additionalInfo: {
          assignee: assigneeData,
        },
      });
    };

    const [showInfo, setShowInfo] = useState(false);
    const toggleShowInfo = () => {
      setShowInfo(!showInfo)
    }
    return (
      <>
        <div
          className="my_table_data_row"
          style={{
            width: "100%",
            backgroundColor: "var(--milestoneRowAddColor)",
          }}
        >
          <div className={`disable_checkbox `}>
            {/* <Checkbox
              className="showCheckbox"
              // onChange={(e) => handleCheckedBug(e)}

              inputProps={{ "aria-label": "primary checkbox" }}
            /> */}
          </div>
          <CommonDialog
            actionComponent={<AddBugLine />}
            modalTitle="Add Bug"
            content={
              <AddBugModal
                type="myWork"
                platform={platform}
                projectInfo={projectInfo?.project}
                pageNo={pageNo}
              />
            }
            width={450}
            height={300}
            dialogContentClass={"pt-0"}
          />
        </div>
        {false === true ? (
          <>
            <TableRowSkeleton count={2} height={30} />
          </>
        ) : null}

        {priority?.length || developerStatus?.length || testerStatus?.length ? (
          <>
            {console.log("got filter parameter length")}
            {
            data[0]
              ?.bugs?.map((row, i) => {
                // console.log("bugsData row:", row);
                if (row.developerStatus === "Solved") {
                  // console.log("developerStatus:", developerStatus);
                  // console.log(developerStatus?.includes(row?.developerStatus));
                  // console.log("===");
                }

                return (
                  <>
                    {(priority?.includes(row?.priority) ||
                      developerStatus?.includes(row?.developerStatus) ||
                      testerStatus?.includes(row?.testerStatus)) && (
                      <MyWorkBugTableDataRow
                        key={i}
                        row={row}
                        i={i}
                        setCurrentBugId={setCurrentBugId}
                        handleBugNameChange={handleBugNameChange}
                        onSubmitBugName={onSubmitBugName}
                        setCurrentBugIndex={setCurrentBugIndex}
                        handlePriority={handlePriority(row?._id)}
                        handleTesterStatus={handleTesterStatus(row?._id)}
                        handleDeveloperStatus={handleDeveloperStatus}
                        checkedBug={checkedBug}
                        loggedInUser={loggedInUser}
                        handleCheckedBug={handleCheckedBug}
                        setPlatform={setPlatform}
                        platform={platform}
                        currentlyEditingMenu={currentlyEditingMenu}
                        projectInfo={projectInfo}
                        currentBugId={currentBugId}
                        orgId={orgId}
                        pageNo={pageNo}
                        team={team}
                        handleAssigneeUpdate={handleAssigneeUpdate}
                        toggleShowInfo={toggleShowInfo}
                      />
                    )}
                  </>
                );
                // return ends here
              })}
          </>
        ) : (
          // map ends here

          <>
            {console.log("got no paramter in filter")}
            {data[0]
              ?.bugs?.map((row, i) => {
                return (
                  <MyWorkBugTableDataRow
                    key={i}
                    row={row}
                    i={i}
                    setCurrentBugId={setCurrentBugId}
                    handleBugNameChange={handleBugNameChange}
                    onSubmitBugName={onSubmitBugName}
                    setCurrentBugIndex={setCurrentBugIndex}
                    handlePriority={handlePriority(row?._id)}
                    handleTesterStatus={handleTesterStatus(row?._id)}
                    handleDeveloperStatus={handleDeveloperStatus}
                    checkedBug={checkedBug}
                    loggedInUser={loggedInUser}
                    handleCheckedBug={handleCheckedBug}
                    setPlatform={setPlatform}
                    platform={platform}
                    currentlyEditingMenu={currentlyEditingMenu}
                    projectInfo={projectInfo}
                    currentBugId={currentBugId}
                    orgId={orgId}
                    pageNo={pageNo}
                    team={team}
                    handleAssigneeUpdate={handleAssigneeUpdate}
                    toggleShowInfo={toggleShowInfo}
                  />
                );
              })}
          </>
        )}

        {
          <CustomSideBar
            toggle={toggleShowInfo}
            show={showInfo}
          >
            <BugInfoSidebar
              bug={
                bugsData?.find((x) => String(x._id) === platform)?.bugs[
                  currentBugIndex
                ]
              }
              projectInfo={projectInfo?.project}
              platform={platform}
              pageNo={pageNo}
              activeBug={platform}
              fromModule="mywork"
              disabled={
                bugsData?.find((x) => String(x._id) === platform)?.bugs[
                  currentBugIndex
                ]?.createdBy?.[0]?._id !== loggedInUser?._id
              }
              developerEditEnable={
                bugsData?.find((x) => String(x._id) === platform)?.bugs[
                  currentBugIndex
                ]?.assignee?.[0]?._id !== loggedInUser?._id
              }
              team={team}
            />
          </CustomSideBar>
        }
      </>
    );
  };
// );

export default BugTableData;

function AddBugLine({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="alignCenter d_flex  inheritParent flex cursorPointer"
    >
      + Add Bug
    </div>
  );
}

const MyWorkBugTableDataRow = ({
  row,
  setCurrentBugId,
  handleBugNameChange,
  onSubmitBugName,
  setCurrentBugIndex,
  handlePriority,
  handleTesterStatus,
  handleDeveloperStatus,
  checkedBug,
  loggedInUser,
  handleCheckedBug,
  setPlatform,
  platform,
  i,
  orgId,
  pageNo,
  currentBugId,
  projectInfo,
  currentlyEditingMenu,
  team,
  handleAssigneeUpdate,
  toggleShowInfo
}) => {
  // console.log("in data row:", row);

  return (
    <div
      key={row?._id}
      className={`${"my_table_data_row"}  ${row?.testerStatus === "Approved" ? "completedRow" : ""}`}
      style={{
        opacity: `${
          row.updationKey === "localData" || row.updationKey === row._id
            ? ".3"
            : "1"
        }`,
      }}
    >
      <div
        className={`checkbox_hoverable ${
          checkedBug?.length > 0 ? "showHover" : ""
        }
        ${checkedBug.length !== 0 ? "rowSelected" : ""}
        ${row.createdBy?.[0]?._id !== loggedInUser?._id && "cursorNotAllowed"}  ${row?.testerStatus === "Approved" ? "completedRowSideLine" : ""}`}
      >
        <Checkbox
          inputProps={{ "aria-label": "primary checkbox" }}
          size="small"
          className="showCheckbox"
          checked={checkedBug?.includes(row?._id)}
          onClick={() => {
            if (loggedInUser._id === row.createdBy[0]._id) {
              handleCheckedBug(row?._id);
              setPlatform(platform);
            }
          }}
          disabled={row.createdBy?.[0]?._id !== loggedInUser?._id}
        />
      </div>
      <div className="my_table_data_col">
        <div
          className="bugId"
          style={{
            marginRight: "2rem",
            width: "2rem",
          }}
        >
          {projectInfo?.project.title?.substring(0, 3)?.toLowerCase()}#{row.sNo}
        </div>
        <div className="bugNameGrp">
          {/* bug name  */}
          {currentBugId === row._id ? (
            <ClickAwayListener onClickAway={() => setCurrentBugId("")}>
              <input
                type="text"
                defaultValue={row?.title}
                onChange={(e) => handleBugNameChange(e)}
                onKeyPress={(e) => e.key === "Enter" && onSubmitBugName(e)}
                autoFocus
              />
            </ClickAwayListener>
          ) : (
            <LightTooltip title={row?.title}>
              <p
                className="textEllipse"
                style={{ width: "100%", overflow: "hidden" }}
                onClick={() => {
                  row.createdBy?.[0]?._id === loggedInUser?._id &&
                    setCurrentBugId(row._id);
                  bugName = "";
                }}
              >
                {textTruncateMore(row?.title, 40)}
              </p>
            </LightTooltip>
          )}

          {/* bug name ends */}
        </div>
      </div>
      <div
        className="iconwrap"
        // style={{
        //   margin: "0 1em",
        //   display: "flex",
        //   justifyContent: "space-between",
        // }}
      >
        <InfoOutlinedIcon
          // color="primary"
          style={{ cursor: "pointer", marginRight: ".5rem" }}
          onClick={() => {setCurrentBugIndex(i) ;     toggleShowInfo()}}
        />
        <AssigneeSelection
          assignee={row?.assignee}
          disabled={row.createdBy?.[0]?._id !== loggedInUser?._id}
          team={team ?? []}
          onChange={handleAssigneeUpdate}
          otherId={row?._id}
        />
        {/* <CustomPopper
              disabled={row.createdBy?.[0]?._id !== loggedInUser?._id}
              value={
                <CustomAvatar
                  small
                  className="mx-1"
                  variant="circular"
                  src={
                    Array.isArray(row?.assignee)
                      ? row?.assignee?.[0]?.profilePicture
                      : row?.assignee?.profilePicture
                  }
                  title={
                    Array.isArray(row?.assignee)
                      ? row?.assignee?.[0]?.name
                      : row?.assignee?.name
                  }
                />
              }
              content={
                <BugAssignees
                  orgId={orgId}
                  bugId={row?._id}
                  projectInfo={projectInfo?.project}
                  currentAssignee={
                    Array.isArray(row?.assignee)
                      ? row?.assignee?.[0]
                      : row?.assignee
                  }
                  pageNo={pageNo}
                  platform={platform}
                  fromModule="mywork"
                />
              }
              noHover={true}
            /> */}
        {/* src={row?.assignee[0].profilePicture} */}
      </div>
      <div
        className="my_table_data_col border_solid_bottom border_solid_left"
        style={{ width: "100%", height: "100%" }}
      >
        <CustomMenu
          menuItems={[
            { label: "Low", value: "Low", menuName: "priority" },
            {
              label: "Medium",
              value: "Medium",
              menuName: "priority",
            },
            { label: "High", value: "High", menuName: "priority" },
          ]}
          id={row?._id}
          name={currentlyEditingMenu}
          //   mutate={row?.mutate}
          disabled={row.createdBy?.[0]?._id !== loggedInUser?._id}
          handleMenuClick={handlePriority}
          activeMenuItem={addSpaceUpperCase(row.priority)}
          // activeMenuItem={() => addSpaceUpperCase(row.priority)}
        />
      </div>
      <div
        className="my_table_data_col border_solid_bottom border_solid_left"
        style={{ width: "100%", height: "100%" }}
      >
        <CustomMenu
          menuItems={[
            {
              label: "Approved",
              value: "Approved",
              menuName: "testerStatus",
            },
            {
              label: "Pending",
              value: "Pending",
              menuName: "testerStatus",
            },
          ]}
          id={row?._id}
          //   mutate={row?.mutate}
          disabled={
            row.createdBy?.[0]?._id !== loggedInUser?._id ||
            row?.developerStatus === "Pending"
              ? true
              : false
          }
          handleMenuClick={ handleTesterStatus}
          name={currentlyEditingMenu}
          activeMenuItem={addSpaceUpperCase(row.testerStatus)}
        />
      </div>
      <div
        className="my_table_data_col border_solid_bottom border_solid_left"
        style={{ width: "100%", height: "100%" }}
      >
        <CustomMenu
          menuItems={[
            {
              label: "Solved",
              value: "Solved",
              menuName: "developerStatus",
            },
            {
              label: "Pending",
              value: "Pending",
              menuName: "developerStatus",
            },
          ]}
          id={row?._id}
          //   mutate={row?.mutate}
          disabled={row?.assignee?.[0]?._id !== loggedInUser?._id}
          handleMenuClick={handleDeveloperStatus(row._id)}
          name={currentlyEditingMenu}
          activeMenuItem={addSpaceUpperCase(row.developerStatus)}
        />
      </div>
    </div>
  );
};
