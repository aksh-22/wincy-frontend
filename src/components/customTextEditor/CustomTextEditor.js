import CustomButton from "components/CustomButton";
import JoditEditor from "jodit-react";
import React, { useState } from "react";
import classes from "./CustomTextEditor.module.css";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LightTooltip } from "components/tooltip/LightTooltip";

const CustomTextEditor = React.forwardRef(
  (
    {
      disable,
      value,
      theme,
      updateData,
    },
    ref
  ) => {
    const [showEditor, setShowEditor] = useState(false);
    const config = {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/
      statusbar: false,
      autofocus: true,
      toolbarInline: false,
      // preset: !show ? "inline" : "",
      showTooltipDelay: 100,
      tabIndex: -1,
      // removeButtons: [
      //   "superscript",
      //   "subscript",
      //   "source",
      //   "image",
      //   "video",
      //   "file",
      //   "copyformat",
      //   "table",
      //   "symbol",
      //   "fullsize",
      //   "preview",
      //   "print",
      //   "about",
      // ],
      buttons:
        "bold,italic,underline,strikethrough,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,link",
      buttonsMD:
        "bold,italic,underline,strikethrough,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,link",
      buttonsSM:
        "bold,italic,underline,strikethrough,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,link",
      buttonsXS:
        "bold,italic,underline,strikethrough,superscript,subscript,ul,ol,indent,outdent,left,fontsize,paragraph,brush,link",
      // askBeforePasteFromWord: false,
      // askBeforePasteHTML: false,
    };
    return (
      <div>
        {!showEditor &&
            <div className="alignCenter justifyContent_end mb-05">
        {
          !disable &&   <div className="cursorPointer" onClick={() => !disable && setShowEditor(true)}>
          <LightTooltip title="Edit" arrow>
        <EditRoundedIcon />
          </LightTooltip>
            </div>
        }
        </div>
        }
        {showEditor ? (
          <div>
            <JoditEditor
              ref={ref}
              value={value}
              config={config}
              tabIndex={1} // tabIndex of textarea
              theme={theme ?? "dark"}
              onBlur={(e, b, c, d) => {
                // setEditorData(e);
                // updateData(ref);
              }}
              onChange={(e) => {
                // setEditorData(e);
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <CustomButton
                style={{ margin: 10 }}
                onClick={() => {
                  console.log(ref);
                  // ref.current;
                  setShowEditor(false);
                }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={() => {
                  setShowEditor(false);
                  updateData && updateData(ref?.current?.value);
                  console.log("--->", ref?.current?.value);
                  // if (ref?.current?.value.length < 1) ref.current.value = "Add";
                }}
              >
                Update
              </CustomButton>
            </div>
          </div>
        ) : (
          <div
            className={classes.j_editor}
            onClick={() => {
              // !disable && setShowEditor(true);
            }}
            dangerouslySetInnerHTML={{
              __html:
                value === "" || value === undefined
                  ? !disable
                    ? "<p>Click edit icon to add description</p>"
                    : "<p>No description available</p>"
                  : value,
            }}
          />
        )}
      </div>
    );
  }
);

export default CustomTextEditor;
