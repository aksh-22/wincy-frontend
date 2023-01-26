import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import classes from "./CustomInputAvatar.module.css";
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";
import { LightTooltip } from "components/tooltip/LightTooltip";

export default function CustomInputAvatar({
  onClick, //onClick eventListener
  getImage,
  img,
  isEditMode,
  input,
  setDidEditImage,
}) {
  useEffect(() => {
    if (!isEditMode) {
      setImage(img);
    }
  }, [isEditMode]);

  const [image, setImage] = useState(img);

  // const [showIcons, setShowIcons] = useState(false);

  return (
    <div className={classes.avatar}>
      <Avatar alt="Remy Sharp" src={image} className={classes.userImg} />
      <div className={classes.icon}>
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={(el) => {
            onClick && onClick(true);
            el.target.files.length !== 0 &&
              setImage(URL.createObjectURL(el.target.files[0]));
            getImage && getImage(el.target.files[0]);
            setDidEditImage && setDidEditImage(true);
          }}
        />
        {input && (
          <div className={classes.iconWrapper}>
            {/* <label className={classes.edit}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <EditIcon className={classes.camera} />
              </IconButton>
            </label> */}
            <label htmlFor="icon-button-file" className={classes}>
              <LightTooltip title="Select an Image">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  style={{ color: "var(--defaultWhite)" }}
                >
                  <PhotoCamera className={classes.camera} />
                </IconButton>
              </LightTooltip>
            </label>
            {/* <label className={classes.delete}>
              <LightTooltip title="Remove Image">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => {
                    setImage({});
                    getImage && getImage();
                  }}
                >
                  <DeleteIcon className={classes.camera} />
                </IconButton>
              </LightTooltip>
            </label> */}
          </div>
        )}
      </div>
    </div>
  );
}
