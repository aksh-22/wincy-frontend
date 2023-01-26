import CustomButton from "components/CustomButton";
import React, { useState } from "react";
import { useProjectAttachment } from "react-query/projects/useProjectAttachment";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import ProjectAttachmentRow from "./ProjectAttachmentRow";
import { useAddProjectAttachment } from "react-query/projects/useAddProjectAttachment";
import { useDeleteProjectAttachment } from "react-query/projects/useDeleteProjectAttachment";
import TextField from "@material-ui/core/TextField";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import InputBase from "@material-ui/core/InputBase";
import classes from "./ProjectAttachment.module.css";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import Requirements from "../requirements/Requirements";
import { errorToast } from "utils/toast";

function ProjectAttachment({
  orgId,
  projectId,
  showAddFolder,
  setShowAddFolder,
  disabled
}) {
  
  const { data, isLoading } = useProjectAttachment(orgId, projectId);
  const { mutateAddAttachment, isLoadingAddAttachment } =
    useAddProjectAttachment(orgId, projectId);
  const { isLoadingDelete, mutateDeleteAttachment } =
    useDeleteProjectAttachment(orgId, projectId);
  const [isSelected, setIsSelected] = useState([]);
  const [error, setError] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const onAddFolder = () => {
    mutateAddAttachment({
      data: {
        folder: newFolder.trim(),
      },
      orgId,
      projectId,
      newFolder: true,
    });
    setShowAddFolder();
  };

  const onSelectAttachment = (id) => {
    if (isSelected.includes(id)) {
      setIsSelected(isSelected.filter((item) => item !== id));
    } else {
      setIsSelected([id, ...isSelected]);
    }
  };
  console.log({ isSelected });

  // const multipleDelete = () => {};

  const onChangeNewFolder = () => {
    if (newFolder.trim().length === 0) {
      // setShowAddFolder();
      return null
    }
    if (
      data?.attachments?.filter(
        (item) => item?._id?.folder === newFolder.trim()
      ).length !== 0
    ) {
      errorToast("Folder name is already exist")
      // setError("Folder already exist");
    } else {
      onAddFolder();
    }
  };
  console.log({ data });

  return isLoading ? (
    <TableRowSkeleton count={5} height={35} />
  ) : (
    <div>
      {showAddFolder && (
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--milestoneRowColor)",
          }}
        >
          {/* <CreateNewFolderOutlinedIcon />
                Create Folder */}
          <FolderOpenRoundedIcon style={{ margin: 10 }} />
          <InputBase
            onChange={(e) => setNewFolder(e.target.value)}
            style={{ flex: 1, border: "none" }}
            onKeyPress={(e) => e.key === "Enter" && onChangeNewFolder()}
            helperText={error}
            placeholder="Enter Folder Name"
            error={error}
            className={classes.input}
            autoFocus={true}
            // variant="outlined"
          />
        </div>
      )}

      {data?.attachments?.map((item, index) => (
        <ProjectAttachmentRow
          data={item}
          orgId={orgId}
          projectId={projectId}
          addAttachmentMutate={mutateAddAttachment}
          deleteAttachmentMutate={mutateDeleteAttachment}
          key={index}
          isLoading={isLoadingAddAttachment}
          isLoadingDelete={isLoadingDelete}
          onSelect={onSelectAttachment}
          isSelected={isSelected}
          disabled={disabled}
          allData={data}
        />
      ))}
      

      {/* <Requirements 
      title="Requirement"
      
      /> */}

      <BottomActionBar
        isSelected={isSelected}
        onClose={() => setIsSelected([])}
        onDelete
        data={{
          data: {
            attachments: isSelected,
          },
          orgId,
          projectId,
          onToggle: () => setIsSelected([]),
        }}
        isLoading={isLoadingDelete}
        mutate={mutateDeleteAttachment}
      />
    </div>
  );
}

export default ProjectAttachment;
