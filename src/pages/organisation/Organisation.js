import React from "react";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { useDispatch } from "react-redux";
import "./Organisation.css";
function Organisation() {
  const dispatch = useDispatch();
  return (
    // <div className="d_flex alignCenter justifyContent_center flexColumn flex mt-4" style={{height : "100vh"}}>
    <div className="org">
      <p
        className="ff_Lato_Bold mt-5 mb-2"
        style={{
          fontSize: 24,
        }}
      >
        You are not associated with any organisation.
      </p>

      <div
        className="asd"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateRows: "auto",
          gridGap: 10,
          placeItems: "center",
          //   height : 150 ,
          //    maxWidth : 350,
          //    minWidth : 300
        }}
      >
        <div
          className="ff_Lato_Bold d_flex alignCenter justifyContent_center flexColumn cursorPointer py-3"
          style={{
            width: "100%",
            border: " 2px dashed var(--divider)",
          }}
          onClick={() => {
            dispatch({
              type: "SET_ORG_MODAL",
              payload: {
                type: "ADD",
                visible: true,
              },
            });
            // handleClose();
          }}
        >
          <div
            className="closeButton mb-1 "
            style={{
              height: 65,
              width: 65,
              paddingLeft: 2,
            }}
          >
            <AddRoundedIcon
              style={{
                fontSize: 42,
              }}
            />
          </div>
          <p style={{ fontSize: 24 }}> Create Organisation</p>
        </div>
      </div>

      <p className="ff_Lato_Italic my-1">or</p>
      <p className="ff_Lato_Bold">Ask your Organisation for invitation link</p>
    </div>
  );
}

export default Organisation;
