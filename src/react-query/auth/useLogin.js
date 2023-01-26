import { useMutation } from "react-query";

import { login } from "api/auth";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
export const useLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { error, mutate, isLoading } = useMutation(login, {
    onSuccess: ({ data }) => {
      let platformObj = {},
      platformIds={},
        technologyObj = {};
      data?.platforms?.map((x) => {
        platformObj[x.platform] = x.color
        platformIds[x.platform] = x._id
        return null
      });
      data?.technologies?.map((x) => (technologyObj[x.technology] = x.color));

      let payload = {
        token: data?.access_token,
        platforms: platformObj,
        platformIds : platformIds,
        technologies: technologyObj,
        user: data?.user,
      };
      dispatch({ type: "SET_USER_DATA", payload });
      history.replace("/main/projects");
    },
  });
  return { error, mutate, isLoading };
};
