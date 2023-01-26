import { ClickAwayListener } from "@material-ui/core";
import IosIcon from "components/icons/IosIcon";
import React, { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useAddMilestoneModule } from "react-query/milestones/module/useAddMilestoneModule";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./MilestoneModule.scss";
function AddNewModule() {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { location } = useHistory();
  const { mutate } = useAddMilestoneModule();
  const [moduleName, setModuleName] = useState("");
  const [error, setError] = useState("");
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
  const [isActive, setIsActive] = useState(false);
  const onClickAway = () => {
    if (!moduleName.trim()?.length) {
      return clearFunction();
    }
    let milestoneId = location.pathname.split("/")?.[4];
    let projectId = location?.pathname.split("/")?.[3];
    const previousModule = queryClient.getQueryData([
      "module",
      orgId,
      milestoneId,
    ]);
    let previousModuleExist = previousModule.modules.filter(
      (item) =>
        item?.module?.trim()?.toLowerCase() === moduleName.trim()?.toLowerCase()
    );
    if (previousModuleExist?.length) {
      return setError("Module Name is already exist.");
    }
    let temData = {
      data: {
        module: moduleName,
      },
      orgId,
      milestoneId,
      projectId,
      callBack: clearFunction,
    };
    mutate(temData);
  };

  const clearFunction = useCallback(() => {
    setIsActive(false);
    setError("");
    setModuleName("");
  }, []);

  return (
    <ClickAwayListener onClickAway={() => setIsActive(false)}>
      {!isActive ? (
        <div className="addNewModule mb-2" onClick={() => setIsActive(true)}>
          + Add a new module
        </div>
      ) : (
        <div className="mb-2">
          <div className={`addNewModuleRow alignCenter`}>
            <div
              className="sideLine"
              style={{
                backgroundColor: error && "var(--red)",
              }}
            />
            <div className="d_flex flex" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Module Title*"
                className="inputAdd"
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    onClickAway();
                  }
                }}
                value={moduleName}
                onChange={(event) => {
                  setModuleName(event.target.value);
                  setError("");
                }}
                autoFocus
                style={{
                  borderColor: error && "var(--red)",
                }}
              />
              <div className="alignCenter addButton"
              onClick={onClickAway}
              >
                <IosIcon name="addRound" />
                <p className="ml-1">Add</p>
              </div>
            </div>
          </div>
          {error && (
            <p
              style={{
                fontSize: 12,
                color: "var(--red)",
                // marginTop: -10,
                marginBottom: 20,
              }}
            >
              {error}
            </p>
          )}
        </div>
      )}
    </ClickAwayListener>
  );
}

export default AddNewModule;
