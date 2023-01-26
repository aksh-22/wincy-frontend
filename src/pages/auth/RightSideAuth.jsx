import React from "react";
import loginL from "assets/lottie/login.json";
import wave from "assets/svg/wave.svg";
import blob from "assets/svg/blob.svg";

import "css/RightSideAuth.css";
import Lottie from "react-lottie";
function RightSideAuth({lottieFile}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieFile??loginL,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="welcomeBanner" style={{ zIndex: -1 }}>
      <div className="wave">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#625df5" opacity=".122">
          <path
            paint-order="stroke fill markers"
            fill-rule="evenodd"
            d="M355.925 1003.164C174.77 957.998-.365 843.334.562 608.32c.927-235.014 346.095-113.06 404.549-445.14C463.565-168.902 1076.339 37.47 948.4 505.468c-127.94 467.996-411.317 542.864-592.475 497.696z"
          />
        </svg>
      </div>
      <div className="lottie">
        <Lottie options={defaultOptions} />
      </div>
    </div>
  );
}

export default RightSideAuth;
