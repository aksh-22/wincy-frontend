import { useProjectTeam } from "hooks/useUserType";
import React, { memo, useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "react-query";
import "./MoveToContainer.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { capitalizeFirstLetter } from "utils/textTruncate";
import CustomButton from "components/CustomButton";
import { useMilestoneModule } from "react-query/milestones/module/useMilestoneModule";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { useMoveTo } from "react-query/milestones/moveTo/useMoveTo";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import { useTasks } from "react-query/milestones/task/useTasks";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import IosIcon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useCopyTasks } from "react-query/milestones/task/useCopyTasks";
function MoveToContainer({ handleClose, moveId, milestoneId, type }) {
  const searchRef = useRef(null);
  const { orgId, projectId } = useProjectTeam();
  const queryClient = useQueryClient();
  const [milestoneList, setMilestoneList] = useState([]);
  const { mutate, isLoading } = useMoveTo();
  const { mutate: copyMutate, isLoading: copyLoading } = useCopyTasks();
  const [selectedMilestone, setSelectedMilestone] = useState(
    moveId ? { _id: milestoneId } : null
  );

  const milestoneListQuery = queryClient.getQueryData([
    "milestones",
    orgId,
    projectId,
  ]);
  useEffect(() => {
    setMilestoneList(milestoneListQuery?.milestones ?? []);
    searchRef.current && (searchRef.current.value = null);
  }, [milestoneListQuery]);

  // const getTaskList = (milestoneId) => {
  //   const taskId = queryClient.getQueryData(["tasks", orgId, milestoneId]);
  // };
  const [moduleId, setModuleId] = useState(null);
  // const [milestoneId, setMilestoneId] = useState(null);
  const [moduleToggle, setModuleToggle] = useState(false);

  const onSelectModuleId = useCallback(
    (moduleId) => {
      setModuleId(moduleId);
      // setMilestoneId(milestone_id);
    },
    [moduleId, selectedMilestone]
  );

  const isSelected = useSelector((state) => state.userReducer?.isTaskSelected);
  const { location } = useHistory();
  const handleSubmit = () => {
    let obj = {
      data: {
        tasks: moveId ? [moveId] : isSelected,
        module: moduleId,
      },
      orgId: orgId,
      projectId: projectId,
      milestoneId: selectedMilestone?._id,
      moduleId: moduleId,
      callBack: handleClose,
    };
    if (location?.pathname?.split("/")?.[4] !== selectedMilestone?._id) {
      obj.data.milestone = selectedMilestone?._id; // only when move different milestone
      obj.otherMilestoneMove = true;
      obj.previousMilestoneId = location?.pathname?.split("/")?.[4];
    }
    if (type === "copy") {
      copyMutate(obj);
    } else {
      mutate(obj);
    }
  };
  const { data: taskList } = useTasks(
    orgId,
    moveId
      ? selectedMilestone?._id === milestoneId
        ? null
        : selectedMilestone?._id
      : selectedMilestone?._id
  );
  const { data: moduleList, isLoading: moduleListLoading } = useMilestoneModule(
    undefined,
    selectedMilestone?._id
  );
  const [isUnCategorized, setIsUnCategorized] = useState(false);
  const [modules, setModules] = useState([]);
  useEffect(() => {
    const tempModuleList = queryClient.getQueryData([
      "module",
      orgId,
      selectedMilestone?._id,
    ]);
    if (tempModuleList?.modules) {
      setIsUnCategorized(
        tempModuleList?.modules[tempModuleList?.modules?.length - 1]?._id ===
          "unCategorized"
      );
    }
    setModules(moduleList?.modules ?? []);
  }, [moduleList]);
  const handleSearch = (e) => {
    const { value } = e.target;
    setModuleId(null);
    if (selectedMilestone) {
      // const tempModuleList = queryClient.getQueryData(["module", orgId, milestoneId]);
      if (!value?.trim()?.length) {
        return setModules(moduleList?.modules ?? []);
      }
      let result = moduleList?.modules?.filter((item) =>
        item?.module?.toLowerCase().includes(value?.toLowerCase())
      );

      setModules(result);
    } else {
      if (!value?.trim()?.length) {
        return setMilestoneList(milestoneListQuery?.milestones ?? []);
      }

      let result = milestoneListQuery?.milestones?.filter((item) =>
        item?.title?.toLowerCase().includes(value?.toLowerCase())
      );
      setMilestoneList(result);
    }
  };
  return (
    <div className="moveToContainer">
      <div
        style={{
          padding: "20px 20px 0",
        }}
      >
        {moduleToggle && (
          <div
            className="moveToContainer_backIcon mb-1"
            onClick={() => {
              setSelectedMilestone(null);
              setModuleToggle(false);
              setModuleId(null);
              setModules(null);
              searchRef.current.value = null;
            }}
          >
            <ArrowBackIosRoundedIcon style={{ fontSize: 16, marginRight: 1 }} />
          </div>
        )}
        <p className="mb-1 moveToContainer_backIcon_headingText">
          Select {moduleToggle ? "Module" : "Milestone"}
        </p>

        <div className="searchContainer">
          <input
            type="search"
            name="search"
            placeholder={`Search ${
              !selectedMilestone ? "Milestone" : "Module"
            }`}
            onChange={handleSearch}
            ref={searchRef}
            autoComplete="off"
          />
          <SearchIcon />
        </div>
      </div>

      {!moduleToggle && milestoneList?.length ? (
        <div
          style={{
            maxHeight: "75%",
            overflowY: "auto",
            maxWidth: 300,
            padding: 10,
            // paddingBottom: 100,
          }}
        >
          {milestoneList?.map((item, index) => (
            <MilestoneContainer
              key={item?._id}
              item={item}
              orgId={orgId}
              onSelectModuleId={onSelectModuleId}
              moduleId={moduleId}
              moduleToggle={moduleToggle}
              setModuleToggle={setModuleToggle}
              setSelectedMilestone={setSelectedMilestone}
              searchRef={searchRef}
            />
          ))}
        </div>
      ) : moduleListLoading ? (
        <TableRowSkeleton count={4} style={{ margin: "0px 20px" }} />
      ) : selectedMilestone && modules?.length > 0 ? (
        <div
          style={{
            height: moduleId ? "40%" : "55%",
            overflowY: "auto",
            maxWidth: 300,
            padding: 10,
            // paddingBottom: 100,
          }}
        >
          {moduleListLoading ? (
            <TableRowSkeleton count={4} style={{ margin: "0px 20px" }} />
          ) : (
            modules?.map(
              (item, index) =>
                item?._id !== "unCategorized" && (
                  <div
                    key={item?._id}
                    className={`milestoneNameRow moduleRow mr-1  ${
                      moduleId === item?._id ? "selectedModule" : ""
                    } `}
                    style={{
                      borderBottom:
                        modules?.length - (isUnCategorized ? 2 : 1) > index
                          ? "none"
                          : "",
                    }}
                    onClick={() => onSelectModuleId(item?._id)}
                  >
                    <p className="textEllipse">
                      {capitalizeFirstLetter(item.module)}
                    </p>
                  </div>
                )
            )
          )}
        </div>
      ) : (
        <div
          className="alignCenter flexColumn"
          style={{
            position: "absolute",
            transform: "translate(50%, -50%)",
            top: "70%",
            right: "50%",
          }}
        >
          <IosIcon
            name="notFound"
            style={{
              width: 100,
              height: 100,
              marginBottom: 20,
            }}
          />

          <p>{`No ${!selectedMilestone ? "Milestone" : "Module"} Found`}</p>
        </div>
      )}
      {selectedMilestone && moduleId && (
        <div
          style={{
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          <CustomButton
            onClick={handleSubmit}
            loading={isLoading || copyLoading}
            className={"mr-2"}
          >
            <div>{type === "copy" ? "Copy To" : `Move To`}</div>
          </CustomButton>
        </div>
      )}
    </div>
  );
}

export default memo(MoveToContainer);

function MilestoneContainer({
  item,
  projectId,
  orgId,
  onSelectModuleId,
  moduleId,
  setModuleToggle,
  moduleToggle,
  setSelectedMilestone,
  searchRef,
}) {
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-2 px-1">
      {
        <LightTooltip
          title={
            !(item?.moduleCount > 0)
              ? "This milestone does not contain any module."
              : ""
          }
          arrow
        >
          <div
            key={item?._id}
            className={`milestoneNameRow ${
              !(item?.moduleCount > 0) ? "disableModule" : ""
            }`}
            onClick={() => {
              if (item?.moduleCount > 0) {
                setSelectedMilestone(item);
                setModuleToggle(true);
                searchRef.current && (searchRef.current.value = null);
              }
            }}
          >
            <p className="flex textEllipse">
              {capitalizeFirstLetter(item?.title)}
            </p>
            {item?.moduleCount > 0 && (
              <ArrowForwardIosIcon
                className={`arrowContainer ml-1 ${
                  moduleToggle ? "arrowContainer_90degree" : ""
                }`}
                style={{
                  fontSize: 16,
                }}
              />
            )}
          </div>
        </LightTooltip>
      }

      {/* {moduleToggle && (
        <TaskList
          milestoneId={item?._id}
          orgId={orgId}
          projectId={projectId}
          onSelectModuleId={onSelectModuleId}
          moduleId={moduleId}
        />
      )} */}
    </div>
  );
}

function TaskList({
  orgId,
  milestoneId,
  moduleId,
  onSelectModuleId,
  data,
  isLoading,
}) {
  const queryClient = useQueryClient();
  const [modules, setModules] = useState([]);
  const [isUnCategorized, setIsUnCategorized] = useState(false);
  const { data: taskList } = useTasks(orgId, milestoneId);
  // const { data, isLoading } = useMilestoneModule(undefined, milestoneId);
  useEffect(() => {
    const moduleList = queryClient.getQueryData(["module", orgId, milestoneId]);
    console.log("-->", { moduleList }, milestoneId, orgId);
    if (moduleList?.modules) {
      setIsUnCategorized(
        moduleList?.modules[moduleList?.modules?.length - 1]?._id ===
          "unCategorized"
      );
    }
    setModules(moduleList?.modules ?? []);
  }, [data]);
  console.log("modules", isUnCategorized, data);
  return (
    <div
      style={{
        maxHeight: 300,
        overflowY: "auto",
        maxWidth: 300,
      }}
      // className="moduleMoveTo"
    >
      {isLoading ? (
        <TableRowSkeleton count={4} />
      ) : (
        modules?.map(
          (item, index) =>
            item?._id !== "unCategorized" && (
              <div
                key={item?._id}
                className={`milestoneNameRow moduleRow textEllipse ${
                  moduleId === item?._id ? "selectedModule" : ""
                } `}
                style={{
                  borderBottom:
                    modules?.length - (isUnCategorized ? 2 : 1) > index
                      ? "none"
                      : "",
                }}
                onClick={() => onSelectModuleId(item?._id, milestoneId)}
              >
                {capitalizeFirstLetter(item.module)}{" "}
              </div>
            )
        )
      )}
    </div>
  );
}
