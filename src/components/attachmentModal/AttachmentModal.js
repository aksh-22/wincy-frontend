import CommonDialog from "components/CommonDialog";
import CustomImageEditor from "components/imageEditor/CustomImageEditor";
import React from "react";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import classes from "./AttachmentModal.module.css";
import { IconButton } from "@material-ui/core";

const AttachmentModal = ({
  OtherClose,
  shouldOpen,
  attachments,
  btn,
  onChange,
  index,
}) => {
  const [currIndex, setCurrIndex] = useState(index ?? 0);

  const [bugAttachments, setBugAttachments] = useState(attachments);

  console.log(bugAttachments[currIndex]);

  return (
    <CommonDialog
      shouldOpen={true}
      modalTitle="Edit Attachment"
      OtherClose={OtherClose}
      content={
        <>
          <IconButton
            className={`${classes.icon} ${currIndex === 0 && classes.disable}`}
            onClick={() => {
              setCurrIndex((prev) => prev - 1);
            }}
            style={{
              left: 0,
            }}
            disabled={currIndex === 0}
          >
            <ChevronLeftIcon style={{ fontSize: 30 }} />
          </IconButton>
          <CustomImageEditor
            file={attachments[currIndex]}
            buttonType={btn}
            onUpdateImage={(e, b, c, index, f) => {
              const temp = attachments;
              temp[currIndex] = new File([e.newFile], "new.jpg");
              setBugAttachments(temp);
              onChange(bugAttachments);
              currIndex === attachments.length - 1 || btn === "Update"
                ? OtherClose()
                : setCurrIndex((prev) => prev + 1);
              // setBugAttachments((previousState) => ({
              //   ...previousState,
              //   attachment: [...temp],
              // }));
            }}
          />
          <IconButton
            className={`${classes.icon} ${
              currIndex === attachments.length - 1 && classes.disable
            }`}
            style={{
              right: 0,
            }}
            disabled={currIndex === attachments.length - 1}
            onClick={() => {
              setCurrIndex((prev) => prev + 1);
            }}
          >
            <ChevronRightIcon style={{ fontSize: 30 }} />
          </IconButton>
        </>
      }
      minWidth={"90%"}
      height={"90%"}
    />
  );
};

export default React.memo(AttachmentModal);
