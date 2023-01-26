import React, { useState, memo, useRef, useEffect, useCallback } from "react";
import "./AddModuleKanban.scss";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "components/CustomButton";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { useQueryClient } from "react-query";
import { useProjectInfo } from "react-query/projects/useProjectInfo";
import { useProjectTeam } from "hooks/useUserType";
import { useAddMilestoneModule } from "react-query/milestones/module/useAddMilestoneModule";
import IosIcon from "components/icons/IosIcon";

function AddModuleKanban() {
  const textAreaRef = useRef(null);
  const queryClient = useQueryClient();
  const { orgId, milestoneId, projectId } = useProjectTeam();

  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      clearFunction();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const clearFunction = useCallback(() => {
    setToggle(false);
    setError("");
    setInput("");
  }, []);
  const { mutate } = useAddMilestoneModule();
  const onSubmit = () => {
    if (!input.trim()?.length) {
      return null;
    }
    const previousModule = queryClient.getQueryData([
      "module",
      orgId,
      milestoneId,
    ]);
    let previousModuleExist = previousModule.modules.filter(
      (item) =>
        item?.module?.trim()?.toLowerCase() === input.trim()?.toLowerCase()
    );

    if (previousModuleExist?.length) {
      return setError("Module Name is already exist.");
    }
    let temData = {
      data: {
        module: input,
      },
      orgId,
      milestoneId,
      projectId,
      callBack: clearFunction,
    };
    mutate(temData);
  };
  const inputToggle = () => {
    setToggle(!toggle);
  };
  return (
    <div className="my-1">
      {!toggle && (
        <div
          className="addModuleKanban"
          style={{
            fontSize: 16,
          }}
          onClick={inputToggle}
        >
          <IosIcon name="addRound" style={{ marginRight: 5 }} />
          <p
            style={{
              marginBottom: 1,
            }}
          >
            Add Module
          </p>
        </div>
      )}

      {toggle && (
        <div
          className="boxShadow "
          style={{
            backgroundColor: "var(--popUpColor)",
            padding: "10px",
            cursor: "pointer",
            borderTop: "1px solid var(--popUpColor)",
            // position:"absolute",
            // bottom : 0,
            width: "325px",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#2F3453",
              width: "100%",
              border: "1px solid #B6BAD5",
            }}
          >
            <textarea
              rows={4}
              spellCheck={true}
              onChange={(e) => {
                setError("");
                setInput(e.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && event.shiftKey) {
                }
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.stopPropagation();
                  onSubmit();
                }
              }}
              placeholder="Enter module title"
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
              }}
            />
          </div>
          {error && (
            <p
              style={{
                color: "var(--red)",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <ErrorRoundedIcon
                style={{
                  fontSize: 16,
                  marginRight: 2,
                }}
              />
              {error}
            </p>
          )}
          <div ref={textAreaRef} style={{ marginTop: 10 }}>
            <CustomButton style={{ width: 80 }} onClick={onSubmit}>
              {" "}
              Add{" "}
            </CustomButton>
            <IconButton
              onClick={() => {
                setToggle((prev) => !prev);
                setInput("");
              }}
            >
              <CloseIcon style={{ fontSize: 20, color: "white" }} />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AddModuleKanban);
