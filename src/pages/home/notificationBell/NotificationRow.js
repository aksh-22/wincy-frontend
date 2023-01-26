import { markReadSingle } from "api/notification";
import moment from "moment";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./NotificationBell.scss";

function NotificationRow({ data, status, pageNo, handleClose }) {
  const userId = useSelector((state) => state.userReducer?.userType?.userId);
  const isRead = data?.userStatus?.find((item) => item?.user === userId);
  const queryClient = useQueryClient();
  const { push } = useHistory();
  const makAsRead = () => {
    switch (data?.module) {
      case "Bug": {
        push(`/main/projects/${data?.project}/bugs`);
        break;
      }
      case "Task": {
        push(`/main/projects/${data?.project}/${data?.milestone}`);
        break;
      }
      case "Milestone": {
        push(`/main/projects/${data?.project}/${data?.milestone}`);
        break;
      }

      case "Query": {
        push(`/main/projects/${data?.project}/queries`);
        break;
      }
      default: {
        break;
      }
    }
    markReadSingle({ orgId: data?.organisation, notificationId: data?._id })
      .then((res) => {
        // let notificationList = queryClient.getQueryData([
        //   "notification",
        //   data?.organisation,
        //   status,
        //   pageNo,
        //   status === "All" ? "1000" : "100",
        // ]);

        // console.log(
        //   "notificationList",
        //   "notification",
        //   data?.organisation,
        //   status,
        //   pageNo,
        //   "100"
        // );
        // console.log("notificationList", notificationList);
      })
      .catch((err) => console.log("err", err));
    handleClose && handleClose();
  };
  return (
    <div className="notificationRow" onClick={makAsRead}>
      <div className="flex">
        <p className="lineClamp">{data?.description}</p>
        <div className="alignCenter">
          <p className="notificationRow_time flex">
            {moment(data?.createdAt).format("LT")}
          </p>
          <p className="notificationRow_time ">
            {moment(data?.createdAt).format("DD MMM, YYYY")}
          </p>
        </div>
      </div>

      {isRead?.isRead === false ? (
        <div className="notification_dot" />
      ) : (
        <div style={{ width: 10 }} />
      )}
    </div>
  );
}

export default NotificationRow;
