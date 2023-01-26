import React , {useState , useEffect , useMemo , useCallback , useRef} from "react";
import "./Kanban.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import IosIcon from "components/icons/IosIcon";
import CustomMenu from "components/CustomMenu";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import Todo from "pages/projects/milestone/todo/Todo";
import moment from "moment";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import AssigneesUpdate from "components/bottomActionBar/taskUpdate/AssigneesUpdate";
import ModuleMoveTo from "components/bottomActionBar/moveTo/ModuleMoveTo";
import MoveToAction from "components/bottomActionBar/moveTo/MoveToAction";
import TaskStatus, { getBackgroundColor } from "../../table-view/module-table-view/milestone-module/taskStatus/TaskStatus";
import { useProjectTeam } from "hooks/useUserType";
import { useSelector } from "react-redux";
import DueDateProgress from "pages/projects/milestone/dueDateProgress/DueDateProgress";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import { useTodo } from "react-query/todo/useTodo";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { useUpdateTask } from "react-query/milestones/task/useUpdateTask";
import { LightTooltip } from "components/tooltip/LightTooltip";
import CommonDelete from "components/CommonDelete";
import { useDeleteTask } from "react-query/milestones/task/useDeleteTask";
function KanbanTaskView({handleClose , taskInfo}) {
  const {orgId ,  milestoneId , team , actionDisabled , projectId , platforms} = useProjectTeam()
  const {deleteTaskMutate} = useDeleteTask()
  const mutateData = useMemo(() => {
    let taskMutateData = {
      data: {
        tasks: [taskInfo?._id],
      },
      projectId,
      orgId,
      milestoneId,
      onToggle:handleClose
    };
    return taskMutateData;
  }, [ projectId, orgId, milestoneId , taskInfo?._id , handleClose]);
  const textEditorRef = useRef();
      const [individualStatusUpdatePermission, setIndividualStatusUpdatePermission] = useState(false)
      const userType = useSelector((state) => state.userReducer?.userType);
      useEffect(() => {
        if(taskInfo?.assignees){
          let id_Found = taskInfo?.assignees?.find((item) => item?._id === userType?.userId )
          if(id_Found){
            setIndividualStatusUpdatePermission(true)
          }
    
        }
        }, [])
        const teamList = useMemo(() => team, [team]);
        const { newData: todoData, isLoading: toDoLoading } = useTodo(
          orgId,
          projectId,
          taskInfo?._id,
          taskInfo?.assignees,
           milestoneId
        );

        const platformsList = useMemo(
          () =>
            platforms?.map((row) => {
              return {
                label: row,
                value: row,
              };
            }),
          [platforms]
        );
           // Update Task Function
    const { mutate } = useUpdateTask();
    const onUpdateCall = (data) => {
      let obj = {
        data: data,
        milestoneId: taskInfo?.milestone,
        projectId: taskInfo?.project,
        orgId: orgId,
        taskId: taskInfo?._id,
        moduleId: taskInfo?.module,
      };
      mutate(obj);
    };

      const onTitleUpdate = useCallback(
      (title) => {
        onUpdateCall({ title });
      },
      [taskInfo]
    );

    const onDescriptionUpdate = useCallback(
      (description) => {
        onUpdateCall({ description });
      },
      [taskInfo]
    );

    const onDueDateUpdate = useCallback(
      (dueDate) => {
        onUpdateCall({ dueDate });
      },
      [taskInfo]
    );

    const onPlatformUpdate = useCallback(
      (platforms) => {
        onUpdateCall({ platforms });
      },
      [taskInfo]
    );

    const onAssigneeUpdate = useCallback(
      ({ teamData, teamIds , handleClose }) => {
        let data = {
          assignees: teamIds,
          assigneeData: teamData,
          assigneeUpdate: true,
        };
        onUpdateCall(data);
        handleClose()
      },
      [taskInfo]
    );


    let assigneeIds = useMemo(() => {
      return taskInfo?.assignees?.map((item) => item?._id)
    }, [taskInfo])

// console.log("taskInfo" , taskInfo)
  return <div>
    <div className="headerSec">
    <InputTextClickAway
                  value={taskInfo?.title}
                  type="text"
                  onChange={onTitleUpdate}
                  disabled={actionDisabled || taskInfo?.disabled ? true : false}
                  className="textEllipse"
                  containerStyle={{
                    width:0,
                    fontSize:36,
                    fontWeight:500
                  }}
                  style={{
                    fontSize:24,
                    fontWeight:500,
                    height:50,
                    borderRadius:4
                  }}
                  inputClassName="inputClassName mr-1"
                  textClassName={"textEllipse pl-0"}
                  placeholder="Enter task title"
                />
        <span className="cursorPointer" onClick={handleClose}>
          <CloseRoundedIcon style={{
            fontSize:33,
            color:"#fff"
          }}/>
        </span>
    </div>
    <div className="bodyContent d-flex mt-3">
        <div className="leftContent">
          <div className="discription">
            <div className="textIcn">
              <IosIcon name="menu" style={{
                marginRight:10
              }}/>
              <h3>Description</h3>
            </div>
            <CustomTextEditor 
            value={taskInfo?.description}
            updateData={onDescriptionUpdate}
            disable={actionDisabled}
            ref={textEditorRef}
            />
            {/* <p>{taskInfo?.description??"N/A"}</p> */}
            <div className="textIcn mt-3">
              <IosIcon name="menu" style={{
                marginRight:10
              }}/>
              <h3>Basic Information</h3>
            </div>
            <table className="table table-bordered mt-2">
              <tbody>
                <tr>
                  <td>Deadline</td>
                  <td style={{
                    opacity : taskInfo?.dueDate ? 1 :0.5
                  }}>
                {taskInfo?.dueDate ? <DueDateProgress
              // onChange={onDueDateUpdate}
              dueDate={taskInfo?.dueDate}
              status={taskInfo?.status}
              disabled={true}
              removeButton
      innerContainerClassName="justifyContent_start"

            /> : "N/A"}
            </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td style={{
                    color:getBackgroundColor({label : addSpaceUpperCase(taskInfo?.status)})
                  }}>{addSpaceUpperCase(taskInfo?.status)}</td>
                </tr>
                <tr className="tblePlateform">
                  <td style={{
                    width:200
                  }} >Platform(s)</td>
                  <td
                   style={{
                    opacity : taskInfo?.platforms?.length > 0 ? 1 :0.5
                  }}
                  >
                { taskInfo?.platforms?.length > 0 ?  <CustomMenu
            activeMenuItem={taskInfo?.platforms}
            disabled={true}
            // className="borderRight"
            menuItems={[]}
            handleMenuClick={() =>{}}
            multiple
          /> : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>Assignee

                  </td>
                  <td
                  style={{
                    opacity : taskInfo?.assignees?.length > 0 ? 1 :0.5
                  }}
                  >
              {taskInfo?.assignees?.length > 0 ? <AssigneeSelection
              assignee={taskInfo?.assignees}
              multiple
              team={teamList}
              // onChange={onAssigneeUpdate}
              disabled={true}
              // contentCenter
              taskInfo={taskInfo}
            /> : "N/A"}
                  </td>
                </tr>

                {taskInfo?.status === "OnHold" && taskInfo?.onHoldReason && <tr>
                  <td>On Hold Reason</td>
                  <td>{taskInfo?.onHoldReason}</td>
                </tr>}
              </tbody>
            </table>
            {/* <Todo/> */}
            {toDoLoading ? (
          <TableRowSkeleton count={5} />
        ) : (
          todoData?.map((item, index) => (
            <Todo data={item} key={index} /> )))
            }
          </div>
        </div>
        <div className="rightContent">
            <div className="textIcn">
              <h3>Actions</h3>
            </div>
            <div className="actionList mt-2">
             {!actionDisabled && <MoveToAction
              moveId={taskInfo?._id}
              milestoneId={milestoneId}
              actionButton={
                <div className=" cursorPointer listItem">
                <IosIcon name="share" style={{
                marginRight:15,
                }}/>
                <h4>Move</h4>
              </div>
              }
              />}
             
            
                 <TaskStatus info={taskInfo} className="borderRight" orgId={orgId} disabled={individualStatusUpdatePermission ? false : actionDisabled} 
          taskStatusPermission = {actionDisabled}
          individualStatusUpdatePermission={individualStatusUpdatePermission}
          actionButton={ <div className="listItem cursorPointer">
          <FolderOpenRoundedIcon name="share" style={{
          marginRight:15,
          }}/>
          <h4>Status</h4>
        </div>}
          />
               {/* <TaskStatus 
               actionButton={ <div className="listItem cursorPointer">
               <FolderOpenRoundedIcon name="share" style={{
               marginRight:15,
               }}/>
               <h4>Status</h4>
             </div>}
               /> */}
            </div>
            {/* <div className="textIcn mt-4">
              <h3>Add To Card</h3>
            </div> */}
                 

           {!actionDisabled && <div className="actionList">
            <AssigneesUpdate
            assigneeIds={assigneeIds??[]}
            onAssigneeUpdate={onAssigneeUpdate}
            taskId={taskInfo?._id}
            className="listItem" actionButton={ <div className="alignCenter cursorPointer">
                  <PeopleAltOutlinedIcon name="share" style={{
                  marginRight:15,
                  }}/>
                  <h4>Assignee</h4>
                
                </div> } />
                
                <CustomDatePicker
      // minDate={new Date()}
      onChange={onDueDateUpdate}
      defaultValue={taskInfo?.dueDate}
      disabled={actionDisabled}
      innerContainerStyle="justifyContent_start"
    >
           <div className="listItem cursorPointer flex dueDateComponent">
                  <DateRangeOutlinedIcon name="share" style={{
                  marginRight:15,
                  }}/>  
                  <h4 className="flex">Deadline</h4>

                  {taskInfo?.dueDate && <LightTooltip title='Remove Due Date' arrow>
                      <div  className="dueDateComponent_showDate"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDueDateUpdate("")
                      }}
                      >
                        <CloseRoundedIcon />
                      </div>
                  </LightTooltip>}
                </div>
      </CustomDatePicker>
            
      <CustomMenu
            activeMenuItem={taskInfo?.platforms}
            disabled={actionDisabled}
            className="borderRight"
            menuItems={platformsList}
            handleMenuClick={onPlatformUpdate}
            multiple
            actionButton={  <div className="listItem cursorPointer">
            <IosIcon name="platform" style={{
              fill :"#b5b5b5",
              marginRight:15,
            }} />
            
            <h4>Platform(s)</h4>
          </div>}
          />
          <CommonDelete 
              mutate={deleteTaskMutate }
               data={mutateData}
          actionButton={
            <div className="listItem cursorPointer">
            <IosIcon name="trash" style={{
              fill :"#b5b5b5",
              marginRight:15,
              width:16
            }} />
            
            <h4 style={{marginTop:2}}>Delete Task</h4>
          </div> 
          }
          />
         
            </div>}

          
        </div>
      </div>
  </div>;
}

export default KanbanTaskView;
