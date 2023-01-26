import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import CustomButton from "components/CustomButton";
import { Link, useParams } from "react-router-dom";
import { useJoinNewUser } from "react-query/organisations/useJoinNewUser";
import companyLogo from "assets/images/companyLogo.jpeg";
import PasswordInput from "components/PasswordInput";
import RightSideAuth from "pages/auth/RightSideAuth";
import TextInput from "components/textInput/TextInput";
import Icon from "components/icons/IosIcon";

export default function Join() {
  const { token } = useParams();
  // console.log(token);

  // const [didAddImg, setDidAddImg] = useState(false);

  const { mutate, isLoading } = useJoinNewUser();

  const [inputData, setInputData] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
    profilePic: {},
  });

  const [isError, setIsError] = useState({
    name: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errorTxt, setErrorTxt] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
  });

  const registerHandler = () => {
    const passReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (inputData.name.trim().length === 0) {
      console.log("aaaa");
      setIsError({ ...isError, name: true });
      setErrorTxt({
        ...errorTxt,
        name: "Required",
      });
    } else if (inputData.newPassword.trim().length === 0) {
      console.log("object");
      setIsError({ ...isError, newPassword: true });
      setErrorTxt({
        ...errorTxt,
        newPassword: "Required",
      });
    } else if (!passReg.test(inputData.newPassword)) {
      console.log("object");
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
      const fd = new FormData();
      console.log("object");
      fd.append("password", inputData.newPassword);
      fd.append("name", inputData.name);
      // didAddImg &&
      //   fd.append(
      //     "profilePic",
      //     inputData.profilePic,
      //     inputData.profilePic.name
      //   );
      console.log(fd.get("name"));
      console.log(token);
      mutate({
        data: fd,
        token,
      });
    }
  };

  return (
    <>
      <div className="workspaceLogo">
        <Link
          to="/"
          style={{
            display: "flex",
            cursor: "pointer",
            textDecoration: "none",
            alignItems: "end",
          }}
        >
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
              width: "40%",
            }}
          />
        </Link>
        {/* <Link to="/" style={{ height: "auto" }}>
          <p
            style={{
              paddingLeft: "15px",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            Workspace
          </p>
        </Link> */}
      </div>
      <div className="sign_left">
        <div className="logIn">
          <h3
            style={{ width: "100%", textAlign: "center" }}
            className="ff_Lato_Bold"
          >
            Create your account
          </h3>
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
              {/* <input id="fake_user_name" name="fake_user[name]" style={{position:"absolute", top:"-10000%" }} type="text" value="Safari Autofill Me" /> */}
              <input
                type="email"
                name="prevent_autofill"
                id="prevent_autofill"
                value=""
                style={{ position: "absolute", top: "-10000%" }}
              />
              <input
                type="password"
                name="password_fake"
                id="password_fake"
                value=""
                style={{ position: "absolute", top: "-10000%" }}
              />
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

            {/* <div className="inputEl">
              <TextField
                type="text"
                name="email"
                placeholder="Email Id"
                autoFocus
                variant="outlined"
                className="inputField"
                helperText={isError.email && errorTxt.email}
                onChange={(e) => {
                  setIsError({ ...isError, email: false });
                  setInputData({ ...inputData, email: e.target.value });
                }}
                inputProps={{ minlength: 1, maxLength: 40 }}
                error={isError.email}
              />
            </div> */}

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
            onClick={registerHandler}
            width="80%"
            loading={isLoading}
            disabled={isLoading}
            backgroundColor="var(--progressBarColor)"
          >
            Register
          </CustomButton>
          {/* <div style={{ textAlign: "center", marginTop: 0 }}>
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
          </div> */}
        </div>
        <div className="rightBox"></div>
        <div className="rightside">
          <RightSideAuth />
        </div>
      </div>
    </>
  );
}
