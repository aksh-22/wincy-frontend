import EventIcon from '@mui/icons-material/Event';
import CustomAvatarGroup from 'components/customAvatarGroups_k/CustomAvatarGroup';
import Icon from 'components/icons/IosIcon';
import moment from 'moment';
import { memo, useState , useEffect , useMemo , useCallback} from 'react';
import './TaskKanban.css';
import styled from '@emotion/styled';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import AssigneeSelection from 'components/assigneeSelection/AssigneeSelection';
import { useProjectTeam } from 'hooks/useUserType';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateTask } from 'react-query/milestones/task/useUpdateTask';
import DueDateProgress from 'pages/projects/milestone/dueDateProgress/DueDateProgress';
import { getBackgroundColor } from '../../table-view/module-table-view/milestone-module/taskStatus/TaskStatus';
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import KanbanTaskAction from '../kanban-task/KanbanTaskAction';
import InputTextClickAway from 'components/clickawayComponent/InputTextClickAway';


let disbaleStyle={
  opacity:0.5,
  cursor:"default"
}

const getBackgroundColor_ = (isDragging, isGroupedOver, authorColors) => {
  if (isDragging) {
    // return 'var(--milestoneCard)';
    return "#41487A"
  } else {
    return "#41487A"
    // return 'var(--milestoneCard)';
  }

  // return 'grey';
};

const Container = styled.div`
  border-radius: 5px;
  border: 2px solid transparent;
  background-color: ${(props) =>
    getBackgroundColor_(props.isDragging, 'green', 'red')};

  box-sizing: border-box;
  padding: 8px;
  user-select: none;
`;

function getStyle(provided, style, snapshot , taskInfo) {
  // if (!snapshot.isDropAnimating) {
  // return  provided.draggableProps.style
  // }
  if (!style) {
    return provided.draggableProps.style;
  }
  // if (snapshot.isDropAnimating) {
  //   return {
  //     ...provided.draggableProps.style,
  //     ...style,
  //     transitionDuration: `0.001s`,
  //   };
  // }
  if (!snapshot?.isDropAnimating) {
    return {
      ...provided.draggableProps.style,
      ...style,
      opacity:taskInfo?.disabled ?  0.5 : 1,
      cursor: taskInfo?.disabled ? "default" : "pointer"
   
    };
  }
  return {
    ...provided.draggableProps.style,
    ...style,
    transitionDuration: `0.001s`,
    opacity:taskInfo?.disabled ?  0.5 : 1,
    cursor: taskInfo?.disabled ? "default" : "pointer"
  };
}

function TaskKanban({
  taskInfo,
  isDragging,
  isGroupedOver,
  provided,
  style,
  isClone,
  snapshot,
}) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );

  const userType = useSelector((state) => state.userReducer?.userType);

  const isSelected = useSelector(
    (state) => state.userReducer?.isTaskSelected
  );
  const dispatch = useDispatch();
  // const onSelectTask = () => {
  //   let tempIsSelected = [];
  //   let id = taskInfo?._id;
  //   if (isSelected?.includes(id)) {
  //     tempIsSelected = isSelected.filter((item) => item !== id);
  //   } else {
  //     tempIsSelected = [id, ...isSelected];
  //   }
  //   dispatch({
  //     type: "TASK_SELECT",
  //     payload: tempIsSelected,
  //   });
  // };

  // const [individualStatusUpdatePermission, setIndividualStatusUpdatePermission] = useState(false)

  const { platforms, team , actionDisabled} = useProjectTeam();
  
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

    const onAssigneeUpdate = useCallback(
      ({ teamData, teamIds }) => {
        let data = {
          assignees: teamIds,
          assigneeData: teamData,
          assigneeUpdate: true,
        };
        onUpdateCall(data);
      },
      [taskInfo]
    );

    // const onDueDateUpdate = useCallback(
    //   (dueDate) => {
    //     onUpdateCall({ dueDate });
    //   },
    //   [taskInfo]
    // );

    // const onPlatformUpdate = useCallback(
    //   (platforms) => {
    //     onUpdateCall({ platforms });
    //   },
    //   [taskInfo]
    // );

    // SideBar Code
    const [isToggle, setIsToggle] = useState(false);
