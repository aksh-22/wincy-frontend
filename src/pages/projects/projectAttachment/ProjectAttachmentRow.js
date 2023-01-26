import React, { useState } from "react";
import ArrowRightOutlinedIcon from "@material-ui/icons/ArrowRightOutlined";
import moment from "moment";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { LightTooltip } from "components/tooltip/LightTooltip";
import CommonDelete from "components/CommonDelete";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
// import AttachFileIcon from "@material-ui/icons/AttachFile";
// import CommonDialog from "components/CommonDialog";
// import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CustomButton from "components/CustomButton";
import Checkbox from "@material-ui/core/Checkbox";
import { start_and_end } from "utils/textTruncate";
import classes from "./ProjectAttachment.module.css";
import "css/Milestone.css";
import SLR_Wrapper from "components/SLR_wrapper/SLR_Wrapper";
import { useLightbox } from "simple-react-lightbox";
import CustomRow from "components/CustomRow";
import { ClickAwayListener } from "@mui/material";
import ErrorIcon from "@material-ui/icons/Error";
import LinkIcon from "@mui/icons-material/Link";
import { useUpdateProjectAttachment } from "react-query/projects/useUpdateProjectAttachment";
import CommonDialog from "components/CommonDialog";
// import { start_and_end } from 'utils/textTruncate';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TextInput from "components/textInput/TextInput";
import { errorToast } from "utils/toast";
import { useHistory } from "react-router-dom";

const deleteData = (item, orgId, projectId, folder) => {
  let obj = {
    data: {
      // attachments: [item?._id],
    },
    orgId,
    projectId,
    isFolderDelete: folder,
  };

  if (folder) {
    obj.data.folder = item?.attachments?.[0]?._id;
    obj.folderName = item?._id?.folder;
  }

  if (item?.storageLink) {
    obj.data.storageLinks = [item?._id];
  }
  return obj;
};

