import React ,{useState}from 'react'
import { errorToast } from 'utils/toast';
import bugModal from "css/BugModal.module.css";
import {   IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
function RequirementInputField({data}) {
    const [input, setInput] = useState("");
    const [focused, setFocused] = React.useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    // const { mutate: mutateAddTodo} = useAddTodo();
  
    const handleSubmit = () => {
      if (input.length < 3) {
        return errorToast("Minimum 3 character required.");
      }
    //   let obj = {
    //     data: {
    //       title: input,
    //       assignee: data?.assignee?._id,
    //     },
    //     taskId: data?.taskId,
    //     orgId: data?.orgId,
    //     projectId: data?.projectId,
    //     milestoneId: data?.milestoneId,
    //     fromModule: "Milestone",
    //   };
    //   input?.trim()?.length && mutateAddTodo(obj);
      setInput("");
    };
  
    return (
        <div className="py-1">
        <div
          className={`${bugModal.commentInput} d_flex ${
            focused ? bugModal.focusedInput : "unFocused"
          } boxShadow`}
          style={{ marginBottom: 3 }}
        >
          <div
            className={bugModal.sideLine}
            style={{
              background: focused ? "var(--lightBlue)" : "var(--primary)",
            }}
          />
  <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style={{display:"none"}} />
  <input type="password" name="password_fake" id="password_fake" value="" style={{display:"none"}} />
          <input
            variant="naked"
            placeholder={`Add Requirement`}
            value={input}
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
            style={{ flex: 1, paddingLeft: 10 }}
            className="ralewaySemiBold"
          />
          <div className="parentInherit d_flex alignCenter"
          style={{
            background:focused ? "var(--lightBlue)" :"var(--primary)"
          }}
          >
            <IconButton onClick={() => handleSubmit()}>
              <AddIcon
                style={{
                  color:  "var(--defaultWhite)",
                }}
              />
            </IconButton>
          </div>
        </div>
      </div>
    )
}

export default RequirementInputField
