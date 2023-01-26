import React, { useRef, useState } from "react";
import RightSideAuth from "./RightSideAuth";
import { Link, useRouteMatch } from "react-router-dom";
// import cross_white from "assets/images/icons/projects/black/cross_white.png";
import "css/SignUp.css";
import Shape1 from "assets/images/shape1.png";
import Shape2 from "assets/images/shape2.png";
import companyLogo from "assets/images/companyLogo.jpeg";
import CustomButton from "components/CustomButton";
import CancelIcon from "@material-ui/icons/Cancel";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { IconButton, TextField } from "@material-ui/core";
import Avatar from "assets/images/avatar.png";
import { useSignup } from "react-query/auth/useSignup";
// import VisibilityIcon from "@material-ui/icons/Visibility";
// import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// import CustomInputAvatar from "components/CustomInputAvatar/CustomInputAvatar";
import PasswordInput from "components/PasswordInput";
import CustomInputAvatar from "components/CustomInputAvatar/CustomInputAvatar";
import TextInput from "components/textInput/TextInput";
import create from "assets/lottie/create.json";
import Icon from "components/icons/IosIcon";

function SignUp() {
  const [fields, setFields] = useState({});
  const [error, setError] = useState({});
  // const [passToggle, setPassToggle] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const fileInput = useRef();
  const { mutate, isLoading } = useSignup();
  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const [inputData, setInputData] = useState({
    email: "",
    name: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: {},
  });

  const [isError, setIsError] = useState({
    email: false,
    name: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errorTxt, setErrorTxt] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [didEditImage, setDidEditImage] = useState(false);

  const { path: url } = useRouteMatch();

  const validate = () => {
    const { name, email, password, confirmPassword } = fields;
    let nameError = "";
    let emailError = "";
    let passwordError = "";
    let confirmPasswordError = "";
    let emailReg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    let passReg =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!name) {
      nameError = "Required!";
    }

    if (!email) {
      emailError = "Required!";
    } else if (!email.match(emailReg)) {
      emailError = "Email field is not valid!";
    }
    if (!password) {
      passwordError = "Required!";
    } else if (!password.match(passReg)) {
      passwordError =
        "Password must be minimum 8 characters, one number, one upper case, one lower case and one special character!";
    }
    if (!confirmPassword) {
      confirmPasswordError = "Confirm password is required";
    } else if (!confirmPassword.match(password)) {
      confirmPasswordError = "Password and confirmation password do not match.";
    }

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setError({
        ...error,
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return false;
    }
    return true;
  };

  const removeProfilePicture = () => {
    setProfilePicture("");
  };
  const imageLogo = (item) => {
    console.log("imageLogo profilePicture:", item);
    if (item) return URL.createObjectURL(item);

    return Avatar;
  };

  const handleSubmit = () => {
    let emailReg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const passReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (inputData.name.trim().length === 0) {
      console.log("aaaa");
      setIsError({ ...isError, name: true });
      setErrorTxt({
        ...errorTxt,
        name: "Name is required",
      });
    } else if (inputData.email.trim().length === 0) {
      console.log("aaaa");
      setIsError({ ...isError, email: true });
      setErrorTxt({
        ...errorTxt,
        email: "Email is required",
      });
    } else if (!emailReg.test(inputData.email)) {
      console.log("aaaa");
      setIsError({ ...isError, email: true });
      setErrorTxt({
        ...errorTxt,
        email: "Email is not correct",
      });
    } else if (!passReg.test(inputData.newPassword)) {
      setIsError({ ...isError, newPassword: true });
      setErrorTxt({
        ...errorTxt,
        newPassword:
          "Password must be minimum 8 characters maximum 32 characters, one number, one upper case, one lower case and one special character!",
      });
    } else if (inputData.confirmPassword !== inputData.newPassword) {
      console.log("object");
      setIsError({ ...isError, confirmPassword: true });
      setErrorTxt({
        ...errorTxt,
        confirmPassword: "New password and confirm password did not match",
      });
    } else {
      let data = new FormData();
      didEditImage &&
        data.append(
          "profilePicture",
          inputData?.profilePicture,
          inputData?.profilePicture?.name
        );
      data.append("name", inputData?.name);
      data.append("email", inputData?.email);
      data.append("password", inputData?.newPassword);
      console.log(data.get("profilePicture"));
      console.log(inputData);
      mutate(data);
    }
  };

  console.log("profilePicture", profilePicture);
  return (
    <>
      <div className="workspaceLogo">
        <Link to="/"     style={{
            display: "flex",
            cursor: "pointer",
            textDecoration: "none",
            alignItems: "end"
          }}>
          {/* <img
            src={companyLogo}
            alt="companyLogo"
            className="companyLogo"
            style={{
              objectFit: "cover",
              borderRadius: "6px",
              height: "100%",
              width: "100%",
            }}
          /> */}
           <Icon 
          name="projectLogo"
          style={{
            width : "40%",

          }}
          />
        </Link>
        <Link to="/" style={{ height: "auto" }}>
          {/* <p
            style={{
              paddingLeft: "15px",
              // display: "flex",
              // justifyItems: "center",
              // alignItems: "center",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            Workspace
          </p> */}
        </Link>
      </div>
      <div className="sign_left">
        <div className="logIn">
          <p
            style={{ width: "100%", textAlign: "center" }}
            className="ff_Lato_Regular"
          >
            {/* Create your account */}
            Welcome to Wincy
          </p>
          <p
            style={{
              fontSize: 18,
              textAlign: "center",
              color: "#9699aa",
              marginBottom: 20,
            }}
            className="ff_Lato_Italic"
          >
            {/* Fill in your details */}
            Let's get started by filling following details
          </p>
          {/* <div className="image">
            <CustomInputAvatar
              input
              img={imageLogo(profilePicture)}
              setDidEditImage={setDidEditImage}
              getImage={(img) => {
                console.log(img);
                setInputData({ ...inputData, profilePicture: img });
              }}
            />
          </div> */}
          {/* <div className="fileUpload">
            <div className="input-wrap">
              <input
                type="file"
                name="profilePicture"
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                ref={fileInput}
                onChange={(e) =>
                  setInputData({
                    ...inputData,
                    profilePicture,
                    profilePicture: e.target.files[0],
                  })
                }
              />

              <div className="signup__img_wrap">
                <img
                  src={imageLogo(profilePicture)}
                  className="editImage"
                  alt="no_img"
                />

                <div className="signup__img_wrap_in">
                  {profilePicture ? (
                    <IconButton>
                      <CancelIcon
                        color="primary"
                        fontSize="medium"
                        onClick={removeProfilePicture}
                      />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => fileInput.current.click()}>
                      <AddAPhotoIcon color="primary" />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          </div> */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="ff_Lato_Regular"
          >
            {/* <input type="text" style={{ visibility: "hidden" }} /> */}
            {/* <input type="password" style={{ visibility: "hidden" }} /> */}
            <div className="inputEl ff_Lato_Regular">
              {/* <span htmlFor="" className="">Name*</span> */}

              <TextInput
                type="text"
                name="name"
                placeholder="Name"
                autoFocus
                variant="outlined"
                className="inputField"
                helperText={isError.name && errorTxt.name}
                onChange={(e) => {
                  setIsError({ ...isError, name: false });
                  setInputData({ ...inputData, name: e.target.value });
                }}
                inputProps={{ minlength: 1, maxLength: 40 }}
                error={isError.name}
              />
            </div>

            <div className="inputEl">
              {/* <span htmlFor="">Email Address*</span> */}
              <TextInput
                type="text"
                name="email"
                placeholder="Email Id"
                
                variant="outlined"
                className="inputField"
                helperText={isError.email && errorTxt.email}
                onChange={(e) => {
                  setIsError({ ...isError, email: false });
                  setInputData({ ...inputData, email: e.target.value?.toLowerCase() });
                }}
                inputProps={{ minlength: 1, maxLength: 40 }}
                error={isError.email}
              />
            </div>

            <div className="inputEl">
              {/* <span htmlFor="">New Password*</span> */}
              <TextInput
                required
                placeholder="New Password"
                onChange={(e) => {
                  setIsError({ ...isError, newPassword: false });
                  setInputData({ ...inputData, newPassword: e.target.value });
                }}
                // onKeyPress={
                //   (e) => e.key === "Enter" && handleSubmit()
                // }
                // ref={passwordRef}
                maxLength="40"
                variant="outlined"
                className="inputField"
                error={isError.newPassword}
                minlength={8}
                maxLength={32}
                helperText={isError.newPassword && errorTxt.newPassword}
                visibilityControl
              />
            </div>

            <div className="inputEl">
              {/* <span htmlFor="">Confirm Password*</span> */}
              <TextInput
                required
                placeholder="Confirm Password"
                onChange={(e) => {
                  setIsError({ ...isError, confirmPassword: false });
                  setInputData({
                    ...inputData,
                    confirmPassword: e.target.value,
                  });
                }}
                // onKeyPress={
                //   // (e) => e.key === "Enter" && handleSubmit()
                // }
                // ref={passwordRef}
                maxLength="40"
                variant="outlined"
                className="inputField"
                error={isError.confirmPassword}
                helperText={isError.confirmPassword && errorTxt.confirmPassword}
                minlength={8}
                maxLength={32}
                visibilityControl
              />
            </div>
          </div>

          <CustomButton
            onClick={handleSubmit}
            width="80%"
            loading={isLoading}
            disabled={isLoading}
            backgroundColor="var(--progressBarColor)"
          >
            Register
          </CustomButton>
          <div style={{ textAlign: "center", marginTop: 0 }}>
            <div
              style={{ fontSize: 13, marginTop: 30 }}
              className="ff_Lato_Regular"
            >
              Already have an account?&nbsp;
              <Link
                to="/login"
                style={{ color: "var(--primary)" }}
                className="ff_Lato_Italic"
              >
                Login.
              </Link>
            </div>
          </div>
        </div>
        <div className="rightBox"></div>
        <div className="rightside">
          <RightSideAuth 
          lottieFile={create}
          />
        </div>
      </div>
    </>
  );
}

export default SignUp;
