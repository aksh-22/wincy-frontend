import { ClickAwayListener, TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import React from "react";
import { useState } from "react";
import AddNewScreenName from "./addNewScreenName/AddNewScreenName";
import classes from "./Bug.module.css";

export default function SetScreen({
  section,
  sectionsArr,
  platformId,
  handleChange,
}) {
  const [showModal, setShowModal] = useState(false);
  const [sections, setSections] = useState([
    ...(sectionsArr ? sectionsArr : []),
  ]);

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          setShowModal(false);
        }}
      >
        <div className={classes.screenInput}>
          {platformId && (
            <Autocomplete
              // freeSolo
              noOptionsText={<p style={{ color: "#FFF" }}>No Sections</p>}
              open={showModal}
              // disableCloseOnSelect
              id="combo-box-demo"
              value={section}
              // handleChange={(e) => handleChange("screen", e.target.value)}
              onChange={(e, value) => {
                handleChange("section", value);
                setShowModal(false);
                // handleChange("screen", value);
              }}
              options={sections ?? []}
              getOptionLabel={(option) => option}
              style={{ width: "100%" }}
              forcePopupIcon={true}
              // filterOptions={(options, params) => {
              //   const filtered = filter(options, params);
              //   if (params.inputValue !== "") {
              //     filtered.push({
              //       value: params?.inputValue,
              //       title: `Add "${params.inputValue}"`,
              //     });
              //   }
              //   return filtered;
              // }}
              // renderOption={(props, option) => (
              //   <li
              //     style={{
              //       // borderBottom: "1px solid var(--divider)",
              //       width: "100%",
              //     }}
              //     {...props}
              //   >
              //     {props}
              //   </li>
              // )}
              PaperComponent={(e) => {
                return (
                  <div className={classes.screenSelect}>
                    <AddNewScreenName
                      setScreens={setSections}
                      screens={sections}
                      onClick={(newSectionName) => {
                        const temp = sections;

                        temp.unshift(newSectionName);

                        setSections([...temp]);
                        handleChange("section", newSectionName, true);
                        setShowModal(false);
                      }}
                    />
                    {e?.children && e?.children}
                  </div>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // label="Combo box"
                  onClick={() => {
                    setShowModal(true);
                  }}
                  placeholder="Select an section"
                  variant="standard"
                  onChange={(e) => {
                    // projectInfo?.screens.includes(e.target.value)
                    //   ? setAddScreenBtn(false)
                    //   : setAddScreenBtn(true);
                  }}
                />
              )}
            />
          )}
          {/* {platform && (
            <>
              <Autocomplete
                id="combo-box-demo"
                // handleChange={(e) => handleChange("screen", e.target.value)}
                onChange={(e) => handleChange("screen", e.target.value)}
                options={projectInfo?.screens ?? []}
                getOptionLabel={(option) => option}
                style={{ width: "90%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // label="Combo box"
                    placeholder="Select an screen"
                    variant="standard"
                  />
                )}
              />
              {!showPopup ? (
                <LightTooltip title="Add a Screen">
                  <IconButton
                    style={{ color: "#fff", padding: 0, marginLeft: 10 }}
                    onClick={() => {
                      // setAddScreen(true);
                      setShowPopup(true);
                    }}
                  >
                    <AddCircleOutlineOutlinedIcon />
                  </IconButton>
                </LightTooltip>
              ) : (
                <LightTooltip title="Cancel">
                  <IconButton
                    style={{ color: "#fff", padding: 0, marginLeft: 10 }}
                    onClick={() => {
                      // setAddScreen(false);
                      setShowPopup(false);
                    }}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </LightTooltip>
              )}
            </>
          ) : (
            <>
              <TextInput placeholder="Enter new screen name" />
              <IconButton>
                <DoneOutlinedIcon />
              </IconButton>
              <LightTooltip title="Cancel">
                <IconButton
                  style={{ color: "#fff", padding: 0, marginLeft: 10 }}
                  onClick={() => {
                    setAddScreen(false);
                  }}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </LightTooltip>
            </>
          )}
          {showPopup && (
            <Card
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: 20,
                backgroundColor: "var(--blackMirror)",
                border: "1px solid var(--divider)",
                padding: 10,
                display: "flex",
                flexDirection: "column",
                backdropFilter: "blur(3px)",
              }}
            >
              <TextInput
                // variant="outlined"
                placeholder="Add an screen"
                style={{ margin: 10, color: "#fff" }}
              />
              <CustomButton>Add</CustomButton>
            </Card>
          )} */}
        </div>
      </ClickAwayListener>
    </>
  );
}
