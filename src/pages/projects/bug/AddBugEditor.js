import JoditEditor from "jodit-react";
import React from "react";
import { memo } from "react";
import { useState } from "react";
import { useRef } from "react";

const AddBugEditor = React.forwardRef(
  (
    { handleChange, onBlur, value, onChange, error, helperText, onHandlePaste },
    ref
  ) => {
    const editor = useRef(null);
    const config = {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/
      statusbar: false,
      toolbarInline: false,
      showTooltipDelay: 100,
      uploader: { url: "none" },
      // theme: "dark",
      // uploader: { url: "none" },
      // toolbar: false,
      // preset: "inline",
      // theme: {
      //   backgroundColor: "#f0fff5",
      // },
      // toolbarInlineDisableFor: ["bold"],
      // toolbarInlineDisabledButtons: ["source", "bold"],
      // toolbarButtonSize: 3,
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
      events: {
        afterPaste: (e) => {
          // const items = e.clipboardData.items;
          // // const itemsN = items.map((el, index) => el[index].getAsFile());
          // const itemsN = [];
          // for (let idx = 0; idx < items.length; idx++) {
          //   itemsN.push(items[idx].kind);
          // }
          onHandlePaste(e);
        },
      },
      // askBeforePasteFromWord: false,
      // askBeforePasteHTML: false,
      // triggerChangeEvent: true,
    };
    return (
      <>
        <div
          style={{
            color: "#000",
            border: error && "1px solid red",
            borderRadius: 4,
          }}
        >
          <JoditEditor
            ref={ref}
            value={value}
            config={config}
            tabIndex={1} // tabIndex of textarea
            theme="dark"
            onBlur={onBlur}
          />
          {/* <p>Description field required*</p> */}
        </div>
        {error && <p style={{ color: "red", opacity: 0.6 }}>{helperText}</p>}
      </>
    );
  }
);

export default memo(AddBugEditor);
