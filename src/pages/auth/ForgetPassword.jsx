import React, { useState } from "react";
import RightSideAuth from "./RightSideAuth";
import Shape1 from "assets/images/shape1.png";
import Shape2 from "assets/images/shape2.png";
import companyLogo from "assets/images/companyLogo.jpeg";
import { Link } from "react-router-dom";
import "css/ForgetPassword.css";
import CustomButton from "components/CustomButton";
import TextField from "@material-ui/core/TextField";
import { usePassResetRequest } from "react-query/auth/usePassResetRequest";
import { usePassReset } from "react-query/auth/usePassReset";
import { useHistory } from "react-router-dom";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import { IconButton, InputAdornment } from "@material-ui/core";
import PasswordInput from "components/PasswordInput";
import TextInput from "components/textInput/TextInput";
import otp from "assets/lottie/otp.json";
import Icon from "components/icons/IosIcon";

function ForgetPassword() {
  const history = useHistory();
  const [userInput, setUserInput] = useState({});
  const [error, setError] = useState("");
  const [isError, setIsError] = useState({
    email: false,
    newPass: false,
    confirmPass: false,
    otp: false,
  });

  const [showPass, setShowPass] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [sucessState, setSucessState] = useState(false);

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const passRe = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  // const validation = () => {
  //   // let emailError = "";
  //   // let { email } = this.state;
  //   if (!email) {
  //     // emailError = "Email is required";
  //     setError("Email is required");
  //   } else if (email.length > 50) {
  //     setError("Maximum character limit is 50");
  //     // emailError = "Maximum character limit is 50";
  //   }
  //   // if (emailError) {
  //   //   setError({ ...error, email: emailError });
  //   //   return false;
  //   // }
  //   return true;
  // };

  const { mutate, isLoading } = usePassResetRequest();
  const { mutate: resetMute, isLoading: resetLoading } = usePassReset();

  const sendHandler = () => {
    if (!userInput.email) {
      setIsError({ ...isError, email: true });
      setError("Email is required");
    } else if (!re.test(userInput.email)) {
      setIsError({ ...isError, email: true });
      setError("Enter correct email");
    } else if (userInput.email.length > 50) {
      setIsError({ ...isError, email: true });
      setError("Maximum character limit is 50");
    } else {
      mutate(
        { email: userInput.email },
        {
          onSuccess: () => {
            setSucessState(true);
          },
        }
      );
    }
  };

  const resetHandler = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const passRe =
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

    if (!userInput.email) {
      setIsError({ ...isError, email: true });
      setError("Email is required");
    } else if (!re.test(userInput.email)) {
      setIsError({ ...isError, email: true });
      setError("Enter correct email");
    } else if (userInput.email.length > 50) {
      setIsError({ ...isError, email: true });
      setError("Maximum character limit is 50");
    } else if (!passRe.test(userInput.newPass)) {
      setIsError({ ...isError, newPass: true });
      setError(
        "Passwords must be  At least 8 characters,1 lowercase,1 capital letter,1 number,1special character"
      );
    } else if (userInput.newPass !== userInput.confirmPass) {
      setIsError({ ...isError, confirmPass: true });
      setError("New password and confirm password are not same");
    } else if (!userInput.otp) {
      setIsError({ ...isError, otp: true });
      setError("5 digit otp required");
    } else if (
      userInput.otp.trim().length > 5 ||
      userInput.otp.trim().length < 5
    ) {
      setIsError({ ...isError, otp: true });
      setError("5 digit otp is required");
    } else {
      const data = {
        email: userInput.email,
        passCode: userInput.otp,
        newPassword: userInput.newPass,
      };
      resetMute(data, {
        onSuccess: () => {
          history.push("/login");
        },
      });
    }
  };

  return (
    <div className="forgotPassword">
      <div className="workspaceLogo">
        <Link
          to="/"
          style={{
            display: "flex",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          {/* <img
            src={companyLogo}
            alt="companyLogo"
            className="companyLogo"
            style={{
              width: "4rem",
              height: "4rem",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          /> */}
          <Icon
            name="projectLogo"
            style={{
              width: "40%",
            }}
          />
          {/* <p
            style={{
              paddingLeft: "15px",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            Workspace
          </p> */}
        </Link>
      </div>
      <div className="logIn" style={{ flex: 0.5 }}>
        <div
          className="loginForm"
          style={{
            padding: 40,
          }}
        >
          <h3 className="ff_Lato_Bold">Forgot Password</h3>
          <p
            style={{
              fontSize: 18,
              textAlign: "center",
              color: "#9699aa",
              width: "100%",
              // marginBottom: 20,
            }}
            className="ff_Lato_Italic"
          >
            Kindly enter your registered email ID to receive a OTP for new
            password.
          </p>

          <div className="inputArea">
            <div className="inputEl">
              {/* <span htmlFor="">Email Address*</span> */}
              <TextInput
                placeholder="Email Address*"
                id="Email Address"
                className="inputField"
                variant="outlined"
                onChange={(e) => {
                  setUserInput({ ...userInput, email: e.target.value });
                  setIsError({ ...isError, email: false });
                }}
                required
                error={isError.email}
                helperText={isError.email && error}
              />
            </div>

            {sucessState && (
              <>
                <div className="inputEl">
                  {/* <span htmlFor="">New Password*</span> */}
                  <TextInput
                    required
                    placeholder="New Password"
                    maxLength="40"
                    variant="outlined"
                    className="inputField"
                    onChange={(e) => {
                      setUserInput({ ...userInput, newPass: e.target.value });
                      setIsError({ ...isError, newPass: false });
                    }}
                    required
                    error={isError.newPass}
                    helperText={isError.newPass && error}
                    visibilityControl
                  />
                </div>
                <div className="inputEl">
                  {/* <span htmlFor="">Confirm Password*</span> */}
                  <TextInput
                    required
                    placeholder="Confirm Password"
                    onChange={(e) => {
                      setUserInput({
                        ...userInput,
                        confirmPass: e.target.value,
                      });
                      setIsError({ ...isError, confirmPass: false });
                    }}
                    // onKeyPress={
                    //   // (e) => e.key === "Enter" && handleSubmit()
                    // }
                    // ref={passwordRef}
                    maxLength="40"
                    variant="outlined"
                    className="inputField"
                    error={isError.confirmPass}
                    helperText={isError.confirmPass && error}
                    visibilityControl
                  />
                </div>
                <div className="inputEl">
                  {/* <span htmlFor="">Otp*</span> */}
                  <TextInput
                    placeholder="Otp*"
                    id="OTP"
                    variant="outlined"
                    className="inputField"
                    value={userInput.otp}
                    onChange={(e) => {
                      setUserInput({ ...userInput, otp: e.target.value });
                      setIsError({ ...isError, otp: false });
                    }}
                    type="number"
                    required
                    error={isError.otp}
                    helperText={isError.otp && error}
                  />
                </div>
                {/* <FormControl>
                  <InputLabel>OTP</InputLabel>
                  <Input
                    onChange={(e) => {
                      setUserInput({ ...userInput, otp: e.target.value });
                      setIsError(false);
                    }}
                  />
                </FormControl> */}
              </>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            {!sucessState ? (
              <CustomButton
                width="100%"
                onClick={sendHandler}
                loading={isLoading}
                backgroundColor="var(--progressBarColor)"
              >
                Send
              </CustomButton>
            ) : (
              <CustomButton
                width="100%"
                onClick={resetHandler}
                loading={resetLoading}
              >
                Reset Password
              </CustomButton>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: 0 }}>
            <div
              style={{ fontSize: 13, marginTop: 30 }}
              className="ff_Lato_Regular"
            >
              <Link to="/login" style={{ color: "var(--primary)" }}>
                Login to continue.
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rightside">
        <RightSideAuth lottieFile={otp} />
      </div>
    </div>
  );
}

export default ForgetPassword;
