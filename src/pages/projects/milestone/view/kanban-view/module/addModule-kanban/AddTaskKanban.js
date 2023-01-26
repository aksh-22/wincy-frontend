import { IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "components/CustomButton";
import { useProjectTeam } from "hooks/useUserType";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { useAddTask } from "react-query/milestones/task/useAddTask";

function AddTaskKanban({ orgId, milestoneId, projectId, moduleInfo, disabled , setAddPopupOpen }) {
    const queryClient = useQueryClient();
  const { platforms, team } = useProjectTeam();
    const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [toggleInput, setToggleInput] = useState(false);

  const textAreaRef = useRef(null);
const onSubmit = () => {
    if (!input?.trim().length) {
        return setError("Please fill task name field");
      }
    const taskList = queryClient.getQueryData(["tasks", orgId, milestoneId]);
    const task = taskList?.filter((item) => item?._id?.[0] === moduleInfo?._id);

    if (task?.length) {
        let alreadyTaskNameExist = task?.[0]?.tasks?.filter(
          (item) =>
            item?.title?.trim()?.toLowerCase() ===
            input?.trim()?.toLowerCase()
        );
        if (alreadyTaskNameExist?.length) {
          setError("This task Name is already exist.");
        } else {
          addTaskFunction();
        }
      } else {
        addTaskFunction();
      }
}

// Add Task Process
const { mutate } = useAddTask();
const addTaskFunction = () => {
  let data = {
    data: {
      title:input,
      module: moduleInfo?._id,
    },
    orgId,
    projectId,
    milestoneId,
    moduleInfo,
    callBack: clearDetails,
  };
  mutate(data);

};


const clearDetails = () => {
    setInput("");
    setError("");
    setToggleInput(false);
    setAddPopupOpen(false)
  };
  return (
    <>
      {toggleInput ? (
        <div
        className="boxShadow"
        style={{
            backgroundColor: "var(--popUpColor)",
            padding: "10px",
            cursor: "pointer",
            borderTop: "1px solid var(--popUpColor)",
            position:"absolute",
            bottom : 0,
            width:"100%",
            // borderRadius:8
          }}
        >
          <div
            style={{
              backgroundColor: "#2F3453",
              width: "100%",
              border:"1px solid #B6BAD5"
            }}
          >
            <textarea
              rows={4}
              spellCheck={true}
              onChange={(e) => {
                  setError("")
                  setInput(e.target.value)
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && event.shiftKey) {
                }
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.stopPropagation();
                  onSubmit()
                }
              }}
              placeholder="Enter task title"
              autoFocus={true}
              value={input}
              style={{
                width: "100%",
                border: "none",
                outline: 0,
                backgroundColor: "#2F3453",
                paddingLeft: 5,
                paddingTop: 5,
                color: "#fff",
                fontSize: 14,
                fontFamily: "sans-serif",
              }}
            />
          </div>
          {error &&  <p
                  style={{
                    color:"var(--red)",
                    fontSize:12,
                    display:"flex",
                    alignItems:"center",
                    marginTop:10
                  }}
                  ><ErrorRoundedIcon 
                  style={{
                    fontSize:16,
                    marginRight:2
                  }}
                  />{error}</p>}
          <div ref={textAreaRef} style={{ marginTop: 10 }}>
            <CustomButton style={{ width: 80 }}
             onClick={onSubmit}
             >
              {" "}
              Add{" "}
            </CustomButton>
            <IconButton
              onClick={() => {
                setToggleInput((prev) => !prev);
                setInput("");
                setAddPopupOpen(false)
              }}
            >
              <CloseIcon style={{ fontSize: 20, color: "white" }} />
            </IconButton>
          </div>
        </div>
      ) : null}
      {
        !toggleInput ? (
          <div
            onClick={() =>{ setToggleInput((prev) => !prev); setAddPopupOpen(true)}}
            className="boxShadow"
            style={{
              backgroundColor: "var(--milestoneCard)",
              padding: "10px 0px 10px 20px",
              cursor: "pointer",
              borderTop: "1px solid var(--milestoneCard)",
              position:"absolute",
              bottom : 0,
              width:"100%",
              // borderRadius:8
            }}
          >
            + Add Task
          </div>
        ) : null
      }
    </>
  );
}

export default AddTaskKanban;
