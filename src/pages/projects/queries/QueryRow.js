import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import CustomChip from "components/CustomChip";
import CustomPopper from "components/CustomPopper";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import Image from "components/defaultImage/Image";
import moment from "moment";
import { LeadStatusOptions } from "pages/my leads/leadInfoSideBar/LeadInfoSideBar";
import React, { useCallback, useState } from "react";
import { useUpdateQuery } from "react-query/queries/useUpdateQuery";
import { leadChipStatusColor } from "utils/leadChipStatusColor";
import { capitalizeFirstLetter } from "utils/textTruncate";
import "./Queries.scss";
import QueriesThread from "./QueriesThread";
const queryStatus  =["Open" , "Close"]

function QueryRow({
  drawerDisabled,
  style,
  disabled,
  item,
  orgId,
  projectId,
  index,
  removeReply,
  forward_status
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useUpdateQuery();
const [status] = useState(forward_status??item?.status)
  const sideBarClose = () => {
    setIsOpen(false);
  };

  const onTitleUpdate = useCallback((value) => {
    setData(value, "title");
  }, []);
  const onDescriptionUpdate = useCallback((value) => {
    setData(value, "description");
  }, []);

  const onDeleteAttachments = useCallback((value, removeAttachment) => {
    let fd = new FormData();
    fd.append("deleteAttachments", JSON.stringify(removeAttachment));
    mutate({
      data: fd,
      orgId,
      projectId,
      queryId: item?._id,
      queryData: {
        attachments: value,
      },
      status : status

    });
  }, []);
const onHandleUpdate = useCallback(
  (status , value) => {
    setData(value , status);
  },
  [],
)

  const setData = useCallback((value, key) => {
    let fd = new FormData();
    fd.append(key, value);
    mutate({
      data: fd,
      orgId,
      projectId,
      queryId: item?._id,
      queryData: {
        [key]: value,
      },
      status : status
    });
  }, []);

  return (
    <>
      <div
        className="query_row"
        style={{
          cursor: drawerDisabled ? "inherit" : "pointer",
        }}
        onClick={() => !drawerDisabled && setIsOpen(true)}
      >
        <Image
          style={{
            marginRight: 10,
            minWidth: 25,
            marginTop: 2,
          }}
          name={item?.createdBy?.name}
          src={item?.createdBy?.profilePicture}
        />
        <div className="flex">
          <div className="mb-05">
            <div className="alignCenter">
              <p className="query_row_createdBy_name flex">
                {item?.createdBy?.name}
              </p>
              {item?.count > 0 && !removeReply && (
                <p style={{ color: "var(--chipYellow" }}>
                  {item?.count} {item?.count <=1  ? "Reply" : "Replies"}
                </p>
              )}
            </div>
            <p className="query_row_creation_date">
              {moment(item?.createdAt).format("MMM Do YYYY")} at{" "}
              {moment(item?.createdAt).format("LT")}
            </p>
          </div>
          <div>
            <InputTextClickAway
              value={capitalizeFirstLetter(item?.title)}
              className="query_row_question"
              textClassName={"p-0"}
              disabled={disabled}
              onChange={onTitleUpdate}
            />

            {(item?.description || !disabled) &&  <InputTextClickAway
              value={item?.description}
              placeholder="Add a more detailed description…"
              placeholderText={"Add a more detailed description…"}
              className="query_row_description"
              textClassName={"p-0"}
              textArea
              inputClassName={"ss"}
              rows={5}
              style={{ height: 100 , fontSize:14 }}
              disabled={disabled}
              textStyle={{
                whiteSpace:"pre-wrap"
              }}
              onChange={onDescriptionUpdate}
            />}
            <AttachmentContainer
              dragAndDropDisabled
              pasteDisabled
              attachment={item?.attachments}
              containerClassName="my-1 ml"
              addDisabled
              attachmentUpdate={onDeleteAttachments}
              disabled={disabled}
            />
          </div>
        </div>
        <CustomPopper 
value={<CustomChip
  label={item?.status ?? "N/A"}
  bgColor={leadChipStatusColor[item?.status]}
  style={{ padding: 8, fontSize: 12 ,   cursor:"pointer" }}
  className={"mx-1 cursorPointer"}
 
/> }
disabled={disabled}
buttonClassName="cursorPointer"
valueStyle={{
  cursor:"pointer"
}}
content={<LeadStatusOptions onHandleUpdate={onHandleUpdate} options={queryStatus}/>}
/>
      </div>
      <CustomSideBar show={isOpen} toggle={sideBarClose}>
        <QueriesThread
          item={item}
          orgId={orgId}
          projectId={projectId}
          index={index}
          disabled={disabled}
          status={status}
        />
      </CustomSideBar>
    </>
  );
}

export default QueryRow;
