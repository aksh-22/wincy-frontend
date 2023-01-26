import React from "react";
import "./Loading.css";
import ClipLoader from "react-spinners/ClipLoader";

function Loading({ loadingType, type, backgroundColor  ,size}) {
  return loadingType === "spinner" ? (
    <ClipLoader
      loading={true}
      color={
        type === "contained"
          ? "white"
          : backgroundColor
          ? backgroundColor
          : "black"
      }
      size={size??14}
    />
  ) : (
    <div class="dot-elastic" />
  );
}

export default Loading;
