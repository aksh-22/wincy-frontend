import React from "react";
import success from "assets/lottie/success.json";
import loading from "assets/lottie/loading.json";
import error from "assets/lottie/error.json";
import NoData from "components/NoData";

export default function ShowLottie({ status }) {
  console.log(status);
  return (
    <NoData
      lottieFile={success}
      textDisable={true}
      style={{
        height: "100vh",
        justifyContent: "center",
      }}
    />
  );
}
