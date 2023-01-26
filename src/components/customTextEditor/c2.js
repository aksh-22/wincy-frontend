import { ClickAwayListener } from "@material-ui/core";
import CustomButton from "components/CustomButton";
import JoditEditor from "jodit-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import classes from "./CustomTextEditor.module.css";

const CustomTextEditor = React.forwardRef(
  (
    {
      children,
      showEditorByDefault,
      disable,
      value,
      theme,
      onBlur,
      onChange,
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
        {showEditor ? (
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
        ) : (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        )}
      </div>
    );
  }
);
