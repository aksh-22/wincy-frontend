import { Autocomplete, TextField } from "@mui/material";
import Image from "components/defaultImage/Image";
import css from "css/BugModal.module.css";
import React, { useState } from "react";
import classes from "./Bug.module.css";

export default function AssigneeSelect({
  assignee,
  assignees,
  error,
  onClose,
}) {
  const [assigneeC, setAssigneeC] = useState([]);

  return (
    <div style={{ position: "relative" }} className={classes.select}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={assignee}
        noOptionsText={
          <p style={{ color: "var(--defaultWhite)" }}>No Assignee</p>
        }
        // getOptionLabel={(props, options, a) => <SelectRender item={props} />}
        getOptionLabel={(option) => option.name}
        classNamee={css.assignee}
        // renderOption={(props, options, { selected }) => (
        // 	<SelectRender props={props} selected={selected} item={options} />
        // )}
        renderOption={(props, option, { selected }) => (
          <SelectRender props={props} item={option} selected={selected} />
        )}
        // filterSelectedOptions
        // freeSolo
        disableCloseOnSelect
        onClose={(e, b) => {
          onClose(assigneeC);
        }}
        onChange={(e, arr) => {
          setAssigneeC(arr);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <div
              style={{
                paddingRight: 10,
                display: "flex",
                alignItems: "center",
                fontSize:14
              }}
              className={classes.assignee}
            >
              <Image
                title={option?.name}
                src={option?.profilePicture}
                small
                variant="circle"
                {...getTagProps({ index })}
              />
              <p style={{ marginLeft: 5 }}> {option?.name}</p>
            </div>
          ))
        }
        PaperComponent={(e) => (
          <ul className={classes.assigneePopup}>{e.children}</ul>
        )}
        // defaultValue={[bugData?.assignees[13]]}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error ? true : false}
            helperText={error}
            variant="standard"
            // label='Multiple values'
            // placeholder='Favorites'
            placeholder="Assignees*"
          />
        )}
      />
    </div>
  );
}

function SelectRender({ item, selected, props }) {
  return (
    <div
      {...props}
      className={`${selected && css.selectRow} ${
        css.assigneeRow
      } normalFont d_flex alignCenter`}
    >
      <Image
        title={item?.name}
        src={item?.profilePicture}
        small
        variant="circle"
      />
      <p className="pl-1"> {item?.name}</p>
    </div>
  );
}
