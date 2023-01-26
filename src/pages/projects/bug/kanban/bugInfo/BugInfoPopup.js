import React, { useCallback, useEffect, useState } from "react";
import { capitalizeFirstLetter } from "utils/textTruncate";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import "./BugInfoPopup.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { LightTooltip } from "components/tooltip/LightTooltip";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import IosIcon from "components/icons/IosIcon";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import { useProjectTeam } from "hooks/useUserType";
import CustomMenu from "components/CustomMenu";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import SLR_Wrapper from "components/SLR_wrapper/SLR_Wrapper";
import BugActivityPopup from "./BugActivityPopup";
import BugCommentPopup from "./BugCommentPopup";
import { useSelector } from "react-redux";
import AssigneesUpdate from "components/bottomActionBar/taskUpdate/AssigneesUpdate";
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import { getBugStatusFunction, priorityArray } from "utils/status";
import { useBugInfo } from "react-query/bugs/useBugInfo";
import CommonDelete from "components/CommonDelete";
import { previousDateFunction } from "../../../../../utils/status";
import CustomAttachment from "components/customAttachment/CustomAttachment";
import { useUpdateBug } from "react-query/bugs/useUpdateBug";
import { useUpdateBugAttachment } from "react-query/bugs/useUpdateBugAttachment";
import Loading from "components/loading/Loading";
function BugInfoPopup({ handleClose, propData:info , fromModule }) {
  const { team , orgId , projectId , bugsPlatforms } = useProjectTeam();
  console.log("bugsPlatforms" , bugsPlatforms)
  const userType = useSelector((state) => state.userReducer?.userType);
  // const [info, setInfo] = useState(propData);
  const { mutateUpdateBug } = useUpdateBug(
    orgId,
    projectId,
    info?.platform,
    1,
  );
  const { mutateUpdateBugAttachment, isLoadingUpdateBugAttachment } =
  useUpdateBugAttachment(
    orgId,
    projectId,
    info?.platform,
    1,
    info?._id,
    fromModule
  );

const [assigneeIds, setAssigneeIds] = useState([]);
  useEffect(() => {
    info?.assignees && setAssigneeIds(info?.assignees?.map((item) => item?._id))
  }, [info]);
  
const [removeLoading, setRemoveLoading] = useState(false);
const removeLoadingToggle = () =>{
  setRemoveLoading(false)
}
  const onSubmit_complete = ({attachments , removeAttachment , callback}) => {
    
    let add = new FormData();
    // let remove = new FormData();
    let newDataFound = attachments?.find((item) => item?.name !== undefined)
    if (attachments?.length) {

      newDataFound &&  attachments.map((file, i) => {
        file.name &&  add.append("attachments", file, file.name);
        return null;
      });
    }
    let obj = {};
    if (removeAttachment?.length) {
      !callback &&   setRemoveLoading(true)
      obj = {
        attachments: removeAttachment,
      };
    }

    newDataFound &&
      mutateUpdateBugAttachment({
        data: add,
        orgId: orgId,
        bugId: info?._id,
        remove: false,
        fromModule,
        emptyLocalAttachment:callback??removeLoadingToggle,
      });

    removeAttachment?.length &&
      mutateUpdateBugAttachment({
        data: obj,
        orgId: orgId,
        bugId: info?._id,
        remove: true,
        fromModule,
        emptyLocalAttachment:callback??removeLoadingToggle,
      });
  }

  

  const onBugUpdate = ({menuName  , value}) => {
    console.log("menuName" , menuName)
    let obj = {
      [menuName === "bugStatus" ? "status" : menuName]: value,
    }

    if(menuName === "platform"){
      obj = {
        [menuName === "bugStatus" ? "status" : menuName]: value,
        section: "",
      }
  
    }
mutateUpdateBug({
  data: obj,
  orgId: orgId,
  bugId: info?._id,
});
}
  



  const handleAssigneeUpdate = useCallback(
    ({ teamIds, teamData, handleClose }) => {
      mutateUpdateBug({
        orgId: orgId,
        bugId: info?._id,
        data: {
          assignees: teamIds ?? [],
        },
        additionalInfo: {
          assignees: teamData,
        },
        popUpClose : handleClose,
      });

  
  }, []);
  

  return (
    <div className="bugInfoPopup">
 {removeLoading &&     <div 
      style={{
        background:"rgba(0,0,0,0.6)",
        position:"absolute",
        height : "98%",
        width:"98%",
        right:"1%",
        top:"1%",
        zIndex:9999,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column"

      }}
      ><Loading />
   <p className="my-4">Delete in Progress</p>
         </div>}
      <div className="alignCenter mb-4">
        <div className="d_flex flex">
          <SubtitlesIcon style={{ color: "#8a9aff" , marginTop:5}} />{" "}
        <div className="flex">
        <InputTextClickAway
            value={capitalizeFirstLetter(info?.title)}
            textClassName={"bugInfoPopup_title"}
            containerStyle={{
              paddingTop: 5,
            }}
            inputClassName={"mx-1"}
            onChange={(value)=>onBugUpdate({menuName : "title"  , value})}
          />
          <p className="pl-1" style={{
            fontSize:13
          }}>in list {info?.platform} <span>{previousDateFunction(info?.createdAt)}</span></p>
        </div>
        </div>

        <LightTooltip title="Esc" arrow placement="right">
          <span className="cursorPointer" onClick={handleClose}>
            <CloseRoundedIcon />
          </span>
        </LightTooltip>
      </div>

      <div className="d_flex">
        <div style={{ flex: 0.8 , paddingRight:10 }}>
          <div className="d_flex mb-4">
            <div className=" mr-2">
              <div className="alignCenter mb-1">
                {/* <IosIcon
                  name={"user"}
                  style={{
                    fill: "#8a9aff",
                    height: 30,
                    width: 30,
                  }}
                />{" "} */}
                <p>Assignee(s)</p>
              </div>
         <div style={{
             minWidth:100,
             height:40
         }}>
         <AssigneeSelection
         style={{
           height:40,
           width:40
         }}
                widthAuto
                team={team}
                assignee={info?.assignees ?? []}
                //   onChange={handleAssigneeUpdate}
                otherId={info?._id}
                //   disabled={checkUserAuth(row, userId, userType)}
                multiple
                needOneMember={true}
                disabled
              />
         </div>
            </div>

            <div>
              <div className="alignCenter mb-1">
                {/* <IosIcon
                  name={"user"}
                  style={{
                    fill: "#8a9aff",
                    height: 30,
                    width: 30,
                  }}
                />{" "} */}
                <p>Status</p>
              </div>

              <div className="bugInfoPopup_statusColor">
                <CustomMenu
                  menuItems={getBugStatusFunction(info?.status)}
                  id={info?._id}
                  mutate={info?.mutate}
                  menuName="bugStatus"
                  // handleMenuClick={handleTesterStatus(info._id)}
                  // name={currentlyEditingMenu}
                  activeMenuItem={addSpaceUpperCase(info?.status)}
                  // disabled={checkUserAuth(info, userId, userType)}
                  handleMenuClick={() => {}}
                  disabled
                  style={{
                    borderRadius:4
                  }}
                />
              </div>
            </div>

            <div>
              <div className="alignCenter mb-1">
                {/* <IosIcon
                  name={"user"}
                  style={{
                    fill: "#8a9aff",
                    height: 30,
                    width: 30,
                  }}
                />{" "} */}
                <p>Priority</p>
              </div>

              <div className="bugInfoPopup_statusColor">
                <CustomMenu
                 menuItems={priorityArray}
                  id={info?._id}
                  mutate={info?.mutate}
                  menuName="priority"
                  
                  handleMenuClick={() => {}}
                  disabled
                  style={{
                    borderRadius:4
                  }}
                  // name={currentlyEditingMenu}
                  activeMenuItem={addSpaceUpperCase(info?.priority)}
                  // disabled={checkUserAuth(info, userId, userType)}
                />
              </div>
            </div>
          </div>
          

          <div className="mb-4">
          <div className="alignCenter mb-1">
            <IosIcon
              name="menu"
              style={{
                marginRight: 10,
                height:"1rem",
                width:"1rem",
              }}
            />
            <p>Description</p>
          </div>



          <div style={{
            background:"#091e4285",
padding:10,
borderRadius:4
          }}>
            <CustomTextEditor
           value={info?.description}
            />
          </div>    
          </div>


          
{
  info?.attachments?.length > 0 && <div className="mb-4">
  <div className="alignCenter mb-1">
  <AttachFileRoundedIcon style={{
    marginLeft:-10,
    color: "#8a9aff"
  }}/>    <p>Attachments &nbsp;</p>
  
  <span>({info?.attachments?.length})</span>
  </div>
  
  <SLR_Wrapper showDownloadButton={false}>
  
  <div className="d_flex">
      {info?.attachments?.map((item , index) => (
          <div key={index} className="d_flex mr-1" style={{position:"relative"}}>
              <img src={item} alt="no_image" className="bugInfoPopup_attachment"/>
              <LightTooltip title="Remove" arrow>
              <span style={{
                  position:"absolute",
                  right:5,
                  cursor:"pointer"
              }}
              onClick={() => onSubmit_complete({
                removeAttachment : [item]
              })}
              >
                  <CloseRoundedIcon style={{
                      color:"#8a9aff",
                      // fontSize : 14
                  }}/>
              </span>
              </LightTooltip>
              </div>
      ))}
  </div>
  </SLR_Wrapper>
  
  </div>
}

<BugCommentPopup orgId={orgId} 
userType={userType}
comments={info?.comments}
mutateBugComment={mutateUpdateBug}
bugId={info?._id}
/>

<BugActivityPopup 
orgId={orgId}
bugId={info?._id}

/>



        </div>
        <div style={{ flex: 0.2 }}>
          <p className="mb-1">Action</p>

          <AssigneesUpdate
            assigneeIds={assigneeIds??[]}
            onAssigneeUpdate={handleAssigneeUpdate}
            taskId={info?._id}
            className="bugInfoPopup_actionButton"
             actionButton={ 
              <div className="alignCenter">
                <IosIcon name="user" 
                style={{
                  height : 20,
                  width:20,
                  fill : "#FFF",
                  marginRight:10
                }}
                />
            <p>Assignee</p>
          </div>
              } />
          

          <CustomMenu
            activeMenuItem={info?.status}
            disabled={false}
            className="bugInfoPopup_actionButton"
            menuItems={getBugStatusFunction(info?.status)}
            handleMenuClick={onBugUpdate}
            actionButton={      <div className=" alignCenter">
            <PlaylistAddCheckRoundedIcon style={{
              fontSize:18,
              marginRight:10
              }}/>
            <p>Change Status To</p>
          </div>}
          />


<CustomMenu
            activeMenuItem={info?.status}
            disabled={false}
            className="bugInfoPopup_actionButton"
            menuItems={priorityArray}
            handleMenuClick={onBugUpdate}
            
            actionButton={         <div className=" alignCenter">
            <IosIcon name="menu" style={{   height : 16,
                    width:16,
                    fill : "#FFF",
                    marginRight:10 }} />
              <p>Priority</p>
            </div>}
          />

       <CustomAttachment 
       onSubmit ={onSubmit_complete}
       mutate={mutateUpdateBugAttachment}
       isLoading={isLoadingUpdateBugAttachment}
       actionButton={ <div className="bugInfoPopup_actionButton alignCenter">
       <AttachFileRoundedIcon style={{
         fontSize:18,
         marginRight:10
         }}/>
       <p>Attachment</p>
     </div>}
     attachment={info?.attachments}
       />


         

          <div className="bugInfoPopup_actionButton alignCenter">
            <WysiwygIcon  style={{
              fontSize:18,
              marginRight:10
              }}/>
            <p>Section</p>
          </div>

          <CommonDelete 
              // mutate={deleteTaskMutate }
              //  data={mutateData}
          actionButton={
            <div className="bugInfoPopup_actionButton alignCenter cursorPointer">
            <IosIcon name="trash" style={{
              marginRight:10,
              width:16
            }} />
            
            <p style={{marginTop:2}}>Delete Task</p>
          </div> 
          }
          />
          <CustomMenu
            activeMenuItem={info?.status}
            disabled={false}
            className="bugInfoPopup_actionButton"
            menuItems={bugsPlatforms}
            handleMenuClick={onBugUpdate}

            actionButton={         <div className=" alignCenter">
              <IosIcon name="platform_view" style={{   height : 16,
                  width:16,
                  fill : "#FFF",
                  marginRight:5 }} />
            <p>Change Platform</p>
            </div>}
                      menuName="platformss"

          />
          {/* <div className="bugInfoPopup_actionButton alignCenter">
          <IosIcon name="platform_view" style={{   height : 16,
                  width:16,
                  fill : "#FFF",
                  marginRight:5 }} />
            <p>Change Platform</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default BugInfoPopup;
