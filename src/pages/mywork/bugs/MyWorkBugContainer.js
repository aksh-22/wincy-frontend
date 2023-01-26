import React , {useState , useEffect}from "react";
import { Slide } from "@material-ui/core";
import CustomizedTabs from "components/CustomTabBar";
import { useMyworkBugs } from "react-query/mywork/useMyworkBugs";
import BugTableData from "./MyworkBugTableData";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import { useMyworkDeleteBugs } from "react-query/mywork/useMyworkDeleteBugs";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";

function MyWorkBugContainer({ platforms, projectInfo, orgId , projectInfoData , filter }) {
  const { isBugsLoading, bugsData, statusBugs } = useMyworkBugs(
    orgId,
    projectInfo?._id
  );
  
  const { mutateDeleteBug, isDeleteBugLoading } = useMyworkDeleteBugs( orgId,
    projectInfo?._id);

  const [platform, setPlatform] = useState("");
  const [tabBarArr, setTabBarArr] = useState([]);
  const [checkedBug, setCheckedBug] = useState([]);
  const handleCheckedBug = (id) => {
    if (checkedBug.includes(id)) {
      setCheckedBug([...checkedBug].filter((item) => item !== id));
    } else {
      setCheckedBug((prev) => [...prev, id]);
    }
  };



  useEffect(() => {
    let team = [];
    if (projectInfoData) {
      if (
        projectInfoData?.project?.projectHead &&
        projectInfoData?.project?.projectHead !== "" &&
        Object.keys(projectInfoData?.project?.projectHead).length !== 0
      ) {
        team.push({
          ...projectInfoData?.project?.projectHead,
          projectHead: true,
        });
      }
      team = [
        ...team,
        ...(projectInfoData?.project?.team
          ? projectInfoData?.project?.team
          : []),
      ];
    }

      let newObj = {}
      bugsData?.forEach(element => {
        newObj[element?._id] = element?._id
      });


      let tabBarArray = [];

      platforms.map((row, i) => { 
          if(newObj?.[row] || newObj.null === null){
              console.log("row" , row)
            tabBarArray.push({
                title: row??"Uncategorized",
                bugsData:bugsData,
                component: (
                  <BugTableData
                    // platform={{ name: row, id: row, pageNo: 1 }}
                    platform={row??{ name: "Uncategorized", id: "Uncategorized", pageNo: 1 }}
                    projectInfo={projectInfoData}
                    projectId={projectInfo._id}
                    orgId={orgId}
                    checkedBug={checkedBug}
                    handleCheckedBug={(id) => handleCheckedBug(id)}
                    setPlatform={setPlatform}
                    filter={filter}
                    team={team}
                    bugsData={bugsData}
                    data={bugsData?.filter((item) => item?._id === newObj?.[row] )}
                    // key={row}
                  />
                ),
              
            });
          }else{
            console.log("dont" ,  projectInfo?.platforms)
          }
      })
      setTabBarArr(tabBarArray);
      console.log({newObj} , {bugsData})
      console.log("parent")
  }, [projectInfoData, checkedBug, filter , bugsData])
  const [current, setCurrent] = useState("")
console.log("Rerender" , tabBarArr)
  return (
    <div>
      {isBugsLoading ? (
      <TableRowSkeleton count={5} />
      ) : (
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          {/* <ColoredScrollbars> */}
          
          <div
            className="my_table_body"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
           {tabBarArr.length > 0 && <CustomizedTabs tabBarData={tabBarArr} />}
          </div>
          {/* </ColoredScrollbars> */}
        </Slide>
      )}





         <BottomActionBar
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
        isLoading={isDeleteBugLoading}
      />

    </div>
  );
}

export default MyWorkBugContainer;