//     const sideBarToggle = useCallback(() => {
//       setIsToggle(!isToggle);
//     }, [isToggle]);
// useEffect(() => {
//   if(taskInfo?.assignees){
//     let id_Found = taskInfo?.assignees?.find((item) => item?._id === userType?.userId )
//     if(id_Found){
//       setIndividualStatusUpdatePermission(true)
//     }

//   }
//   }, [])
  const teamList = useMemo(() => team, [team]);
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

  const [taskOpen, setTaskOpen] = useState(false)
      const handleTaskClose = (value) => {
        setTaskOpen(false);
      };
  return (
    <Container
      // isDragging={isDragging}
      // isGroupedOver={isGroupedOver}
      // isClone={isClone}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className='d_flex boxShadow'
      style={getStyle(provided, style, snapshot , taskInfo)}>
        <div 
        style={{
          height:"100%",
          width:4,
          background:getBackgroundColor({label : addSpaceUpperCase(taskInfo?.status)}),
          borderRadius:"5px 0px 0px 5px",
          marginRight:8
        }}
      />
      <div style={{
        width:"100%",
        paddingRight:10
      }}
      onClick={() => setTaskOpen(true)}
      >
        <InputTextClickAway 
        value={taskInfo?.title}
        className={"tasktitle"}
        textClassName={"pl-0"}
        height={"90%"}
        containerStyle={{
          paddingTop:5
        }}
        textArea
        onChange={onTitleUpdate}
        disabled

        />
      {/* <LightTooltip title={taskInfo?.title?.length > 60 ? taskInfo?.title : ''} arrow>
        <p className='tasktitle' style={{ paddingBottom: 5 , paddingTop:5, color: 'white' }}>
          {taskInfo?.title ?? 'N/A'}
        </p>
      </LightTooltip> */}
      <div className='alignCenter'>
     {taskInfo?.dueDate && <LightTooltip title="Due Date" arrow><div style={{position:"relative" }} className='alignCenter'>
      <EventIcon
            style={{ height: 15, width: 15, color: 'var(--red)', marginRight: 5 }}
          />
          <p style={{ fontSize: 12, color: 'var(--red)' }}>
            {taskInfo?.dueDate ? moment(taskInfo?.dueDate).format('DD MMM YY') : "N/A"}
          </p>
      </div></LightTooltip>}
{taskInfo?.description && <LightTooltip title="Description" arrow><div className='mx-1'>
<Icon name='menu' 
/>
</div>
</LightTooltip>}
{taskInfo?.platforms?.length >0  && <LightTooltip title="Platform" arrow>
  <div>
<Icon
            name='platforms'
            style={{ height: 12, width: 12 , margin : taskInfo?.description ? "0px 5px 0px 0px" : "0px 10px" }}
          />
</div></LightTooltip>}
      <div
      style={{
        marginLeft : taskInfo?.dueDate && !taskInfo?.platforms?.length ? 10 : 0,
        flex:1,
        position:"absolute",
        right:10,
        bottom:5
        // float:"right"
      }}
      >
      
      <AssigneeSelection
              assignee={taskInfo?.assignees}
              multiple
              team={teamList}
              onChange={onAssigneeUpdate}
              disabled={actionDisabled}
              taskInfo={taskInfo}
              // contentCenter
              // labelClassName="justifyContent_end"
              
            />
      
      </div>
        
      </div>
      </div>
      {/* <div
        className='d_flex alignCenter'
        style={{ justifyContent: 'space-between', alignSelf: 'flex-end' }}>
        <div className='d_flex alignCenter'>
          <EventIcon
            style={{ height: 15, width: 15, color: 'pink', marginRight: 5 }}
          />
          <p style={{ fontSize: 12, color: 'pink' }}>
            {taskInfo?.dueDate ? moment(taskInfo?.dueDate).format('DD MMM YY') : "N/A"}
          </p>
          <Icon name='menu' style={{ height: 12, width: 12, marginLeft: 15 }} />
          <Icon
            name='platforms'
            style={{ height: 12, width: 12, marginLeft: 15 }}
          />
        </div>
        <AssigneeSelection 
        assignee={taskInfo?.assignees}
        multiple
        team={teamList}
        onChange={onAssigneeUpdate}
        disabled={actionDisabled}
        contentCenter
        // style={{ height: 30, width: 30 }}

        />
        
      </div> */}
      <KanbanTaskAction open={taskOpen} handleClose={handleTaskClose} taskInfo={taskInfo} />
    </Container>
  );
}

export default memo(TaskKanban);
