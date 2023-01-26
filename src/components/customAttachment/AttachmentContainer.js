import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AttachmentModal from "components/attachmentModal/AttachmentModal";
import DragAndDropFile from "components/DragAndDropFile";
import SLR_Wrapper from "components/SLR_wrapper/SLR_Wrapper";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { forwardRef, useEffect, useState, memo } from "react";
import { errorToast } from "utils/toast";
import Icon from "components/icons/IosIcon"
import "./CustomAttachment.scss";
import CommonDelete from "components/CommonDelete";
import Loading from "components/loading/Loading";
const AttachmentContainer = ({
  onSubmit,
  attachment,
  isLoading,
  attachmentUpdate,
  actionContainerStyle,
  actionIconStyle,
  imageStyle,
  dragAndDropDisabled,
  pasteDisabled,
  containerClassName,
  filesAllowed,
  addDisabled,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState(attachment ?? []);
  const [attachmentBtn, setAttachmentBtn] = useState("Done");
  const [currImageIndex, setCurrImageIndex] = useState(null);
  const [removeAttachment, setRemoveAttachment] = useState([]);
  useEffect(() => {
    setAttachments( attachment ? [...attachment] : []);
  }, [attachment]);
  useEffect(() => {
    !pasteDisabled && document.addEventListener("paste", onHandlePaste);
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

      if (items[idx].kind === "file") {
        //take that file to imgFile
        if (imgFile?.type?.includes("image")) {
          // newArray.push(imgFile);
          newArray = { ...newArray, [id]: imgFile };
          id += 1;
        }

        if(filesAllowed){
          newArray = { ...newArray, [id]: imgFile };
          id += 1;
        }
        // break;
      }
    }
    Object.keys(newArray).length > 0 && fileChangeHandle(newArray);
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
    // attachmentUpdate && attachmentUpdate([...temp]);

    if (typeof item !== "object") {
      remove.push(item);
    }
    attachmentUpdate && attachmentUpdate([...temp] , remove);
    setRemoveAttachment(remove);
    // onChange(remove, typeof item !== "object" ? "remove" : undefined);
  };
  const fileChangeHandle = (files) => {
    setAttachmentBtn("Done");
    // console.log("files" , files , attachments)
    // let temp = bug?.attachment;      //For Multiple Selection
    if (
      //   (files.length ?? Object.keys(files).length + attachments.length) >
      files?.length + attachments.length >
      5
    ) {
      errorToast("Maximum 5 images required");
    } else {
      let temp = []; // for single Selection
      for (let i = 0; i < Object.keys(files).length; i++) {
        if (files[i]?.type?.includes("image") || filesAllowed) {
          temp.push(files[i]);
        } else {
          return errorToast("Only image file format is supported");
        }
      }

      setCurrImageIndex(attachments.length);
      setAttachments([...attachments, ...temp]);
      attachmentUpdate && attachmentUpdate([...attachments, ...temp] , removeAttachment);
      // setAttachmentModal(true);
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
    <div className={`customAttachment ${containerClassName}`}>
      <SLR_Wrapper showDownloadButton={false}>
        <DragAndDropFile
          handleDrop={(e) => {
            !dragAndDropDisabled && fileChangeHandle(e.files);
          }}
        >
          {/* <div className="alignCenter">
          <p className="flex">Attachments</p>
          <LightTooltip title="Esc" arrow>
            <div onClick={handleClose} className="cursorPointer">
              <CloseRoundedIcon />
            </div>
          </LightTooltip>
        </div> */}

          <div className="flexWrap">
            {/* <label htmlFor="bug-attachment">
            <div className="customAttachment_add my-1 mr-1 boxShadow">
              <AddRoundedIcon />
              <p>Add new attachment</p>
            </div>
          </label> */}

            {attachments?.map((item, index) => (
              <div
                className="customAttachment_image boxShadow"
                key={index}
                style={{ ...imageStyle }}
              >
             {
               typeof item === "string" ? checkURL(item) ?   <img
               src={
                 typeof item === "string" ? item : URL.createObjectURL(item)
               }
               style={{ ...imageStyle }}
               alt="no_iamge"
             /> : <div className="flex alignCenter justifyContent_center flexColumn" 
             style={{ ...imageStyle }}
             
             > 
             <Icon name="file" style={{width:50 , height:50  , fill:"#FFF" , ...imageStyle}}/> 
             <p style={{fontSize:imageStyle ? 10 : 16}}>File_{index+1}</p>
             </div> 
             :
             checkURL(item?.name) ? 
             <img
             src={
               typeof item === "string" ? item : URL.createObjectURL(item)
             }
             style={{ ...imageStyle }}
             alt="no_iamge"
           /> : <div className="flex alignCenter justifyContent_center flexColumn"
           style={{ ...imageStyle }}
           > 
           <Icon name="file" style={{width:50 , height:50  , fill:"#FFF" , ...imageStyle}}/> 
           <p style={{fontSize:16}}>File_{index+1}</p>
           </div> 
             }  
                <div
                  className="image_removeIcon boxShadow"
                  style={{
                    height: disabled ? 40 : 70,
                    alignItems:"center",
                    justifyContent:"center",
                    ...actionContainerStyle,
                  }}
                >
                  {
                    isLoading ? <Loading
                    loadingType={"spinner"}
                    size={20}
                    backgroundColor="#FFF"
                    /> : <>
                    {!disabled && <>
                  {
                    typeof item === "string"  ? <div
                    onClick={(event) => {
                      event?.preventDefault();
                        event?.stopPropagation();
                    }}
                  ><CommonDelete
                  otherFunction={() => removeFile(index, item)  }
                  /> </div> :
                    <LightTooltip title="Remove" arrow>
                    <div
                      onClick={(event) => {
                        event?.preventDefault();
                          event?.stopPropagation();
                        removeFile(index, item);
                      }}
                    >
                      <CloseRoundedIcon style={{ ...actionIconStyle }} />
                    </div>
                  </LightTooltip>
                  }
                    
                  {((typeof item !== "string") && item?.type?.includes("image")) && (
                    <LightTooltip title="Edit" arrow>
                      <div
                        onClick={(event) => {
                          event?.preventDefault();
                          event?.stopPropagation();
                          setAttachmentBtn("Update");
                          setAttachmentModal(true);
                          setCurrImageIndex(index);
                        }}
                      >
                        <EditRoundedIcon style={{ ...actionIconStyle }} />
                      </div>
                    </LightTooltip>
                  )}</>}</>
                  }
                  {(disabled || typeof item === "string") && <LightTooltip title="Download" arrow
                  >
                      <div
                        onClick={(event) => {
                          event?.preventDefault();
                          event?.stopPropagation();
                          var element = document.createElement("a");
    element.href = item;
    element.download = "image.jpg";
    element.click();
                        }}
                      >
                        <Icon
                        name="download"
                        style={{ width : 20 , fill:"#FFF" , marginTop:5 }} />
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
                        attachmentUpdate && attachmentUpdate([...files]);

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
      {!addDisabled && <input
        type="file"
        accept={filesAllowed? "*" :"image/*"}
        multiple
        id="bug-attachment"
        style={{ display: "none" }}
        onChange={(e) => {
          fileChangeHandle(e.target.files);
        }}
        // ref={ref}
        onClick={(event) => (event.target.value = null)}
      />}

      <div className="alignCenter justifyContent_end">
        {/* <CustomButton
        className={""}
        onClick={onSubmit_complete}
        loading={isLoading}
      >
        <p>Done</p>
      </CustomButton> */}
      </div>
    </div>
  );
};

export default memo(AttachmentContainer);


function checkURL(url) {
  return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
}