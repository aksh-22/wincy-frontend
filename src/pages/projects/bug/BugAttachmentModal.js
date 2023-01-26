import CommonDialog from "components/CommonDialog";
import CustomButton from "components/CustomButton";
import CustomImageEditor from "components/imageEditor/CustomImageEditor";
import React, { useState } from "react";

function BugAttachmentModal({
  attachments,
  OtherClose,
  updateAttachmentImageEditor,
}) {
  return (
    <div>
      <CommonDialog
        shouldOpen={true}
        minWidth={"90%"}
        height={"90%"}
        content={
          <OpenBugAttachmentContent
            attachments={attachments}
            updateAttachmentImageEditor={updateAttachmentImageEditor}
          />
        }
        modalTitle="Edit Attachment"
        OtherClose={OtherClose}
      />
    </div>
  );
}

export default BugAttachmentModal;

function OpenBugAttachmentContent({
  handleClose,
  attachments,
  updateAttachmentImageEditor,
}) {
  const [count, setCount] = useState(0);
  const updateCount = (i) => {
    setCount(i);
  };

  const [newAttachment, setNewAttachment] = useState([]);
  const onUpdateImage = (newFile, i, buttonType, index) => {
    updateAttachmentImageEditor(newFile, index, buttonType);
    setCount(i);
  };

  const videoSrc = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (err) {
      return "";
    }
  };
  return (
    <div>
      {attachments?.map(
        (file, i) =>
          count === i && (
            <div key={i}>
              {file.type?.includes("image") ? (
                <CustomImageEditor
                  file={file}
                  onUpdateImage={onUpdateImage}
                  index={i}
                  buttonType={
                    attachments?.length - 1 === count ? "Upload" : "Next"
                  }
                />
              ) : (
                <video
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                  controls
                >
                  <source src={videoSrc(file)} type={file.type} />
                </video>
              )}
              {!file.type?.includes("image") && (
                <CustomButton
                  onClick={() =>
                    onUpdateImage(
                      { newFile: file, name: file?.name },
                      (attachments?.length - 1 === count
                        ? "Upload"
                        : "Next") === "Next"
                        ? i + 1
                        : i,
                      attachments?.length - 1 === count ? "Upload" : "Next",
                      i
                    )
                  }
                >
                  {attachments?.length - 1 === count ? "Upload" : "Next"}
                </CustomButton>
              )}
            </div>
          )
      )}
    </div>
  );
}
