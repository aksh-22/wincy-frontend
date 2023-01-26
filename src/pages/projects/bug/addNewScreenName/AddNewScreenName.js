import CustomButton from "components/CustomButton";
import TextInput from "components/textInput/TextInput";
import React from "react";
import { useState } from "react";
import classes from "./../Bug.module.css";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { IconButton } from "@material-ui/core";
import { errorToast } from "utils/toast";

export default function AddNewScreenName({ screens, setScreens, onClick }) {
  const [newScreenName, setNewScreenName] = useState("");
  const [showAddBtn, setShowAddBtn] = useState(false);

  return (
    <>
      <div className={classes.addNewScreenName}>
        {/* <input id="fake_user_name" name="fake_user[name]" style={{position:"absolute", top:"-10000%" }} type="text" value="Safari Autofill Me" />
      <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style={{display:"none"}} />
<input type="password" name="password_fake" id="password_fake" value="" style={{display:"none"}} /> */}

        <input
          type="email"
          name="prevent_autofill"
          id="prevent_autofill"
          value=""
          style={{ position: "absolute", top: "-10000%" }}
        />
        <input
          type="password"
          name="password_fake"
          id="password_fake"
          value=""
          style={{ position: "absolute", top: "-10000%" }}
        />
        <TextInput
          type="text"
          // value={newScreenName}
          placeholder="Enter new section name"
          variant="naked"
          maxLength={30}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              newScreenName.trim().length < 3 &&
                errorToast("Minimum 3 characters are required");
              newScreenName.trim().length >= 3 && onClick(newScreenName);
            }
          }}
          onChange={(e) => {
            e.target.value.trim().length > 3
              ? setShowAddBtn(true)
              : setShowAddBtn(false);
            setNewScreenName(e.target.value);
          }}
          className={classes.input}
          autoComplete={"OFF"}
        />
        <IconButton
          className={classes.addBtn}
          onClick={() => {
            newScreenName.trim().length < 3 &&
              errorToast("Minimum three characters are required");
            newScreenName.trim().length > 3 && onClick(newScreenName);
          }}
          // disabled={!showAddBtn}
        >
          <AddOutlinedIcon />
        </IconButton>
      </div>
    </>
  );
}
