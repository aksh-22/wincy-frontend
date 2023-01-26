import { useQuery } from "react-query";

import { joinOrgExistedUser } from "api/organisation";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogout } from "react-query/auth/useLogout";

export const useJoinExistUser = (token) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading: logoutLoading, mutate } = useLogout();

  const userId = useSelector(
    (state) => state?.userReducer?.userData?.user?._id
  );
  // const user = useSelector((state) => state.userReducer);
  console.log(userId);

  const { isLoading, data, isError, isSuccess } = useQuery(
    ["organisationExistJoinUsers", token],
    () => joinOrgExistedUser(token),
    {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }) => {
        console.log(data);
        if (data?.data?.userId === userId) {
          console.log("exist");
          dispatch({
            type: "UPDATE_USER_TYPE",
            payload: data?.data?.user,
          });
          dispatch({
            type: "SELECTED_ORGANISATION",
            payload: data?.data?.user?.organisation,
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
      },
      onError: () => {
        setTimeout(() => {
          history.replace("/home");
        }, 3000);
      },
    }
  );

  return { isLoading, data, isError, isSuccess };
};
