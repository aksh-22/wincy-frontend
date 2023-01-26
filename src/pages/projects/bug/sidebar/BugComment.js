import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import emptyChat from "assets/lottie/emptyChat.json";
import Image from "components/defaultImage/Image";
import NoData from "components/NoData";
import bugModal from "css/BugModal.module.css";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useUpdateBug } from "react-query/bugs/useUpdateBug";
import { useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { useProjectTeam } from 'hooks/useUserType';
import { useQueryClient } from "react-query";

function BugComment({
  comments,
  orgId,
  projectId,
  platform,
  bug,
  taskMutate,
  fromModule,
  taskId
}) {
  const {actionDisabled} = useProjectTeam()
  const [focused, setFocused] = React.useState(false);
  const [input, setInput] = useState(null);
  const [bugComment, setBugComment] = useState([]);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const { mutateUpdateBug } = useUpdateBug(
    orgId,
    projectId,
    platform,
    1,
    setInput
  ); const queryClient = useQueryClient();
  const orgTeam = queryClient?.getQueryData(["organisationUsers", orgId]);

  const userId = useSelector((state) => state.userReducer.userData.user._id);

  const handleSubmit = () => {
    let sendData = {
      data: {
        comment: input,
      },
      additionalInfo: {
        createdBy: userId,
        createdAt: new Date().toUTCString(),
        text: input,
        _id: `localData${Math.random()}`,
      },
      orgId: orgId,
      bugId: bug?._id,
      taskId,
      setInput: setInput,
    };
    if (!input) {
      return null
    }

    if(fromModule === "taskBug"){
      taskMutate(sendData)
      return
    }


    mutateUpdateBug(sendData);
    setInput("");

  };

  useEffect(() => {
    
    setBugComment(comments);
  }, [comments?.length]);

  const getUserDetails = (id) => {
    // let user = team?.filter((item) => item?._id === id);
    let user = orgTeam?.users?.filter((item) => item?._id === id)
    
    return user?.length > 0 ? user[0] : undefined;
  };

  const checkUserAuth = () => {
  let assignee =  bug?.assignees?.filter((item) => item?._id === userId)?.length > 0 ? true : false
  let createdBy =   Array.isArray(bug?.createdBy) ? bug?.createdBy?.[0]?._id === userId : bug?.createdBy?._id === userId
  return assignee||createdBy ? true : false
  }

  return (
    <div>
      {
        // ADD Comment Section
      }
      {
 (       checkUserAuth() || !actionDisabled) &&    <div
        className={`${bugModal.commentInput} my-1 d_flex ${
          focused ? bugModal.focusedInput : "unFocused"
        } boxShadow`}
      >
        <div
          className={bugModal.sideLine}
          style={{
            background: focused ? "var(--lightBlue)" : "var(--primary)",
          }}
        />
        {/* <TextField
          // label="Description*"
          placeholder="Add Comment"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
              // else infoToast('Please enter a comment!');
            }
          }}
          autoFocus
          fullWidth
          className="mb-1"
          value={input}
          InputProps={{ className: `normalFont ${bugModal.inputSearch}` }}
          InputLabelProps={{ className: `normalFont ${bugModal.inputSearch}`}}
          multiline
          maxRows={4}
        /> */}
        <input
          placeholder="Add Comment"
          value={input}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
              // else infoToast('Please enter a comment!');
            }
          }}
          autoFocus
          style={{paddingLeft:10}}
        />
        <div className="parentInherit d_flex alignCenter">
          <IconButton onClick={() => handleSubmit()}>
            <AddIcon
              style={{
                color: focused ? "var(--lightBlue)" : "var(--defaultWhite)",
              }}
            />
          </IconButton>
        </div>
      </div>

      }
   


      <div>
        {bug?.comments?.length === 0 ? (
          <NoData lottieFile={emptyChat} title="No Comment" />
        ) : (
          bug?.comments?.map((item, index) => (
            <Fade key={`_${item}_${index}`}>
              {userId !== item?.createdBy ? (
                <div
                  key={`${item}_${index}`}
                  className={`${bugModal.commentBoxContainer} boxShadow normalFont`}
                  style={
                    (index === bugComment - 1
                      ? {
                          marginBottom: 120,
                        }
                      : "",
                    { opacity: item?._id?.includes("localData") ? 0.3 : 1 })
                  }
                >
                  <div className={`${bugModal.commentBox} d_flex`}>
                    <div className="d_flex alignCenter flex">
                      <Image
                        src={getUserDetails(item?.createdBy)?.profilePicture}
                        title={getUserDetails(item?.createdBy)?.name}
                      />
                      {/* <CustomAvatar
                          // src={getProfilePic(item?.createdBy)}
                          small
                        /> */}
                    </div>
                    <div className="">
                      <p className={`${bugModal.date_text} flex`}>
                        {moment(item?.createdAt).format("ll")}
                      </p>
                      <p className={`${bugModal.date_text} flex`}>
                        {moment(item?.createdAt).format("LT")}
                      </p>
                      </div>
                  </div>
                  <p>{item?.text}</p>
                </div>
              ) : (
                <div
                  key={`${item}_${index}`}
                  className={`${bugModal.commentBoxContainer} boxShadow normalFont`}
                  style={
                    (index === bugComment - 1
                      ? {
                          marginBottom: 120,
                        }
                      : "",
                    { opacity: item?._id?.includes("localData") ? 0.3 : 1 })
                  }
                >
                  <div className={`${bugModal.commentBox} d_flex`}>
                    <div className="d_flex  flex">
                      <div className="flex">
                      <p className={`${bugModal.date_text} flex`}>
                        {moment(item?.createdAt).format("ll")}
                      </p>
                      <p className={`${bugModal.date_text} flex`}>
                        {moment(item?.createdAt).format("LT")}
                      </p>
                      </div>

                      <Image
                        src={getUserDetails(item?.createdBy)?.profilePicture}
                        title={getUserDetails(item?.createdBy)?.name}
                      />
                    </div>
                  </div>
                  <p style={{ textAlign: "right" }}>{item.text}</p>
                </div>
              )}
            </Fade>
            // <div>{item?.text}</div>
          ))
        )}
      </div>
    </div>
  );
}

export default BugComment;
