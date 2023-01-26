import { ClickAwayListener } from "@material-ui/core";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { getNotificationCount, resetNotificationCount } from "api/notification";
import CustomChip from "components/CustomChip";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import Loading from "components/loading/Loading";
import React, { useEffect, useState } from "react";
import { useGetNotification } from "react-query/notification/useGetNotification";
import { useGetNotificationCount } from "react-query/notification/useGetNotificationCount";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import "./NotificationBell.scss";
import NotificationRow from "./NotificationRow";
import NotificationSideBar from "./NotificationSideBar";
function NotificationBell({ orgId }) {
  const [pageNo, setPageNo] = useState(1);
  const [status, setStatus] = useState("UnRead");

  const { data, isLoading , isRefetching  , refetch:notificationRefetch } = useGetNotification({
    orgId,
    status: status,
    pageNo: pageNo,
    pageSize: "100",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
const {data:count , refetch} = useGetNotificationCount({orgId})
  useEffect(() => {
    orgId && refetch()
  }, [orgId]);
  useEffect(() => {
    notificationRefetch()
  }, [count ,isOpen])
  

  useEffect(() => {
    setNotificationCount(count?.notificationCount)
  }, [count])
  
  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          className="boxShadow bellIconContainer"
          onClick={() => {
            setNotificationCount(0)
            resetNotificationCount({ orgId })
            setIsOpen(!isOpen);
          }}
        >
          <NotificationsRoundedIcon />

          {notificationCount > 0 && (
            <div className="bell_count">
              <p>{notificationCount}</p>
            </div>
          )}
        </div>

        {isOpen && (
          <div
            className="notificationPopup "
            onClick={(event) => {
              event?.preventDefault();
              event?.stopPropagation();
            }}
          >
            <div className="alignCenter p-1">
<div className="alignCenter flex">
<h3 className="">Notification</h3>
{
  isRefetching && <div className="ml-1 alignCenter"><Loading loadingType={"spinner"} backgroundColor="#FFF" /> </div>
}
  </div>
              <p
                onClick={() => {
                  setIsSideBarOpen(true);
                  setIsOpen(false);
                }}
                className="cursorPointer"
              >
                View All
              </p>
            </div>

            <div className="alignCenter p-1">
              <CustomChip label="All"
              className={"mr-1"}
              bgColor={status === "All" ? "var(--lightBlue)" : "transparent"}
              handleClick={() => setStatus("All")}
              />

              <CustomChip label="Unread"
              bgColor={status === "UnRead" ? "var(--lightBlue)" : "transparent"}
              handleClick={() => setStatus("UnRead")}
              />

               </div>

            <div className="boxShadow" style={{ overflow: "auto", height: "85%"  , background:"#2f3453" , borderRadius:8}}>
              {isLoading ? (
                <TableRowSkeleton count={5} style={{margin:10}}/>
              ) : (
                data?.notifications?.map((item) => (
                  <NotificationRow
                    key={item?._id}
                    data={item}
                    pageNo={pageNo}
                    status={status}
                    handleClose={() => setIsOpen(false)}

                  />
                ))
              )}
              {/* {new Array(20).fill("").map((item, index) => (
                <NotificationRow key={index} />
              ))} */}
            </div>
          </div>
        )}
        <CustomSideBar
          show={isSideBarOpen}
          toggle={() => setIsSideBarOpen(false)}
        >
          <NotificationSideBar orgId={orgId}/>
        </CustomSideBar>
      </div>
    </ClickAwayListener>
  );
}

export default NotificationBell;
