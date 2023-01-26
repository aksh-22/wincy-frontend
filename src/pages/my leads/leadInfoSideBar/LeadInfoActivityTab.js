import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CommonDelete from "components/CommonDelete";
import CustomButton from "components/CustomButton";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAddActivityLead } from "react-query/lead/leadActivity/useAddActivityLead";
import { useDeleteLeadActivity } from "react-query/lead/leadActivity/useDeleteLeadActivity";
import { useGetActivityInLead } from "react-query/lead/leadActivity/useGetActivityInLead";
import { useUpdateLeadActivity } from "react-query/lead/leadActivity/useUpdateLeadActivity";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { capitalizeFirstLetter } from "utils/textTruncate";
import "./LeadInfoSideBar.scss";

const quickActivity = [
  "Meeting Done",
  "Follow Up",
  "Awarded",
  "Meeting Cancelled",
  "Meeting Scheduled",
  'NDA Signed/Shared',
  'Proposal Sent',
  'Negotiation',
  'Estimation Sent'
];

// Follow up, Meeting Done, Meeting Cancelled, Meeting Scheduled, NDA signed/shared, Proposal sent, Negotiation, estimation sent
function LeadInfoActivityTab({ info }) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data, isLoading } = useGetActivityInLead(orgId, info?._id);
  const { mutate: addActivityMutate, isLoading: activityAddLoading } =
    useAddActivityLead();
  const { mutate: updateActivityMutate } = useUpdateLeadActivity();
  const { mutate: deleteActivityMutate  , isLoading : deleteLoading} = useDeleteLeadActivity();
  const [activityType, setActivityType] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    title: "",
    date: new Date(),
  });
  const [error, setError] = useState({
    title: "",
    date: "",
  });

  const onHandleChange = (value, name) => {
    setActivityDetails({
      ...activityDetails,
      [name]: value,
    });
    error[name] !== "" &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onHandleSubmit = () => {
    let tempError = {};
    let isError = false;
    if (!activityDetails?.title?.trim()?.length) {
      tempError = {
        ...tempError,
        title: "Activity title is required.",
      };
      isError = true;
    }

 
    if (isError) {
      setError(tempError);
    } else {
      addActivityMutate({
        data: {
          activity: activityDetails?.title,
          date: activityDetails?.date,
        },
        orgId,
        leadId: info?._id,
        callBack :() => {setActivityDetails({
            title: "",
            date: new Date(),
        })
        setActivityType(null)
    }
      });
    }
  };

  useEffect(() => {
    onHandleChange(activityType, "title");
  }, [activityType]);

  const onUpdateActivity = (value, leadActivityId) => {
    updateActivityMutate({
      data: {
        activity: value,
      },
      leadId: info?._id,
      orgId,
      leadActivityId: leadActivityId,
    });
  };

  return (
    <div>
      <div className="activitytabContent">
        <div className="activityBox">
          <div className="activityBoxlist">
            {quickActivity?.map((item, index) => (
              <div
                className={`activityItem cursorPointer ${
                  activityType === item && "selectedActivityItem"
                }`}
                onClick={() => setActivityType(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="activityForm">
            <input
              type="text"
              onChange={(e) => onHandleChange(e.target.value, "title")}
              value={activityDetails?.title}
              placeholder="Add Activity*"
              className={`activityForm_input ${error?.title ? "mb-0" : "mb-1"}`}
            />
            {error?.title && (
              <div
                className="alignCenter"
                style={{
                  color: "var(--red)",
                  fontSize: 12,
                  marginBottom: 15,
                  marginLeft: 15,
                  marginTop: 5,
                }}
              >
                <ErrorRoundedIcon
                  style={{
                    color: "var(--red)",
                    fontSize: 16,
                    marginRight: 5,
                  }}
                />
                {error?.title}
              </div>
            )}

            <CustomDatePicker onChange={(e) => onHandleChange(e, "date")}>
              {activityDetails?.date ? (
                <div className="activityForm_input">
                  {moment(activityDetails?.date, "MM-DD-YYYY").format(
                    "DD-MM-YYYY"
                  )}
                </div>
              ) : (
                <div className="activityForm_input">Activity Date*</div>
              )}
            </CustomDatePicker>
            {error?.date && (
              <div
                className="alignCenter"
                style={{
                  color: "var(--red)",
                  fontSize: 12,
                  marginBottom: 15,
                  marginLeft: 15,
                  marginTop: 5,
                }}
              >
                <ErrorRoundedIcon
                  style={{
                    color: "var(--red)",
                    fontSize: 16,
                    marginRight: 5,
                  }}
                />
                {error?.date}
              </div>
            )}

            {/* <input type="text" placeholder="Activity Date*"/> */}
            <div className="justifyContent_end d_flex mt-1">
              <CustomButton
                onClick={onHandleSubmit}
                loading={activityAddLoading}
              >
                <span className="">Create</span>
              </CustomButton>
            </div>
          </div>
        </div>

        <div className="activityList">
          {isLoading ? (
            <div>
              <TableRowSkeleton count={4} />
            </div>
          ) : (
            data?.activities?.map((item, index) => (
              <div className="activityListIcn boxShadow" key={item?._id}>
                <div className="spanBox">
                  {moment(item?.date).format("DD")}
                  <span> {moment(item?.date).format("MMM")}</span>
                </div>
                <div className="flex">
                  <h3>
                    {
                      <InputTextClickAway
                        value={capitalizeFirstLetter(item?.activity)}
                        onChange={(e) => {
                          onUpdateActivity(e, item?._id);
                        }}
                        textStyle={{
                          color: "#FFF",
                          paddingLeft: 0,
                        }}
                      />
                    }
                  </h3>
                  <p>By {item?.createdBy?.name}</p>
                </div>
                <CommonDelete
                  data={{
                    data: { activityIds: [item?._id] },
                    orgId,
                    leadId: info?._id,
                    leadActivityId : item?._id
                  }}
                  mutate={deleteActivityMutate}
                  isLoading={deleteLoading}
                  className={"cursorPointer"}

                />
              </div>
            ))
          )}
          {/* <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div>
                    <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div>
                    <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div>
                    <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div>
                    <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div>
                    <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div>
                    <div className="activityListIcn">
                        <div className="spanBox">
                            10
                            <span>JAN</span>
                        </div>
                        <div>
                            <h3>Meeting done.</h3>
                            <p>By Vibha</p>
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
}

export default LeadInfoActivityTab;
