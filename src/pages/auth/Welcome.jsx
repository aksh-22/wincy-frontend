import React from "react";
import "css/Welcome.css";
// import Shape1 from "assets/images/shape1.png";
// import Shape2 from "assets/images/shape2.png";
// import logo from "assets/images/companyLogo.jpeg";
import { Link, useHistory } from "react-router-dom";
import CustomButton from "components/CustomButton";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Icon from "components/icons/IosIcon";
import TextAnimationArray from "components/textAnimationArray/TextAnimationArray";
// import { successToast } from 'utils/toast';

const textArray = [
  {
    text1: "managing projects ",
    text2: " tracking bugs.",
    width: 380,
  },
  { text1: "tracking progress", text2: "deadlines.", width: 290 },
  { text1: "managing files", text2: "credentials.", width: 280 },
];

const textArray2 = [
  "managing projects ",
  "tracking progress",
  "managing files",
];

function Welcome() {
  const userInfo = useSelector((state) => state.userReducer.userData);
  const history = useHistory();

  useEffect(() => {
    if (userInfo?.token) history.push("/main");
  }, [userInfo?.token, history]);
  const [currIndex, setCurrIndex] = useState(0);
  // const [opacityClass, setOpacityClass] = useState("opacity-100");
  useEffect(() => {
    let abc;

    abc = setTimeout(() => {
      if (textArray.length === currIndex + 1) {
        setCurrIndex(0);
      } else {
        setCurrIndex((prev) => prev + 1);
      }
    }, 4000);

    return abc;
  }, [currIndex]);

  // useEffect(() => {
  //   let classChange = setTimeout(() => {
  //     setOpacityClass(
  //       // "opacity-0"
  //        opacityClass=== "opacity-100" ? "opacity-0" : "opacity-100"
  //        )
  // // setTimeout(() => {
  // //   setOpacityClass( "opacity-100")
  // // },900)
  // } , 2500)
  //     return classChange
  // }, [opacityClass])

  return (
    <>
      <div className="welcome_wrapper">
        {/* <img src={Shape1} className="shape1" alt="Shape" /> */}
        <div
          className="welcome_card"
          style={{
            width: "100vw",
          }}
        >
          <div
            className="welcome_card__content"
            style={{
              position: "absolute",
              transform: "translate(-50% , -50%)",
              top: "50%",
              left: "50%",
            }}
          >
            <Icon
              name="projectLogo"
              style={{
                width: "35%",
                // marginBottom : 40
              }}
            />

            <div className="text_area ff_Lato_Bold  alignCenter">
              <h1 className="" style={{ fontSize: 38 }}>
                {/* Welcome */}
                Welcome to one place&nbsp;
              </h1>

              <div
                style={{
                  color: "#FFF",
                  fontSize: 20,
                  display: "flex",
                  // width : currIndex === 1  ? "100%" : "120%"
                }}
                className="ff_Lato_Regular trans"
              >
                {/* One place for */}
                <h1
                  className={`trans`}
                  style={{ minWidth: textArray[currIndex]?.width }}
                >
                  <span style={{ color: "#FFF" }}>for&nbsp;</span>
                  <span className={`trans opacity`}>
                    {textArray[currIndex]?.text1}
                  </span>{" "}
                  <span style={{ color: "#FFF" }}>and</span>{" "}
                  <span className={`trans opacity`}>
                    {textArray[currIndex]?.text2}
                  </span>
                </h1>
              </div>
              {/* <TextAnimationArray
                textArray={textArray2}
                effect="verticalFadeIn"
              /> */}
            </div>

            <div className="welcomeButton mt-2" style={{ maxWidth: "40vw" }}>
              <Link to={"/login"} style={{ marginRight: 10 }}>
                <CustomButton
                  width="90%"
                  // height={25}
                  // className="ff_Lato_Bold"
                  backgroundColor="var(--progressBarColor)"
                >
                  Login
                </CustomButton>
              </Link>
              <Link to={"/signup"}>
                <CustomButton
                  width="90%"
                  // height={25}
                  type="outlined"
                  color="var(--defaultWhite)"
                  // className="ff_Lato_Bold"
                >
                  Register
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
        {/* <img src={Shape2} className="shape2" alt="Shape" /> */}
      </div>
      <ul class="circles">
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--dprimary" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>

        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
        <li style={{ background: "var(--defaultWhite)" }}></li>
        <li style={{ background: "var(--progressBarColor)" }}></li>
      </ul>
    </>
  );
}

export default Welcome;
