import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./CustomAttachment.scss";
import { LightTooltip } from "components/tooltip/LightTooltip";
import CustomImageEditor from "components/imageEditor/CustomImageEditor";
import BugAttachmentModal from "pages/projects/bug/BugAttachmentModal";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AttachmentModal from "components/attachmentModal/AttachmentModal";
import DragAndDropFile from "components/DragAndDropFile";
import { errorToast } from "utils/toast";
import CustomButton from "components/CustomButton";
import SLR_Wrapper from "components/SLR_wrapper/SLR_Wrapper";
function CustomAttachment({ actionButton, attachment, onSubmit, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState(attachment ?? []);
  const [attachmentBtn, setAttachmentBtn] = useState("Done");
  const [currImageIndex, setCurrImageIndex] = useState(null);
  const [removeAttachment, setRemoveAttachment] = useState([]);

  useEffect(() => {
    setAttachments(attachment ?? []);
  }, [attachment]);
  useEffect(() => {
    isOpen && document.addEventListener("paste", onHandlePaste);
    return () => {
      document.removeEventListener("paste", onHandlePaste);
    };
  }, [attachments, isOpen]);

  const onHandlePaste = (ev) => {
    // const { title, description, assignee, priority } = myStateRef.current;
    var imgFile = null;
    var idx;
    let newArray = {};
    var items = ev.clipboardData.items;
    let id = 0;

    for (idx = 0; idx < items.length; idx++) {
      //check if any content is file
      imgFile = items[idx].getAsFile();
      console.log(items[idx].kind);
      console.log(imgFile?.type);
      console.log(imgFile?.type?.includes("image"));
      if (items[idx].kind === "file") {
        //take that file to imgFile
        if (imgFile?.type?.includes("image")) {
          // newArray.push(imgFile);
          newArray = { ...newArray, [id]: imgFile };
          id += 1;
        }
        // break;
      }
    }
    Object.keys(newArray).length > 0 && fileChangeHandle(newArray);
    console.log(newArray);
    // if (imgFile == null) {
    //   return;
    // } else {
    //   // setCurrImageIndex(bugData.attachment.length);
    //   // setBugData({
    //   //   ...bugData,
    //   //   attachment: [...bugData.attachment, ...newArray],
    //   // });
    //   // setAttachmentModal(true);
    // }

    // if (
    //   title.length > 0 &&
    //   description.length > 0 &&
    //   typeof assignee === "object" &&
    //   priority.length > 0
    // ) {
    //   setBugData({
    //     ...myStateRef.current,
    //     attachment: [...newArray],
    //   });
    // } else {
    //   return infoToast("Please fill required field first.");
    // }
  };

  const handleClose = () => {
    setIsOpen(false);
    setAttachments(attachment ?? []);
  };

  const removeFile = (index, item) => {
    let temp = [...attachments];
    let remove = [...removeAttachment];
    temp.splice(index, 1);
    setAttachments([...temp]);
    if (typeof item !== "object") {
      remove.push(item);
    }
    setRemoveAttachment(remove);
    // onChange(remove, typeof item !== "object" ? "remove" : undefined);
  };

  const fileChangeHandle = (files) => {
    setAttachmentBtn("Done");
    // let temp = bug?.attachment;      //For Multiple Selection
    console.log("files", files.length);
    if (
      //   (files.length ?? Object.keys(files).length + attachments.length) >
      files?.length + attachments.length >
      5
    ) {
      errorToast("Maximum 5 images required");
    } else {
      let temp = []; // for single Selection
      for (let i = 0; i < Object.keys(files).length; i++) {
        if (files[i]?.type?.includes("image")) {
          temp.push(files[i]);
        } else {
          return errorToast("Only image file format is supported");
        }
      }

      setCurrImageIndex(attachments.length);
      setAttachments([...attachments, ...temp]);
      setAttachmentModal(true);
    }
  };

  const onSubmit_complete = () => {
    if (onSubmit) {
      onSubmit({
        attachments,
        removeAttachment,
        callback: handleClose,
      });
    }
  };

  return (
    <div>
      <div onClick={() => setIsOpen(true)}>
        {actionButton ? actionButton : "N/A"}
      </div>
      <Dialog
        classes={{ paper: "kanbanpopup" }}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      >
        <div className="customAttachment">
          <SLR_Wrapper showDownloadButton={false}>
            <DragAndDropFile
              handleDrop={(e) => {
                fileChangeHandle(e.files);
              }}
            >
              <div className="alignCenter">
                <p className="flex">Attachments</p>
                <LightTooltip title="Esc" arrow>
                  <div onClick={handleClose} className="cursorPointer">
                    <CloseRoundedIcon />
                  </div>
                </LightTooltip>
              </div>

              <div className="flexWrap">
                <label htmlFor="bug-attachment">
                  <div className="customAttachment_add my-1 mr-1 boxShadow">
                    <AddRoundedIcon />
                    <p>Add new attachment</p>
                  </div>
                </label>

                {attachments?.map((item, index) => (
                  <div className="customAttachment_image boxShadow" key={index}>
                    <img
                      src={
                        typeof item === "string"
                          ? item
                          : URL.createObjectURL(item)
                      }
                      alt="no_iamge"
                    />
                    <div className="image_removeIcon boxShadow" style={{
                      height : typeof item === "string" ? 40 : 70
                    }}>
                      <LightTooltip title="Remove" arrow>
                        <div
                          onClick={() => {
                            removeFile(index, item);
                          }}
                        >
                          <CloseRoundedIcon />
                        </div>
                      </LightTooltip>
                    { typeof item !== "string" &&  <LightTooltip title="Edit" arrow>
                        <div
                          onClick={() => {
                            setAttachmentBtn("Update");
                            setAttachmentModal(true);
                            setCurrImageIndex(index);
                          }}
                        >
                          <EditRoundedIcon />
                        </div>
                      </LightTooltip>}
                    </div>
                  </div>
                ))}

                {attachmentModal && (
                  <AttachmentModal
                    OtherClose={() => {
                      setAttachmentModal(false);
                    }}
                    index={currImageIndex}
                    attachments={attachments}
                    btn={attachmentBtn}
                    onChange={(files) => {
                      setAttachments(files);
                      // fileChangeHandle(files);
                    }}
                  />
                )}
                {/* <CustomImageEditor
                  file={file}
                  onUpdateImage={onUpdateImage}
                  index={i}
                  buttonType={
                    attachments?.length - 1 === count ? "Upload" : "Next"
                  }
                /> */}
              </div>
            </DragAndDropFile>
          </SLR_Wrapper>
          <input
            type="file"
            accept="image/*"
            multiple
            id="bug-attachment"
            style={{ display: "none" }}
            // onChange={(e) => {
            //   e.target.files.length !== 0 &&
            //     setBugData((previousState) => ({
            //       ...previousState,
            //       attachment: [
            //         ...previousState.attachment,
            //         e?.target?.files[0],
            //       ],
            //     }));
            //   e.target.files.length !== 0 && setAttachmentModal(true);
            //   e.target.files.length !== 0 &&
            //     setCurrImageIndex(bugData.attachment.length);
            // }}
            onChange={(e) => {
              fileChangeHandle(e.target.files);
            }}
          />

          <div className="alignCenter justifyContent_end">
            <CustomButton
              className={""}
              onClick={onSubmit_complete}
              loading={isLoading}
            >
              <p>Done</p>
            </CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default CustomAttachment;
