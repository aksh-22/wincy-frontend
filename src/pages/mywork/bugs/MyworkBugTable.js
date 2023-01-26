import React, { useState, useEffect } from "react";
import "./scss/BugTable.scss";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { IconButton, Slide } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BugTableData from "./MyworkBugTableData";
import CustomizedTabs from "components/CustomTabBar";
import Zoom from "@material-ui/core/Zoom";
import Collapse from "@material-ui/core/Collapse";
import { useMyworkBugs } from "react-query/mywork/useMyworkBugs";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import BugInfoSidebar from "pages/projects/bug/BugInfoSidebar";
import { useProjectInfo } from "react-query/projects/useProjectInfo";
import ColoredScrollbars from "ColoredScrollbar";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import { isSameWeek } from "date-fns";
import { useMyworkDeleteBugs } from "react-query/mywork/useMyworkDeleteBugs";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import MyWorkBugContainer from "./MyWorkBugContainer";

function MyworkBugTable({ orgId, projectInfo, filter }) {
  console.log({ projectInfo });
  const [value, setValue] = React.useState(2);
  const [showTableBody, setShowTableBody] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [checkedBug, setCheckedBug] = useState([]);
  const [platform, setPlatform] = useState("");

  const { isLoading: isLoadingProjectInfo, data: projectInfoData } =
    useProjectInfo(showTableBody && projectInfo._id);

  // console.log("MyworkBugTable 2 filter:", filter);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { mutateDeleteBug, isDeleteBugLoading } = useMyworkDeleteBugs();

  const [tabBarArr, setTabBarArr] = useState([]);

  const [isSelected, setIsSelected] = useState([]);

  useEffect(() => {
    // let team = [];
    // if (projectInfoData) {
    //   if (
    //     projectInfoData?.project?.projectHead &&
    //     projectInfoData?.project?.projectHead !== "" &&
    //     Object.keys(projectInfoData?.project?.projectHead).length !== 0
    //   ) {
    //     team.push({
    //       ...projectInfoData?.project?.projectHead,
    //       projectHead: true,
    //     });
    //   }
    //   team = [
    //     ...team,
    //     ...(projectInfoData?.project?.team
    //       ? projectInfoData?.project?.team
    //       : []),
    //   ];
    // }
    // let tabBarArray = [];

    let localPlatform = [...projectInfo?.platforms , null];
    // projectInfo?.platforms?.map((row, i) => {
      // platform.push()
    //   tabBarArray.push({
    //     title: row,
    //     component: (
    //       <BugTableData
    //         // platform={{ name: row, id: row, pageNo: 1 }}
    //         platform={row}
    //         projectInfo={projectInfoData}
    //         projectId={projectInfo._id}
    //         orgId={orgId}
    //         checkedBug={checkedBug}
    //         handleCheckedBug={(id) => handleCheckedBug(id)}
    //         setPlatform={setPlatform}
    //         filter={filter}
    //         team={team}
    //         // key={row}
    //       />
    //     ),
    //   });
    // });

    // tabBarArray.push({
    //   title: "Uncategorized",
    //   component: (
    //     <BugTableData
    //       // key="Uncategorized"
    //       platform={{ name: "Uncategorized", id: "Uncategorized", pageNo: 1 }}
    //       platform="null"
    //       projectInfo={projectInfoData}
    //       projectId={projectInfo._id}
    //       orgId={orgId}
    //       checkedBug={checkedBug}
    //       handleCheckedBug={(id) => handleCheckedBug(id)}
    //       setPlatform={setPlatform}
    //       filter={filter}
    //       team={team}
    //     />
    //   ),
    // });
    // setTabBarArr(tabBarArray);
    setPlatforms([...localPlatform])
  }, [projectInfoData, checkedBug, filter]);
const [platforms, setPlatforms] = useState([])

  // const handleCheckedBug = (id) => {
  //   if (checkedBug.includes(id)) {
  //     setCheckedBug([...checkedBug].filter((item) => item !== id));
  //   } else {
  //     setCheckedBug((prev) => [...prev, id]);
  //   }
  // };

  return (
    <>
      <div className="bugs_table">
        <div className="my_table">
          <div
            className="my_table_head"
            style={{ cursor: "pointer" }}
            onClick={() => setShowTableBody((prev) => !prev)}
          >
            <div className="position-relative">
              <IconButton
                className="position-absolute"
                // onClick={() => setShowTableBody((prev) => !prev)}
              >
                <ArrowRightIcon
                  style={{
                    color: "var(--defaultWhite)",
                    transform: showTableBody ? "rotate(90deg)" : "",
                    transition: "transform .3s",
                  }}
                />
              </IconButton>
            </div>
            <div
              className="my_table_head_col"
              style={{
                textAlign: "left",
                paddingLeft: "1.2rem",
              }}
            >
              {projectInfo?.title}
            </div>
            <div></div>
            <div className="my_table_head_col">Priority</div>
            <div className="my_table_head_col">Tester Status</div>
            <div className="my_table_head_col">Developer Status</div>
          </div>
          {showTableBody && (
     <MyWorkBugContainer
     projectInfo={projectInfo}
     orgId={orgId}
     projectInfoData={projectInfoData}
     filter={filter}
     platforms={platforms}
     />
          ) }
        </div>
      </div>

      {/* <BottomActionBar
        isSelected={checkedBug}
        onClose={() => setCheckedBug([])}
        data={{
          orgId: orgId,
          // projectId: "34534534535345",
          projectId: projectInfo._id,
          data: {
            bugs: checkedBug,
          },
          platform: platform,
          onToggle: () => {
            setCheckedBug([]);
          },
        }}
        mutate={mutateDeleteBug}
        onDelete
      /> */}
    </>
  );
}

export default MyworkBugTable;
// bugsData
