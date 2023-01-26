/* eslint-disable jsx-a11y/no-access-key */
import Checkbox from "@mui/material/Checkbox";
import { LightTooltip } from "components/tooltip/LightTooltip";
import css from "css/FilterInProject.module.css";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSection } from "react-query/bugs/useSection";
import { useHistory } from "react-router-dom";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { useProjectAllTasks } from "react-query/projects/useProjectAllTasks";
import { capitalizeFirstLetter } from "utils/textTruncate";
import CustomInput from "components/customInput/CustomInput";
const priority = ["Low", "Medium", "High"];
const status = ["Not Started", "Active", "Completed"];
const bugStatus = ["Open", "InProgress", "InReview", "Done"];
const dateFilter = ["Today", "Yesterday", "Last 7 Days"];
function FilterInProject({
  type,
  bugsPlatform,
  projectInfo,
  orgId,
  projectId,
  filter,
  setFilter,
  team,
  platforms,

  developerStatus,
  testerStatus,
  noPlatform,
  noAssignee,
  filterCount,
  clearFilter,
  platformIds,
}) {
  const { location } = useHistory();
  const { data: taskList, isLoading: taskListIsLoading } = useProjectAllTasks({
    orgId,
    projectId,
  });
  // const {data} = useSectionMultiple(orgId, projectId , ["60cc5f268e87bf110823a788" , "60cc63d82c91b0a543f61803"])
  const queryClient = useQueryClient();
  const previousMilestone = queryClient.getQueryData([
    "milestones",
    orgId,
    projectId,
  ]);

  const [milestoneId, setMilestoneId] = useState(null);

  useEffect(() => {
    if (location?.pathname.split("/")?.length === 5) {
      // setShowMilestone(location?.pathname.split("/")[4] !== "" ? false : true);
      setMilestoneId(location?.pathname.split("/")[4]);
    } else {
      setMilestoneId(null);
    }
  }, [location?.pathname]);
  // const [platformIdLocal, setPlatformIdLocal] = useState(null)
  // const {} = useSection(orgId , projectId ,platformIdLocal )

  useEffect(() => {
    let obj = {};
    filter?.platforms?.map((item, index) => {
      obj[item] = item;
      return null;
    });
    for (const ids in platformIds) {
      if (obj[ids] === undefined) {
        if (filter[platformIds[ids]] !== undefined) {
          setFilter((prevState) => ({
            ...prevState,
            [platformIds[ids]]: [],
          }));
        }
      }
    }
  }, [filter?.platforms]);
  const getSelectedMileStone = (value) => {
    setFilter((prevState) => ({
      ...prevState,
      milestoneIds: value,
    }));
  };
  const onAssigneeSelected = (value) => {
    setFilter((prevState) => ({
      ...prevState,
      assigneeIds: value,
    }));
  };

  const onMultiSelection = (value, key) => {
    setFilter((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <>
      <div
        className="p-1 d_flex "
        style={{
          background: "#353581",
          color: "blue",
        }}
      >
        <div
          className="flex"
          style={{
            color: "#FFF",
            fontSize: 14,
          }}
        >
          Quick Filters
        </div>
        <LightTooltip
          arrow
          title={filterCount === 0 ? "There are no active filters" : ""}
        >
          <div
            className={`cursorPointer clearFilter ${
              filterCount === 0 ? "clearFilterDisable" : ""
            }`}
            onClick={clearFilter}
          >
            Clear All
          </div>
        </LightTooltip>
      </div>
      <div className=" p-10px d_flex  filterContainer">
        {type === "milestone" && !milestoneId && (
          <FilterRow
            title={"Milestone"}
            data={previousMilestone?.milestones}
            onChange={getSelectedMileStone}
            type={"milestone"}
            value={filter?.milestoneIds}
          />
        )}

        {type === "milestone" && !milestoneId ? null : (
          <FilterRow
            title={"Assignee"}
            data={team}
            onChange={onAssigneeSelected}
            type={"assignee"}
            value={filter?.assigneeIds}
          />
        )}

        {(type === "milestone" || type === "task") && (
          <FilterRow
            title={"Status"}
            data={status}
            onChange={onMultiSelection}
            type={"platforms"}
            accessKey="status"
            value={filter?.status}
          />
        )}

        {type === "bug" && (
          <FilterRow
            title={"Bug Status"}
            data={bugStatus}
            onChange={onMultiSelection}
            type={"platforms"}
            accessKey="bugStatus"
            value={filter?.bugStatus}
          />
        )}

        {/* {type === "bug" && developerStatus && (
          <FilterRow
            title={"Developer Status"}
            data={developerStatus}
            onChange={onMultiSelection}
            type={"platforms"}
            accessKey="developerStatus"
            value={filter?.developerStatus}
          />
        )} */}

        {type === "bug" && (
          <FilterRow
            title={"Priority"}
            data={priority}
            onChange={onMultiSelection}
            type={"platforms"}
            accessKey="priority"
            value={filter?.priority}
          />
        )}
        {type === "bug" && (
          <FilterRow
            title={"Date"}
            data={dateFilter}
            onChange={(value) =>
              setFilter({
                ...filter,
                date: filter?.date  === value ? "" :value,
              })
            }
            type={"platforms"}
            accessKey="bugStatus"
            value={filter?.date}
            singleSelection={true}
          />
        )}
        {type === "milestone" && !milestoneId ? null : (
          <FilterRow
            title={"Platform"}
            data={platforms}
            onChange={onMultiSelection}
            type={"platforms"}
            accessKey="platforms"
            value={filter?.platforms}
          />
        )}
        {type === "bug" && (
          <FilterRow
            title={"Tasks"}
            data={taskList}
            onChange={onMultiSelection}
            type={"milestone"}
            accessKey="bugTaskIds"
            value={filter?.bugTaskIds}
            searchable={true}
          />
        )}

        {/* {type === "bug" &&
          filter?.platforms?.map(
            (item, index) =>
              platformIds?.[item] && (
                <FilterRow
                  title={`${item}'s Sections`}
                  onChange={onMultiSelection}
                  type={"platforms"}
                  value={filter[platformIds?.[item]] ?? []}
                  platformId={platformIds?.[item]}
                  orgId={orgId}
                  projectId={projectId}
                  accessKey={platformIds?.[item]}
                />
              )
          )} */}
      </div>
    </>
  );
}

export default FilterInProject;

function FilterRow({
  title,
  data,
  onChange,
  accessKey,
  type,
  value,
  platformId,
  orgId,
  projectId,
  singleSelection,
  searchable,
}) {
  const { data: sectionData, isLoading } = useSection(
    orgId,
    projectId,
    platformId
  );
  const [isSelected, setIsSelected] = useState(value ?? []);
  useEffect(() => {
    setIsSelected(value ?? []);
  }, [value]);
  const [taskSelected, setTaskSelected] = useState([]);
  const onSelectFunction = (id) => {
    let newValue = [...isSelected];
    if (isSelected.includes(id)) {
      let newDAta = isSelected.filter((item) => item !== id);
      newValue = newValue.filter((item) => item !== id);
      setIsSelected((previousState) => [...newDAta]);
    } else {
      newValue = [...newValue, id];
      setIsSelected((previousState) => [...previousState, id]);
    }
    onChange(newValue, accessKey);
  };

  const onTaskSelect = (value) => {
    let newValue = [...taskSelected];
    if (newValue?.filter((item) => item?._id === value?._id).length === 0) {
      newValue.push(value);
    } else {
      newValue = newValue?.filter((item) => item?._id !== value?._id);
    }
    setTaskSelected(newValue);
    onChange(newValue);
  };

  const [search, setSearch] = useState(null);
  const onHandleSearch = (event) => {
    const { value } = event?.target;
    if (data?.length > 0) {
      if (!value?.trim()?.length) return setSearch(null);

      let result = data?.filter((_item) =>
        _item?.title?.toLowerCase().includes(value?.toLowerCase())
      );
      setSearch(result);
    }
  };

  return (
    <div className=" filterChildContainer">
      <p
        className="mb-1"
        style={{
          // fontFamily: "Comfortaa-Medium",
          fontSize: 13,
        }}
      >
        {title}
      </p>

      <ul className={css.optionsContainer}>
        {isLoading ? (
          <TableRowSkeleton count={4} />
        ) : (
          sectionData?.map((item, index) => (
            <LightTooltip
              arrow
              key={index}
              title={item?.length > 20 ? item : ""}
            >
              <div key={index}>
                <li
                  onClick={() => {
                    onSelectFunction(item);
                  }}
                  className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                    sectionData.length - 1 === index ? "mb-1" : ""
                  } ${isSelected?.includes(item) ? css.activeTile : ""}`}
                >
                  <div className={css.textColumn}>
                    <Checkbox
                      checked={isSelected?.includes(item)}
                      size="small"
                      sx={{
                        color: "#c8c8d0",
                        "&.Mui-checked": {
                          color: "",
                        },
                      }}
                    />
                    <p className="filter_title">
                      {item?.length > 20
                        ? item?.substring(0, 20) + "..."
                        : item}
                    </p>
                  </div>
                </li>
              </div>
            </LightTooltip>
          ))
        )}

        {searchable && (
          <div>
            <CustomInput
              type="search"
              className={"mb-1"}
              style={{
                marginRight: 5,
                height: 32,
              }}
              placeholder="Search"
              onChange={onHandleSearch}
            />
          </div>
        )}

        {search === null
          ? data?.map((item, index) => (
              <React.Fragment key={index}>
                {type === "milestone" && (
                  <LightTooltip
                    arrow
                    title={item?.title.length > 20 ? item?.title : ""}
                  >
                    <div key={item?._id}>
                      <li
                        onClick={() => {
                          onSelectFunction(item?._id);
                        }}
                        className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                          data.length - 1 === index ? "mb-1" : ""
                        } ${
                          isSelected?.includes(item?._id) ? css.activeTile : ""
                        }`}
                      >
                        <div className={css.textColumn}>
                          <Checkbox
                            checked={isSelected?.includes(item?._id)}
                            size="small"
                            sx={{
                              color: "#c8c8d0",
                              "&.Mui-checked": {
                                color: "",
                              },
                            }}
                          />
                          <p className="filter_title">
                            {capitalizeFirstLetter(
                              item.title.length > 20
                                ? item?.title.substring(0, 20) + "..."
                                : item?.title
                            )}
                          </p>
                        </div>
                      </li>
                    </div>
                  </LightTooltip>
                )}

                {type === "task" &&
                  item?.tasks?.map((task) => (
                    <LightTooltip
                      arrow
                      title={task?.title.length > 20 ? task?.title : ""}
                    >
                      <div key={task?._id}>
                        <li
                          onClick={() => {
                            onTaskSelect(task);
                          }}
                          className={`${css.tile}  ${index > 0 ? "mt-1" : ""} ${
                            data.length - 1 === index ? "mb-1" : ""
                          } ${
                            taskSelected?.filter(
                              (item) => item?._id === task?._id
                            ).length !== 0
                              ? css.activeTile
                              : ""
                          }`}
                        >
                          <div className={css.textColumn}>
                            {" "}
                            <Checkbox
                              checked={
                                taskSelected?.filter(
                                  (item) => item?._id === task?._id
                                ).length !== 0
                              }
                              size="small"
                              sx={{
                                color: "#c8c8d0",
                                "&.Mui-checked": {
                                  color: "",
                                },
                              }}
                            />
                            <p className="filter_title">
                              {task?.title.length > 20
                                ? task?.title.substring(0, 20) + "..."
                                : task?.title}
                            </p>
                          </div>
                        </li>
                      </div>
                    </LightTooltip>
                  ))}

                {type === "assignee" && (
                  <LightTooltip
                    arrow
                    title={item?.name.length > 20 ? item?.name : ""}
                  >
                    <div key={item?._id}>
                      <li
                        onClick={() => {
                          onSelectFunction(item?._id);
                        }}
                        className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                          data.length - 1 === index ? "mb-1" : ""
                        } ${
                          isSelected?.includes(item?._id) ? css.activeTile : ""
                        }`}
                      >
                        <div className={css.textColumn}>
                          <Checkbox
                            checked={isSelected?.includes(item?._id)}
                            size="small"
                            sx={{
                              color: "#c8c8d0",
                              "&.Mui-checked": {
                                color: "",
                              },
                            }}
                          />
                          <p
                            className="filter_title"
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            {item?.name.length > 20
                              ? item?.name.substring(0, 20) + "..."
                              : item?.name}
                          </p>
                        </div>
                      </li>
                    </div>
                  </LightTooltip>
                )}
                {type === "platforms" && (
                  <LightTooltip arrow title={item?.length > 20 ? item : ""}>
                    <div key={item}>
                      <li
                        onClick={() => {
                          singleSelection
                            ? onChange(item)
                            : onSelectFunction(
                                item === "Not Started"
                                  ? "NotStarted"
                                  : item === "Review Pending"
                                  ? "ReviewPending"
                                  : item
                              );
                        }}
                        className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                          data.length - 1 === index ? "mb-1" : ""
                        } ${
                          isSelected?.includes(
                            item === "Not Started"
                              ? "NotStarted"
                              : item === "Review Pending"
                              ? "ReviewPending"
                              : item
                          )
                            ? css.activeTile
                            : ""
                        }`}
                      >
                        <div className={css.textColumn}>
                          <Checkbox
                            checked={isSelected?.includes(
                              item === "Not Started"
                                ? "NotStarted"
                                : item === "Review Pending"
                                ? "ReviewPending"
                                : item
                            )}
                            size="small"
                            sx={{
                              color: "#c8c8d0",
                              "&.Mui-checked": {
                                color: "",
                              },
                            }}
                          />
                          <p className="filter_title">
                            {item?.length > 20
                              ? item?.substring(0, 20) + "..."
                              : item === "iOS"
                              ? "iOS"
                              : addSpaceUpperCase(item)}
                          </p>
                        </div>
                      </li>
                    </div>
                  </LightTooltip>
                )}
              </React.Fragment>
            ))
          : search?.map((item, index) => (
              <React.Fragment key={index}>
                {type === "milestone" && (
                  <LightTooltip
                    arrow
                    title={item?.title.length > 20 ? item?.title : ""}
                  >
                    <div key={item?._id}>
                      <li
                        onClick={() => {
                          onSelectFunction(item?._id);
                        }}
                        className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                          data.length - 1 === index ? "mb-1" : ""
                        } ${
                          isSelected?.includes(item?._id) ? css.activeTile : ""
                        }`}
                      >
                        <div className={css.textColumn}>
                          <Checkbox
                            checked={isSelected?.includes(item?._id)}
                            size="small"
                            sx={{
                              color: "#c8c8d0",
                              "&.Mui-checked": {
                                color: "",
                              },
                            }}
                          />
                          <p className="filter_title">
                            {capitalizeFirstLetter(
                              item.title.length > 20
                                ? item?.title.substring(0, 20) + "..."
                                : item?.title
                            )}
                          </p>
                        </div>
                      </li>
                    </div>
                  </LightTooltip>
                )}

                {type === "task" &&
                  item?.tasks?.map((task) => (
                    <LightTooltip
                      arrow
                      title={task?.title.length > 20 ? task?.title : ""}
                    >
                      <div key={task?._id}>
                        <li
                          onClick={() => {
                            onTaskSelect(task);
                          }}
                          className={`${css.tile}  ${index > 0 ? "mt-1" : ""} ${
                            data.length - 1 === index ? "mb-1" : ""
                          } ${
                            taskSelected?.filter(
                              (item) => item?._id === task?._id
                            ).length !== 0
                              ? css.activeTile
                              : ""
                          }`}
                        >
                          <div className={css.textColumn}>
                            {" "}
                            <Checkbox
                              checked={
                                taskSelected?.filter(
                                  (item) => item?._id === task?._id
                                ).length !== 0
                              }
                              size="small"
                              sx={{
                                color: "#c8c8d0",
                                "&.Mui-checked": {
                                  color: "",
                                },
                              }}
                            />
                            <p className="filter_title">
                              {task?.title.length > 20
                                ? task?.title.substring(0, 20) + "..."
                                : task?.title}
                            </p>
                          </div>
                        </li>
                      </div>
                    </LightTooltip>
                  ))}

                {type === "assignee" && (
                  <LightTooltip
                    arrow
                    title={item?.name.length > 20 ? item?.name : ""}
                  >
                    <div key={item?._id}>
                      <li
                        onClick={() => {
                          onSelectFunction(item?._id);
                        }}
                        className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                          data.length - 1 === index ? "mb-1" : ""
                        } ${
                          isSelected?.includes(item?._id) ? css.activeTile : ""
                        }`}
                      >
                        <div className={css.textColumn}>
                          <Checkbox
                            checked={isSelected?.includes(item?._id)}
                            size="small"
                            sx={{
                              color: "#c8c8d0",
                              "&.Mui-checked": {
                                color: "",
                              },
                            }}
                          />
                          <p
                            className="filter_title"
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            {item?.name.length > 20
                              ? item?.name.substring(0, 20) + "..."
                              : item?.name}
                          </p>
                        </div>
                      </li>
                    </div>
                  </LightTooltip>
                )}
                {type === "platforms" && (
                  <LightTooltip arrow title={item?.length > 20 ? item : ""}>
                    <div key={item}>
                      <li
                        onClick={() => {
                          singleSelection
                            ? onChange(item)
                            : onSelectFunction(
                                item === "Not Started"
                                  ? "NotStarted"
                                  : item === "Review Pending"
                                  ? "ReviewPending"
                                  : item
                              );
                        }}
                        className={`${css.tile}  ${index > 0 ? "mt-5px" : ""} ${
                          data.length - 1 === index ? "mb-1" : ""
                        } ${
                          isSelected?.includes(
                            item === "Not Started"
                              ? "NotStarted"
                              : item === "Review Pending"
                              ? "ReviewPending"
                              : item
                          )
                            ? css.activeTile
                            : ""
                        }`}
                      >
                        <div className={css.textColumn}>
                          <Checkbox
                            checked={isSelected?.includes(
                              item === "Not Started"
                                ? "NotStarted"
                                : item === "Review Pending"
                                ? "ReviewPending"
                                : item
                            )}
                            size="small"
                            sx={{
                              color: "#c8c8d0",
                              "&.Mui-checked": {
                                color: "",
                              },
                            }}
                          />
                          <p className="filter_title">
                            {item?.length > 20
                              ? item?.substring(0, 20) + "..."
                              : item === "iOS"
                              ? "iOS"
                              : addSpaceUpperCase(item)}
                          </p>
                        </div>
                      </li>
                    </div>
                  </LightTooltip>
                )}
              </React.Fragment>
            ))}
      </ul>
    </div>
  );
}
