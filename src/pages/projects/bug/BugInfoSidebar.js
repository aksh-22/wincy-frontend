import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import React, { useState } from "react";
import { useBugInfo } from "react-query/bugs/useBugInfo";
import { useSelector } from "react-redux";
import BugComment from "./sidebar/BugComment";
import BugInfo from "./sidebar/BugInfo";

import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CloseButton from "components/CloseButton";
import CustomButton from "components/CustomButton";
import CustomRow from "components/CustomRow";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useUpdateTaskBug } from "react-query/bugs/taskBugs/useUpdateTaskBug";
import { useUpdateTaskBugAttachment } from "react-query/bugs/taskBugs/useUpdateTaskBugAttachment";
import { useUpdateBug } from "react-query/bugs/useUpdateBug";
import { useUpdateBugAttachment } from "react-query/bugs/useUpdateBugAttachment";
import { useMyworkUpdateBug } from "react-query/mywork/useMyworkUpdateBug";
import BugActivity from "./sidebar/BugActivity";
import BugFlowChart from "./sidebar/bugFlowChart/BugFlowChart";

function BugInfoSidebar({
  toggle,
  bug,
  projectInfo,
  platform,
  pageNo,
  activeBug,
  fromModule,
  disabled,
  team,
  developerEditEnable,
  sectionData,
  secondDisable,
  taskId,
}) {
  const orgId = useSelector(
    (state) => state?.userReducer?.selectedOrganisation?._id
  );
  const editorRef = React.useRef("");
  const { mutateUpdateBug, isLoadingUpdateBug } = useUpdateBug(
    orgId,
    projectInfo?._id,
    bug?.platform,
    pageNo ?? 1
  );
  const { mutateUpdateBugAttachment, isLoadingUpdateBugAttachment } =
    useUpdateBugAttachment(
      orgId,
      projectInfo?._id,
      bug?.platform,
      pageNo ?? 1,
      bug?._id,
      fromModule
    );

  const { mutateMyworkUpdateBug } = useMyworkUpdateBug(
    orgId,
    projectInfo?._id,
    pageNo,
    null,
    platform
  );

  const { mutate: mutateUpdateTaskBug } = useUpdateTaskBug({
    orgId,
    projectId: projectInfo?._id,
    taskId,
  });

  const { bugInfo, bugInfoLoading } = useBugInfo(
    orgId,
    projectInfo?._id,
    bug?._id
  );

  const onBugUpdate = (value, field, key) => {
    if (fromModule === "mywork") {
      let data = {
        [key]: value,
      };

      let sendData = {
        orgId: orgId,
        bugId: bug?._id,
        data: data,
      };

      mutateMyworkUpdateBug(sendData);
    }
    if (fromModule === "taskBug") {
      console.log("key", key, value);

      if (key === "taskId") {
        mutateUpdateTaskBug({
          data: {
            [key]: value?._id,
          },
          orgId: orgId,
          bugId: bug?._id,
          toggle,
          additionalInfo: value,
        });
        return null;
      }
      let data = {
        [key]: value,
      };

      let sendData = {
        orgId: orgId,
        bugId: bug?._id,
        data: data,
      };

      mutateUpdateTaskBug(sendData);
    } else {
      if (key === "taskId") {
        mutateUpdateBug({
          data: {
            [key]: value?._id,
          },
          orgId: orgId,
          bugId: bug?._id,
          toggle,
          additionalInfo: value,
        });
      } else if (key === "platform") {
        mutateUpdateBug({
          data: {
            [key]: value,
            section: "",
          },
          orgId: orgId,
          bugId: bug?._id,
          toggle,
        });
      } else {
        mutateUpdateBug({
          data: {
            [key]: value,
          },
          orgId: orgId,
          bugId: bug?._id,
          toggle,
        });
      }
    }
  };
  const handleAssigneeUpdate = ({ teamIds, teamData, otherId }) => {
    if (fromModule === "mywork") {
      mutateMyworkUpdateBug({
        orgId: orgId,
        bugId: otherId,
        data: {
          assignees: teamIds ?? "",
        },
        additionalInfo: {
          assignees: teamData,
        },
      });
    } else if (fromModule === "taskBug") {
      mutateUpdateTaskBug({
        orgId: orgId,
        bugId: otherId,
        data: {
          assignees: teamIds ?? "",
        },
        additionalInfo: {
          assignees: teamData,
        },
      });
    } else {
      mutateUpdateBug({
        orgId: orgId,
        bugId: otherId,
        data: {
          assignees: teamIds ?? [],
        },
        additionalInfo: {
          assignees: teamData,
        },
        toggle,
      });
    }
  };
  const {
    mutate: mutateUpdateTaskBugAttachment,
    isLoading: isLoadingUpdateTaskBugAttachment,
  } = useUpdateTaskBugAttachment({
    orgId,
    projectId: projectInfo?._id,
    taskId,
    bugId: bug?._id,
  });

  const onBugAttachmentUpdate = (value) => {
    let add = new FormData();
    if (value?.attachment?.length) {
      value?.attachment.map((file, i) => {
        add.append("attachments", file, file.name);
        return null;
      });
    }
    let obj = {};
    if (value?.removeAttachment?.length) {
      obj = {
        attachments: value?.removeAttachment,
      };
    }

    let addAttachment = {
      data: add,
      orgId: orgId,
      bugId: bug?._id,
      remove: false,
      fromModule,
      emptyLocalAttachment: value?.emptyLocalAttachment,
      handleClose: value?.handleClose,
    };

    let removeAttachment = {
      data: obj,
      orgId: orgId,
      bugId: bug?._id,
      remove: true,
      fromModule,
      emptyLocalAttachment: value?.emptyLocalAttachment,
      handleClose: value?.handleClose,
    };
    if (fromModule === "taskBug") {
      value?.attachment?.length && mutateUpdateTaskBugAttachment(addAttachment);

      value?.removeAttachment?.length &&
        mutateUpdateTaskBugAttachment(removeAttachment);
    } else {
      value?.attachment?.length && mutateUpdateBugAttachment(addAttachment);

      value?.removeAttachment?.length &&
        mutateUpdateBugAttachment(removeAttachment);
    }
  };

  const [bugButtonType, setBugButtonType] = useState("info");
  return (
    <>
      <div className="d_flex alignCenter">
        <div className=" ">
          <LightTooltip
            title={`Bug's Id ${projectInfo?.title
              ?.substring(0, 3)
              ?.toLowerCase()}#${bug?.sNo}`}
          >
            <p
              className="ff_Lato_Italic"
              style={{
                color: "var(--primary)",
                cursor: "default",
                textTransform: "uppercase",
              }}
            >
              {projectInfo?.title?.substring(0, 3)?.toLowerCase()}#{bug?.sNo}
            </p>
          </LightTooltip>
        </div>
        <div className="flex" />
        <div className="justifyContent_end mr-1">
          <CloseButton onClick={toggle} />
        </div>
      </div>

      <div className="d_flex flexColumn mt-1">
        <CustomRow
          value={bug?.title}
          apiKey="title"
          inputType="text"
          onChange={onBugUpdate}
          disabled={disabled}
          inputTextClassName="titleInput "
          valueClassName="titleValue "
          nonTruncate
          fieldClassName={"pl-0"}
        />
        <div className="ml-1 mt-1">
          <AssigneeSelection
            assignee={bug?.assignees}
            team={team}
            onChange={handleAssigneeUpdate}
            disabled={secondDisable}
            otherId={bug?._id}
            ImageStyle={{
              height: 55,
              width: 55,
            }}
            multiple
            needOneMember={true}
          />
        </div>

        <div
          className="my-1"
          style={{
            borderBottom: "3px solid var(--divider)",
            height: 10,
            width: "100%",
          }}
        />

        <div className="mb-1">
          <CustomTextEditor
            value={bug?.description}
            ref={editorRef}
            updateData={(value) => {
              onBugUpdate(value, "description", "description");
            }}
            disable={disabled}
          />
        </div>
      </div>

      <BtnWrapper>
        <CustomButton
          onClick={() => setBugButtonType("summary")}
          type={bugButtonType === "summary" ? "contained" : "text"}
          color="#f29726"
          style={{ marginRight: 10 }}
        >
          <InfoOutlinedIcon style={{ fontSize: 20 }} />
          <p style={{ marginLeft: 5 }}>Bug Status</p>
        </CustomButton>

        <CustomButton
          onClick={() => setBugButtonType("info")}
          type={bugButtonType === "info" ? "contained" : "text"}
          color="#f29726"
          style={{ marginRight: 10 }}
        >
          <InfoOutlinedIcon style={{ fontSize: 20 }} />
          <p style={{ marginLeft: 5 }}>Bug Info</p>
        </CustomButton>
        <CustomButton
          onClick={() => setBugButtonType("comment")}
          type={bugButtonType === "comment" ? "contained" : "text"}
          color="#f29726"
          style={{ marginRight: 10 }}
        >
          <QuestionAnswerOutlinedIcon style={{ fontSize: 20 }} />
          <p style={{ marginLeft: 5 }}>Comment</p>
        </CustomButton>
        <CustomButton
          onClick={() => setBugButtonType("activity")}
          type={bugButtonType === "activity" ? "contained" : "text"}
          color="#f29726"
        >
          <TimelineRoundedIcon style={{ fontSize: 20 }} />
          <p style={{ marginLeft: 5 }}>Activity</p>
        </CustomButton>
      </BtnWrapper>

      {bugButtonType === "summary" && (
        <BugFlowChart
          status={bug?.status}
          failedReviewCount={bugInfo?.bug?.failedReviewCount}
          reOpenCount={bugInfo?.bug?.reOpenCount}
        />
      )}
      {bugButtonType === "info" && (
        <BugInfo
          bug={bug}
          projectInfo={projectInfo}
          pageNo={pageNo}
          activeBug={activeBug}
          onChange={onBugUpdate}
          onAttachmentChange={onBugAttachmentUpdate}
          updateLoading={isLoadingUpdateBug}
          updateAttachmentLoading={
            isLoadingUpdateBugAttachment || isLoadingUpdateTaskBugAttachment
          }
          disabled={disabled}
          developerEditEnable={developerEditEnable}
          sectionData={sectionData}
          secondDisable={secondDisable}
          orgId={orgId}
          projectId={projectInfo?._id}
        />
      )}
      {bugButtonType === "comment" && (
        <BugComment
          comments={bugInfo?.bug?.comments}
          loading={bugInfoLoading}
          platform={bug?.platform}
          orgId={orgId}
          projectId={projectInfo?._id}
          bug={bug}
          team={team}
          taskMutate={mutateUpdateTaskBug}
          taskId={taskId}
          fromModule={fromModule}
        />
      )}
      {bugButtonType === "activity" && (
        <BugActivity bugId={bug?._id} orgId={orgId} />
      )}
    </>
  );
}

export default BugInfoSidebar;
