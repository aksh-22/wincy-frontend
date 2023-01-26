import { useQuery } from "react-query";
import { userData } from "api/userData";
import { useDispatch } from "react-redux";

export const UseData = () => {
  const dispatch = useDispatch();
  const { isLoading, data } = useQuery("orgUser", userData, {
    onSuccess: (data) => {
      dispatch({
        type: "UPDATE_USER_DETAILS",
        payload: data?.user,
      });
    },
  });
  return { isLoading, data };
};
