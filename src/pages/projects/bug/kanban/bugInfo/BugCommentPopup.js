import CustomButton from "components/CustomButton";
import Image from "components/defaultImage/Image";
import React, { useState } from "react";
import { useEffect } from "react";
import { useOrgTeam } from "react-query/organisations/useOrgTeam";
import moment from "moment";

function BugCommentPopup({orgId , userType , comments , mutateBugComment , bugId}) {
      const { data:orgTeam } = useOrgTeam(orgId);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(40);
  const [currentUser, setCurrentUser] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const handleKeyUp = (evt) => {
    let newHeight =
      evt?.key === "Enter" ? textareaHeight + 5 : evt.target.scrollHeight;
    if (newHeight !== textareaHeight && newHeight < 200) {
      setTextareaHeight(newHeight);
    }
  };

  useEffect(() => {
    if (inputValue?.length === 0) {
      setTextareaHeight(40);
    }
  }, [inputValue]);

  useEffect(() => {
      let tempCurrentUser = orgTeam?.users?.find((item ) => item?._id === userType?.userId)
      tempCurrentUser &&   setCurrentUser(tempCurrentUser)
  }, [orgTeam]);
  


  const handleSubmit = () => {
    if (!inputValue) {
      return console.log("null");
    }
    let sendData = {
      data: {
        comment: inputValue,
      },
      additionalInfo: {
        createdBy: userType?.userId,
        createdAt: new Date().toUTCString(),
        text: inputValue,
        _id: `localData${Math.random()}`,
      },
      orgId: orgId,
      bugId: bugId,
    };
    mutateBugComment(sendData);
    setInputValue("");
    setInputIsFocused(false)
  };

  return (
    <div className="mb-4">
       <div className="d_flex">
       <Image 
        src={currentUser?.profilePicture}
        title={currentUser?.name}
        style={
            {
                height:40,
                width:40,
                marginRight:10,
                border : "1px solid #8a9aff"
            }
        }
        />
      <div
        className="bugCommentPopup_comment-frame flex"
        style={{
          height: inputIsFocused ? 70 + textareaHeight : 40,
        }}
      >
        <div className="bugCommentPopup_comment-box">
          <textarea
            placeholder="Write a comment..."
            onFocus={() => setInputIsFocused(true)}
            onBlur={() => {
              if (inputValue?.trim()?.length === 0) {
                setInputIsFocused(false);
                setInputValue("");
              }
            }}
            onKeyPress={handleKeyUp}
            style={{
              height: textareaHeight,
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e?.target?.value)}
            className="bugCommentPopup_comment-box-input"
          />
          <CustomButton
          onClick={handleSubmit}
          >
            <p>Save</p>
          </CustomButton>
        </div>
      </div>
       </div>

{
  comments?.map((item ) => (
    
    <BugCommentRow currentUser={currentUser} key={item?._id} data={item} orgTeam={orgTeam}/>
  ))
}
    </div>
  );
}

export default BugCommentPopup;


const BugCommentRow = ({currentUser , orgTeam , data}) => {
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
   
    let tempCurrentUser = orgTeam?.users?.find((item ) => item?._id === data?.createdBy)
      tempCurrentUser &&   setUserObj(tempCurrentUser)
  }, []);
  
  return <div className="my-2 d_flex"
  style={{
    background:"var(--divider)",
    padding:10,
    borderRadius:4
  }}
  >
     <Image 
        src={userObj?.profilePicture}
        title={userObj?.name}
        style={
            {
                height:40,
                width:40,
                marginRight:10,
                border : "1px solid #8a9aff"
            }
        }
        />  <div className="flex">
              <div className="d_flex" style={{marginBottom:3}}>
              <h4 className="flex">{currentUser?.name}</h4>
          <p style={{fontSize:12}}> {moment(data?.createdAt).format("ll")}</p>
          </div>
          
          <div className="d_flex">
          <p className="flex">{data?.text}</p>
          <p style={{fontSize:12}}> {moment(data?.createdAt).format("LT")}</p>
          </div>
        </div>
  </div>
}
