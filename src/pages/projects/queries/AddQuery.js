import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import CustomButton from "components/CustomButton";
import classes from "pages/projects/bug/Bug.module.css";
import React, { useState } from "react";
import "./Queries.scss";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { useAddQuery } from "react-query/queries/useAddQuery";

function AddQuery({orgId , projectId , handleClose , handleClose_2}) {
    const [attachments, setAttachments] = useState([]);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [error , setError] = useState("")
const {mutate , isLoading} = useAddQuery(handleClose_2)

const onSubmit = () => {

    if(!title?.trim()?.length){
        return setError("Title field is required.")
    }

    let fd = new FormData();
    fd.append("title" , title);
    description?.trim()?.length && fd.append("description" , description);
    attachments?.map((item) => {
    fd.append("attachments" , item , item?.name);
    return null
})
mutate({
    data : fd,
    orgId,
    projectId,
})
}

return <div className="addQuery_container">

<input placeholder="Title" onChange={(event) => {
    setTitle(event?.target?.value)
    error?.length && setError("")
} }/>
{error && <div
          className="alignCenter"
          style={{
            color: "var(--red)",
            fontSize: 12,
            marginBottom: 15,
          }}
        >
          <ErrorRoundedIcon
            style={{ color: "var(--red)", fontSize: 16, marginRight: 5 }}
          />
          {error}
        </div>}
<textarea 
placeholder="Description"
onChange={(event) => setDescription(event?.target?.value) }
/>

<label htmlFor="bug-attachment">
                <div className={classes.upload}>
                  <CloudUploadOutlinedIcon />
                  <p
                    style={{
                      KhtmlUserSelect: "none",
                    }}
                    className={classes.text}
                  >
                    Drop files to attach, or
                    <span style={{ color: "lightblue", marginLeft: 5 }}>
                      browse
                    </span>
                  </p>
                </div>
              </label>


              <AttachmentContainer 
                attachment={attachments}
                attachmentUpdate={setAttachments}
                filesAllowed
              />

              <div className="alignCenter justifyContent_end">
              <CustomButton
              onClick={onSubmit}
              loading={isLoading}
              className={"mt-2"}>
                  <p>Submit</p>
              </CustomButton>
              </div>
</div>
}

export default AddQuery;
