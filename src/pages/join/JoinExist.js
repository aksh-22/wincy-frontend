import NoData from "components/NoData";
import React from "react";
import { useJoinExistUser } from "react-query/organisations/useJoinExistUser";
import { useParams } from "react-router-dom";
import success from "assets/lottie/success.json";
import loading from "assets/lottie/loading.json";
import error from "assets/lottie/error.json";
import ShowLottie from "./ShowLottie";
import { useEffect } from "react";
import { joinOrgExistedUser } from "api/organisation";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogout } from "react-query/auth/useLogout";
import { useCallback } from "react";
import CustomButton from "components/CustomButton";

export default function JoinExist() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState();
  const { token } = useParams();
  console.log("joinExist");
  console.log(isLoading, isError, isSuccess);
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading: logoutLoading, mutate } = useLogout();

  const userId = useSelector(
    (state) => state?.userReducer?.userData?.user?._id
  );
  // const { isLoading, isError, isSuccess } = useJoinExistUser(token);
  // console.log(isError, isSuccess);
  useEffect(() => {
    joinOrgExistedUser(token)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setIsError(false);
        setIsSuccess(true);
        if (res?.status === 200) {
          setUserData(res?.data?.data);
          if (res?.data?.data?.userId === userId) {
            console.log("exist");
            dispatch({
              type: "UPDATE_USER_TYPE",
              payload: res?.data?.data?.user,
            });
            dispatch({
              type: "SELECTED_ORGANISATION",
              payload: res?.data?.data?.user?.organisation,
            });
            // setTimeout(() => {
            //   history.replace("/login");
            // }, 3000);
          } else {
            console.log("does not exist");
            mutate();
          }
          setTimeout(() => {
            history.replace("/login");
          }, 3000);
        } else {
          setIsError(true);
          setIsSuccess(false);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
        history.replace("/login");
      });
  }, []);
  return (
    <div style={{ color: "var(--defaultWhite)" }}>
      {/* <ShowLottie
        status={isLoading ? isLoading : isError ? isError : isSuccess}
      /> */}
      <NoData
        // lottieFile={loading}
        lottieFile={isLoading ? loading : isSuccess ? success : error}
        textDisable={true}
        style={{
          height: "100vh",
          justifyContent: "center",
        }}
      />
      {!isLoading && (
        <CustomButton
          style={{
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          onClick={() => {
            history.replace("/login");
          }}
        >
          Continue
        </CustomButton>
      )}
      {/* {isSuccess && (
        <NoData
          lottieFile={success}
          textDisable={true}
          style={{
            height: "100vh",
            justifyContent: "center",
          }}
        />
      )}
      {isLoading && (
        <NoData
          lottieFile={loading}
          textDisable={true}
          style={{
            height: "100vh",
            justifyContent: "center",
          }}
        />
      )}

      {isError && (
        <NoData
          lottieFile={error}
          textDisable={true}
          style={{
            height: "100vh",
            justifyContent: "center",
          }}
        />
      )} */}

      {/* {
        !isSuccess && 
        <CustomButton>
          Click Here for Go to Home Page
        </CustomButton>
      } */}
    </div>
  );
}
