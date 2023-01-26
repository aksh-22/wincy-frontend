import React from "react";
import Lottie from "react-lottie";
import noData from "assets/images/noData.png";

export default function NoData({
  title,
  lottieFile,
  height,
  width,
  textDisable,
  speed,
  style,
  error,
  errorStyleEnable,
}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieFile ?? noData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className="d_flex alignCenter flexColumn"
      style={
        error && errorStyleEnable ? errorStyle
          : {
              ...style,
            }
      }
    >
      {lottieFile ? (
        <Lottie
          options={defaultOptions}
          height={height ?? 350}
          width={width ?? 350}
          speed={speed}
        />
      ) : (
        // <div style={{ height: "500px" }}>
        <img
          src={noData}
          alt="noData"
          style={{ objectFit: "contain", height: "350px" }}
        />
        // </div>
      )}
      {textDisable ?? (
        <p style={{ fontSize: 18, fontFamily: "Lato-Bold" }}>
          {title ??( error ? "Something went wrong! Please try again later" : "No Data Available")}
          
        </p>
      )}
    </div>
  );
}

const errorStyle = {
  height: "80vh",
  justifyContent: "center",
};
