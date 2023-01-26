import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CommonDelete from "components/CommonDelete";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import Image from "components/defaultImage/Image";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useDeleteQueryReply } from "react-query/queries/reply/useDeleteQueryReply";
import { useUpdateQueryReply } from "react-query/queries/reply/useUpdateQueryReply";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/textTruncate";
import "./Queries.scss";

function QueryRowReply({ item, projectId, orgId, queryId, removeHr , index }) {
  const userType = useSelector((state) => state.userReducer?.userType);
  const [disabled] = useState(
    ["Admin", "Member++"].includes(userType?.userType)
      ? false
      : userType?.userId !== item?.createdBy?._id
  );
  const { mutate } = useUpdateQueryReply();
  const { mutate: deleteReplyMutate, isLoading } = useDeleteQueryReply();
  const onSetDescrition = useCallback((value) => {
    let fd = new FormData();
    fd.append("description", value);
    mutate({
      data: fd,
      orgId,
      projectId,
      queryId,
      replyId: item?._id,
      queryData: {
        description: value,
      },
    });
  }, []);

  const onAttachmentUpdate = useCallback((value, removeAttachment) => {
    let fd = new FormData();
    fd.append("deleteAttachments", JSON.stringify(removeAttachment));
    mutate({
      data: fd,
      orgId,
      projectId,
      queryId,
      replyId: item?._id,
      queryData: {
        attachments: value,
      },
    });
  }, []);

  return (
    <>
      <div className="queryRow_reply_container">
        <div className="alignCenter">
          <Image
            style={{
              marginRight: 10,
              minWidth: 25,
              marginTop: 2,
            }}
            name={item?.createdBy?.name}
            src={item?.createdBy?.profilePicture}
          />

          <div className="alignCenter flex">
            <p className="query_row_reply_createdBy_name flex">
              {item?.createdBy?.name ?? "N/A"}
            </p>
            <p className="query_row_reply_creation_date">
              {moment(item?.createdAt).format("MMM Do YYYY")} at{" "}
              {moment(item?.createdAt).format("LT")}
            </p>
          </div>
        </div>

        <div className="d_flex">
          <div
            style={{
              marginRight: 10,
              minWidth: 25,
              marginTop: 2,
            }}
          />
          <InputTextClickAway
            value={capitalizeFirstLetter(item?.description)}
            className="query_row_reply_description"
            textClassName={"p-0"}
            textArea
            inputClassName={"ss"}
            rows={5}
            containerStyle={{
              //   marginRight: 40,
              marginTop: 2,
              color: "#FFF",
            }}
            textStyle={{
              whiteSpace:"pre-wrap"
            }}
            style={{ height: 100 , fontSize:14 }}
            disabled={disabled}
            onChange={onSetDescrition}
          />
          {!disabled && (
            <div>
              <CommonDelete
                className={"cursorPointer"}
                data={{
                  orgId,
                  projectId,
                  queryId,
                  data: {
                    replies: [item?._id],
                  },
                  index
                }}
                isLoading={isLoading}
                mutate={deleteReplyMutate}
              />
            </div>
          )}{" "}
        </div>

        <div className="alignCenter">
          <div
            style={{
              marginRight: 10,
              minWidth: 25,
              marginTop: 2,
            }}
          />
          <AttachmentContainer
            dragAndDropDisabled
            pasteDisabled
            attachment={item?.attachments}
            containerClassName="my-1 ml"
            addDisabled
            disabled={disabled}
            attachmentUpdate={onAttachmentUpdate}
          />
        </div>
        {!removeHr && <hr className="queryRow_reply_hr" />}
      </div>
    </>
  );
}

export default QueryRowReply;
