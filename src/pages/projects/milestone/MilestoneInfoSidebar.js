import React from "react";
import css from "css/ProjectInfo.module.css";
import "css/Milestone.css";
import { useMilestoneInfo } from "react-query/milestones/useMilestoneInfo";
import CustomRow from "components/CustomRow";
import { useSingleUpdateMilestone } from "react-query/milestones/useSingleUpdateMilestone";
import { useDeleteMilestone } from "react-query/milestones/useDeleteMilestone";
import MilestoneSidebarSkeleton from "skeleton/milestoneSidebar/MilestoneSidebarSkeleton";
import CloseButton from "components/CloseButton";
import Image from "components/defaultImage/Image";
import HeadingLabelSideBar from "components/HeadingLabelSideBar";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/textTruncate";

function MilestoneInfoSidebar({
  toggle,
  orgId,
  projectId,
  milestoneId,
  disabled,
}) {
  const { mutate } = useSingleUpdateMilestone();
  const userType = useSelector((state) => state.userReducer?.userType);
  const { isLoading: deletionLoading, deleteMilestoneMutate } =
    useDeleteMilestone();
  const { isLoading, data } = useMilestoneInfo(orgId, projectId, milestoneId);
  const editorRef = React.useRef("");

  try {
    var { milestone } = data;
  } catch (err) {
    console.error("milestone");
  }

  const onValueChange = (value, field, key) => {
    milestoneId &&
      mutate({
        orgId,
        projectId,
        milestoneId,
        data: {
          [key]:
            key === "isSettled"
              ? value === "Yes"
                ? true
                : false
              : value === "Not Started"
              ? "NotStarted"
              : value,
        },
        paymentInfo: [
          "amount",
          "currency",
          "isSettled",
          "paymentMode",
          "settledOn",
        ].includes(key),
      });
  };

  return isLoading ? (
    <MilestoneSidebarSkeleton />
  ) : (
    <>
      <div className="d_flex  selectPopOver">
        <div className="d_flex alignCenter flex">
          <Image
            type="createdBy"
            src={milestone?.createdBy?.profilePicture}
            title={milestone?.createdBy?.name}
            style={{
              height: 50,
              width: 50,
              fontSize: 22,
            }}
          />
          <CustomRow
            value={capitalizeFirstLetter(milestone?.title)}
            apiKey={"title"}
            onChange={onValueChange}
            inputType="text"
            inputTextClassName="titleInput "
            valueClassName="titleValue"
            disabled={disabled}
            nonTruncate
            containerClass={"flex"}
          />
        </div>

        <div className=" d_flex justifyContent_end">
          <CloseButton
            onClick={toggle}
            data={{
              data: "",
              orgId,
              milestoneId,
              projectId,
            }}
            mutate={deleteMilestoneMutate}
            isLoading={deletionLoading}
            otherFunction={toggle}
            normalClose={!disabled}
          />
        </div>
      </div>

      <div
        className="my-1"
        style={{
          borderBottom: "3px solid var(--divider)",
          height: 10,
          width: "100%",
        }}
      />

      <div className="mb-2">
        <CustomTextEditor
          ref={editorRef}
          value={milestone?.description}
          updateData={(value) => {
            milestone?.description !== value &&
              onValueChange(value, undefined, "description");
          }}
          disable={disabled}
        />
      </div>

      <HeadingLabelSideBar type="basic" />

      <div style={{ overflowY: "auto", height: "inherit" }}>
        <div className={css.tableContainer}>
          <CustomRow
            value={milestone?.dueDate}
            field={"Deadline"}
            inputType="date"
            onChange={onValueChange}
            apiKey={"dueDate"}
            disabled={disabled}
          />
        </div>
        {["Admin" , "Member++"].includes(userType?.userType) && (
          <div className="thirdSection my-1">
            <HeadingLabelSideBar type="sensitive" />

            <div className={`${css.tableContainer}`}>
              <CustomRow
                value={
                  milestone?.paymentInfo
                    ? milestone?.paymentInfo?.amount ?? ""
                    : ""
                }
                field={"Amount"}
                inputType="number"
                onChange={onValueChange}
                apiKey={"amount"}
              />

              <CustomRow
                value={
                  milestone?.paymentInfo
                    ? milestone?.paymentInfo?.isSettled
                      ? "Yes"
                      : "No"
                    : "-"
                }
                field={"Is Paid"}
                onChange={onValueChange}
                apiKey="isSettled"
                inputType="select"
                menuItems={["Yes", "No"]}
              />

              <CustomRow
                value={
                  milestone?.paymentInfo
                    ? milestone?.paymentInfo?.settledOn
                    : "-"
                }
                field={"Paid On"}
                inputType="date"
                onChange={onValueChange}
                apiKey="settledOn"
              />

              <CustomRow
                value={
                  milestone?.paymentInfo
                    ? milestone?.paymentInfo?.paymentMode
                    : "-"
                }
                field={"Payment Mode"}
                inputType="select"
                menuItems={["Net Banking", "UPI", "Paypal"]}
                onChange={onValueChange}
                apiKey="paymentMode"
              />

              {/* <CustomRow
                inputType="select"
                value={
                  milestone?.paymentInfo
                    ? milestone?.paymentInfo?.currency
                    : "-"
                }
                menuItems={["USD", "SAR", "INR"]}
                field={"Currency"}
                apiKey={"currency"}
                onChange={onValueChange}
              /> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MilestoneInfoSidebar;
