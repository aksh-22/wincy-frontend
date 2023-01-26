import React, { memo } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import "./CustomSideBar.css";
// import ColoredScrollbars from "ColoredScrollbar";

function CustomSideBar({
  children,
  anchor,
  show,
  toggle,
  containerClass,
  drawerWidth,
}) {
  const useStyles = makeStyles({
    list: {
      width: "100%",
    },
    fullList: {
      width: "auto",
    },
  });
  const classes = useStyles();

  return (
    <Drawer
      disableEnforceFocus
      role="presentation"
      anchor={anchor ?? "right"}
      open={show}
      onClose={toggle}
      PaperProps={{
        className: "sideBar_container boxShadow p-0",
        style: {
          left: drawerWidth ?? "50%",
          overflow: "visible",
        },
      }}
    >
      {/* <ColoredScrollbars
         style={{
          // width: "100vw",
          // height: "100vh",
backgroundColor: "#171b34"

        }}
        universal
        autoHide
      > */}
      <>
        <div
          className={clsx(
            classes.list,
            {
              [classes.fullList]: anchor === "top" || anchor === "bottom",
            },
            "sideBar_container"
          )}
          role="presentation"
          // onClick={toggle}
          // onKeyDown={toggle}
        >
          {React.cloneElement(children, {
            toggle: toggle,
          })}
        </div>
      </>
      {/* </ColoredScrollbars> */}
    </Drawer>
  );
}

export default memo(CustomSideBar);
