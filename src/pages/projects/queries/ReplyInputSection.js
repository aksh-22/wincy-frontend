import React, { useState, useEffect } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import "./Queries.scss";
import { LightTooltip } from "components/tooltip/LightTooltip";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import { useAddReply } from "react-query/queries/reply/useAddReply";
import Loading from "components/loading/Loading";

function ReplyInputSection({orgId , projectId , queryId  ,
forward_status
, messagesEndRef}) {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(40);
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState([]);
  const {mutate , isLoading} = useAddReply()
  const handleKeyUp = (evt) => {
    let newHeight =
      evt?.key === "Enter" ? textareaHeight + 5 : evt.target.scrollHeight;
    if (newHeight !== textareaHeight && newHeight < 150) {
      setTextareaHeight(newHeight);
    }
  };

  useEffect(() => {
    if (inputValue?.length === 0) {
      setTextareaHeight(40);
    }
  }, [inputValue]);

  const onSubmit = () => {
    if(isLoading) return null
   if(!inputValue?.trim()?.length) {
     return null
   }
   let fd = new FormData();
   fd.append("description" , inputValue)
   attachments?.map((file) => {
   fd.append("attachments" , file , file?.name);
     return null
   }) 

   mutate({
     data : fd,
     orgId,
     projectId,
     queryId,
     queryStatus : forward_status,
     callback : callbackFunction
   })
   
  }

  const callbackFunction = () => {
    setAttachments([])
    setInputValue("")
    setTextareaHeight(40);
    setInputIsFocused(true)
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })

  }

  return (
    <div
      className="queriesThread_reply_input"
      style={{
        height: inputIsFocused
          ? (attachments?.length
              ? attachments?.length <= 3
                ? 73
                : attachments?.length * 17
              : 0) +
            20 +
            textareaHeight
          : 40,
      }}
    >
      <div className={`alignCenter ${inputIsFocused ? "mt-1" : ""}`}>
        <textarea
          className="flex"
          placeholder="Type your message...."
          onFocus={() => setInputIsFocused(true)}
          onBlur={() => {
            if (inputValue?.trim()?.length === 0) {
              setInputIsFocused(false);
              setInputValue("");
            }
          }}
          onKeyPress={handleKeyUp}
          style={{
            paddingTop: 13,
            height: textareaHeight,
            fontSize:16
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e?.target?.value)}
          autoFocus
        />

        {inputIsFocused && (
          <>
            {" "}
            <LightTooltip title="Send" arrow>
              <div className="input_sendIcon"
              onClick={onSubmit}
              >
                {
                  isLoading? <Loading loadingType="spinner" backgroundColor={"#FFF"}/> : <SendRoundedIcon style={{marginLeft:5}} />
                }
                
              </div>
            </LightTooltip>
            <LightTooltip title="Attachment" arrow>
              <div
                className="input_sendIcon"
                //   onClick={(event) => {
                //       event?.preventDefault();
                //       event?.stopPropagation();
                //       inputRef?.current?.click()
                //   }}
              >
                <label
                  htmlFor="bug-attachment"
                  className="inputIsFocused cursorPointer alignCenter"
                >
                  <AttachFileRoundedIcon />
                </label>
              </div>
            </LightTooltip>
          </>
        )}
      </div>

      <AttachmentContainer
        attachment={attachments}
        attachmentUpdate={setAttachments}
        imageStyle={imageStyle}
        actionContainerStyle={actionContainerStyle}
        actionIconStyle={actionIconStyle}
        containerClassName="p-1"
        filesAllowed
        // ref={inputRef}
      />
    </div>
  );
}

const imageStyle = {
  height: 40,
  width: 60,
};
const actionContainerStyle = {
  height: 44,
  padding: "0px 2px",
};
const actionIconStyle = {
  fontSize: 14,
};

export default ReplyInputSection;