function ProjectAttachmentRow({
  data,
  orgId,
  projectId,
  addAttachmentMutate,
  deleteAttachmentMutate,
  isLoadingDelete,
  isLoading,
  isSelected,
  onSelect,
  disabled,
  allData,
}) {
  const { push } = useHistory();
  const [attachments, setAttachments] = useState([]);
  const { openLightbox, closeLightbox } = useLightbox();
  const { mutateUpdateAttachment, isLoadingUpdate } =
    useUpdateProjectAttachment();
  // const fileChangeHandle = (e) => {
  //   let temp = [...attachments];
  //   for (let i = 0; i < Object.keys(e.target.files).length; i++) {
  //     temp.push(e.target.files[i]);
  //   }

  //   if (temp.length) {
  //     setAttachments([...temp]);
  //   }
  // };
  // const removeFile = (index) => {
  //   let temp = [...attachments];
  //   temp.splice(index, 1);
  //   setAttachments([...temp]);
  // };

  const onAddAttachment = (handleClose) => {
    let fd = new FormData();

    data?._id?.folder && fd.append("folder", data?._id?.folder);
    attachments.map((file, i) => {
      fd.append("attachments", file, file.name);
      return null;
    });
    let obj = {
      data: fd,
      orgId,
      projectId,
      folder: data?._id?.folder,
      handleClose,
      clearLocalAttachment: () => setAttachments([]),
    };

    addAttachmentMutate(obj);
  };

  const addStorageLink = (value, handleClose) => {
    let fd = new FormData();
    fd.append("folder", data?._id?.folder);
    fd.append("storageLink", value?.url);
    fd.append("name", value?.title);
    let obj = {
      data: fd,
      orgId,
      projectId,
      folder: data?._id?.folder,
      handleClose,
      clearLocalAttachment: () => setAttachments([]),
    };
    console.log(JSON.stringify(obj));
    addAttachmentMutate(obj);
  };

  const updateProjectAttachment = (attachmentId) => {
    console.log({ data }, { attachmentId });
    if (newName === data?._id?.folder) {
      setIsFolderNameEdit(false);
      return null;
    }
    if (
      allData?.attachments?.filter(
        (item) => item?._id?.folder === newName.trim()
      ).length !== 0
    ) {
      return errorToast("Folder name is already exist");
      // setError("Folder already exist");
    }
    let obj = {
      data: {
        name: newName,
      },
      projectId,
      orgId,
      attachmentId,
      isFolderEdit: true,
      isFileEdit: false,
      folderName: data?._id?.folder,
    };
    attachmentId && mutateUpdateAttachment(obj);
    setIsFolderNameEdit(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isFolderNameEdit, setIsFolderNameEdit] = useState(false);
  const [newName, setNewName] = useState("");
  return (
    <SLR_Wrapper showDownloadButton={false}>
      <div className="mt-2" onClick={() => setIsOpen(!isOpen)}>
        <div className={`${classes.tableRow} `}>
          <div />
          {!isFolderNameEdit ? (
            <p
              onClick={(e) => {
                !disabled && e.preventDefault();
                !disabled && e.stopPropagation();
                setNewName(data?._id?.folder);
                !disabled && setIsFolderNameEdit(true);
              }}
              className="flex alignCenter d_flex"
              style={{
                textOverflow: "ellipsis",
                width: "80%",
                overflow: "hidden",
                paddingLeft: 15,
                cursor: disabled ? "pointer" : "text",
                // wordBreak: "break-word",
              }}
            >
              <FolderOpenRoundedIcon /> &nbsp;
              {data?._id?.folder ?? "Root Folder"}
            </p>
          ) : (
            <ClickAwayListener
              onClickAway={() =>
                updateProjectAttachment(data?.attachments?.[0]?._id, data)
              }
            >
              <div
                className="d_flex alignCenter"
                style={{
                  paddingLeft: 15,
                }}
              >
                <FolderOpenRoundedIcon />
                <input
                  type="text"
                  value={newName}
                  style={{
                    height: 35,
                    marginRight: 10,
                    marginLeft: 10,
                    paddingLeft: 10,
                  }}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  onKeyPress={(e) => {
                    e.key === "Enter" &&
                      updateProjectAttachment(
                        data?.attachments?.[0]?._id,
                        data
                      );
                  }}
                />
              </div>
            </ClickAwayListener>
          )}

          <p className="flex">Uploaded By</p>
          <p className="flex">Last Updated</p>
          {/* <div className={`${classes.btnWrapper} d_flex justifyContent_end`}>
          <CommonDelete />
        </div> */}
          {!disabled && (
            <CommonDelete
              data={deleteData(data, orgId, projectId, true)}
              className="justifyContent_end"
              disableToolTip
              isLoading={isLoadingDelete}
              mutate={deleteAttachmentMutate}
            />
          )}
          <div className={`${isOpen ? classes.rotate : ""} ${classes.icon} `}>
            <ArrowRightOutlinedIcon />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
      
        >
          {/* {
              !disabled && <CommonDialog
              actionComponent={<ProjectAttachmentAdd />}
              content={
                <ProjectAttachmentPreview
                  isLoading={isLoading}
                  onAddAttachment={onAddAttachment}
                  fileChangeHandle={(value) => setAttachments([...value])}
                  // removeFile={removeFile}
                  data={attachments}
                />
              }
              modalTitle={data?._id?.folder ?? "Root Folder"}
              width={450}
              height={300}
            />
            } */}

          {!disabled && (
            <AddLink onClick={addStorageLink} isLoading={isLoading} />
          )}

          {data?.attachments?.map(
            (item, index) =>
              item?.type !== "Folder" && (
                <div className={classes.tableRowEl} key={item?._id}
                onClick={() => {
                  if (disabled) {
                    let url = item?.storageLink;
                    let http = "https://";
                    var re = new RegExp("^(http|https)://", "i");
                    if (re.test(url)) {
                      console.log("true");
                    } else {
                      url = http.concat(url);
                    }
                    window.open(url, "_blank").focus();
                  }
                }}
                >
                  {console.log({ item })}
                  <div
                    className={`${classes.sideBar} ${
                      isSelected.length !== 0 ? "rowSelected" : ""
                    } `}
                    style={{
                      width: !isSelected.length > 0 ? 5 : 30,
                    }}
                  >
                    {!disabled && (
                      <Checkbox
                        size="small"
                        checked={isSelected.includes(item?._id)}
                        onClick={() => onSelect(item?._id)}
                        style={{
                          color: !isSelected.length
                            ? "var(--primary)"
                            : "var(--defaultWhite)",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      position: "relative",
                      paddingLeft: 10,
                    }}
                  >
                    <p
                      onClick={() => {
                        console.log("clicked");
                        openLightbox(2);
                      }}
                      // style={{ width: "70%" }}
                    >
                      {start_and_end(item?.name ?? "N/A")}
                    </p>

                    <img
                      src={item?.attachment}
                      className={classes.imagesPreview}
                      alt="noImage"
                    />
                  </div>

                  <p>
                    {Array.isArray(item?.createdBy)
                      ? item?.createdBy[0]?.name
                      : item?.createdBy?.name}
                  </p>
                  <p>{moment(item?.createdAt).format("DD-MM-YYYY")}</p>
                  <div className={`${classes.icons} justifyContent_end`}>
                    {item?.storageLink ? (
                      <div
                        onClick={() => {
                          let url = item?.storageLink;
                          let http = "https://";
                          var re = new RegExp("^(http|https)://", "i");
                          if (re.test(url)) {
                            console.log("true");
                          } else {
                            url = http.concat(url);
                          }
                          window.open(url, "_blank").focus();
                        }}
                        className="cursorPointer"
                      >
                        <LightTooltip title="Click to Open Link" arrow>
                          <LinkIcon style={{ color: "var(--primary)" }} />
                        </LightTooltip>
                      </div>
                    ) : (
                      <a href={item?.attachment} download className="d_flex">
                        <LightTooltip title="Download" arrow>
                          <GetAppRoundedIcon
                            style={{ color: "var(--primary)" }}
                          />
                        </LightTooltip>
                      </a>
                    )}
                    {!disabled && (
                      <CommonDelete
                        data={deleteData(item, orgId, projectId)}
                        isLoading={isLoadingDelete}
                        mutate={deleteAttachmentMutate}
                      />
                    )}

                    {!disabled && (
                      <CommonDialog
                        actionComponent={<EditAttachmentModal />}
                        modalTitle="Edit"
                        content={
                          <EditAttachmentModalContainer
                            data={item}
                            mutate={mutateUpdateAttachment}
                            orgId={orgId}
                            projectId={projectId}
                            isLoading={isLoadingUpdate}
                            folderName={data?._id?.folder}
                          />
                        }
                        minWidth={300}
                      />
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </SLR_Wrapper>
  );
}

export default ProjectAttachmentRow;

function ProjectAttachmentAdd({ onClick }) {
  return (
    <div className={classes.addRow} onClick={onClick}>
      <div className={classes.sideBar}></div>
      <p style={{ paddingLeft: 15 }}>+ Add attachment</p>
    </div>
  );
}

function EditAttachmentModal({ onClick }) {
  return (
    <LightTooltip arrow title="Edit">
      <EditOutlinedIcon onClick={onClick} />
    </LightTooltip>
    // </div>
  );
}

function EditAttachmentModalContainer({
  handleClose,
  data,
  projectId,
  orgId,
  mutate,
  isLoading,
  folderName,
}) {
  console.log({ data });

  const [tempValue, setTempValue] = useState({ ...data });
  const [error, setError] = useState({
    name: "",
    storageLink: "",
  });
  const updateProjectAttachment = () => {
    // console.log({ data }, { attachmentId });
    const { name, storageLink } = tempValue;
    if (name?.trim()?.length === 0) {
      return setError({ ...error, name: "Please enter a valid title." });
    }
    let reg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

    if (storageLink?.trim()?.length === 0 || !reg.test(storageLink)) {
      return setError({ ...error, storageLink: "This is not a valid URL." });
    }

    let obj = {
      data: {
        name: tempValue?.name,
        storageLink: tempValue?.storageLink,
      },
      projectId,
      orgId,
      attachmentId: data?._id,
      isFolderEdit: false,
      isFileEdit: true,
      handleClose,
      folderName: folderName,
    };
    mutate(obj);
    // setIsFolderNameEdit(false);
  };

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setTempValue({ ...tempValue, [name]: value });
    setError({ ...error, [name]: "" });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <TextInput
          placeholder="Title"
          style={{ width: "100%", marginBottom: 20 }}
          value={tempValue?.name}
          name="name"
          onChange={onHandleChange}
          helperText={error?.name}
          error={error?.name ? true : false}
        />
      </div>

      <div>
        <TextInput
          placeholder="Url"
          style={{ width: "100%", marginBottom: 20 }}
          value={tempValue?.storageLink}
          name="storageLink"
          onChange={onHandleChange}
          helperText={error?.storageLink}
          error={error?.storageLink ? true : false}
        />
      </div>
      <CustomButton onClick={updateProjectAttachment} loading={isLoading}>
        Update
      </CustomButton>
    </div>
  );
}

function AddLink({ onClick, isLoading }) {
  const [addLink, setAddLink] = useState(false);
  const [urlObj, setUrlObj] = useState({
    title: "",
    url: "",
  });

  const [error, setError] = useState({
    title: "",
    url: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUrlObj({
      ...urlObj,
      [name]: value,
    });

    if (value.length < 3) {
      setError({
        ...error,
        [name]: "",
      });
    }
  };

  const handleSubmit = () => {
    const { title, url } = urlObj;
    if (title.trim()?.length === 0) {
      return setError({
        ...error,
        title: true,
      });
    }

    if (url.trim()?.length === 0 || error?.url) {
      return setError({
        ...error,
        url: true,
      });
    }

    onClick(urlObj, handleClose);
  };
  const handleClose = () => {
    setAddLink(false);
    setUrlObj({
      title: "",
      url: "",
    });
  };
  return addLink ? (
    <ClickAwayListener onClickAway={() => setAddLink(!addLink)}>
      <div
        className={classes.addRow}
        style={{
          gridTemplateColumns: "6px 1fr",
          position: "relative",
        }}
      >
        <div className={classes.sideBar} />
        <div className="d_flex alignCenter">
          <div
            className="mr-4"
            style={{ flex: 1, display: "flex", position: "relative" }}
          >
            <input
              type="text"
              placeholder="Title *"
              autoFocus
              style={{
                height: 35,
                paddingLeft: 15,
              }}
              name="title"
              onChange={handleChange}
              value={urlObj.title}
            />
            {error?.title && (
              <LightTooltip arrow title={"Please enter a valid title"}>
                <ErrorIcon
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: 10,
                    transform: "translateY(50%)",
                    color: "var(--red)",
                  }}
                />
              </LightTooltip>
            )}
          </div>
          <div
            className="mr-4"
            style={{
              flex: 1,
              display: "flex",
              position: "relative",
              backgroundColor: "red",
            }}
          >
            <input
              value={urlObj.url}
              type="text"
              style={{
                height: 35,
                paddingLeft: 15,
              }}
              placeholder="Enter URL *"
              name="url"
              onChange={(e) => {
                // let reg = new RegExp(
                //   "^(https?:\\/\\/)?" +
                //   "(http?:\\/\\/)"+// protocol
                //     "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                //     "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                //     "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                //     "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                //     "(\\#[-a-z\\d_]*)?$",
                //   "i"
                // ); // fragment locator
                let reg =
                  /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

                handleChange(e);
                if (reg.test(e.target.value)) {
                  setError({
                    ...error,
                    url: "",
                  });
                } else {
                  setError({
                    ...error,
                    url: true,
                  });
                }
              }}
            />
            {error?.url && (
              <LightTooltip arrow={true} title={"This is not a valid URL."}>
                <ErrorIcon
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: 10,
                    transform: "translateY(50%)",
                    color: "var(--red)",
                  }}
                />
              </LightTooltip>
            )}
          </div>

          <CustomButton
            className="mr-1"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            Add Link
          </CustomButton>
        </div>
      </div>
    </ClickAwayListener>
  ) : (
    <div className={classes.addRow} onClick={() => setAddLink(!addLink)}>
      <div className={classes.sideBar}></div>
      <p style={{ paddingLeft: 15 }}>+ Add Link</p>
    </div>
  );
}

function ProjectAttachmentPreview({
  fileChangeHandle,
  removeFile,
  data,
  handleClose,
  isLoading,
  onAddAttachment,
}) {
  let uploadRef = React.createRef();
  console.log({ data });
  return (
    <div className="d_flex flexColumn " style={{ minHeight: 200 }}>
      <div className="flex">
        <CustomRow
          inputType="file"
          value={undefined}
          onChange={(value) => fileChangeHandle(value)}
          isLoading={isLoading}
          apiKey="attachment"
          sendAllAttachment
        />
      </div>
      {/* <div onClick={() => uploadRef.click()}>Add File</div> */}
      {/* {data?.map((item, index) => (
        <div style={{ position: "relative" }} key={index}>
          <img src={URL.createObjectURL(item)} />
          <CancelRoundedIcon
            onClick={() => removeFile(index)}
            style={{
              position: "absolute",
            }}
          />
        </div>
      ))}
      <input
        type="file"
        style={{ display: "none" }}
        ref={(ref) => (uploadRef = ref)}
        onChange={fileChangeHandle}
        multiple
      /> */}
      <CustomButton
        loading={isLoading}
        onClick={() => data?.length && onAddAttachment(handleClose)}
        universal
        autoHide
      >
        Upload Attachment
      </CustomButton>
    </div>
  );
}
