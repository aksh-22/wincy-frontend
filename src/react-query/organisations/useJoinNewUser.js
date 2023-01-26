import { useMutation } from "react-query";

import { joinOrgNewUser } from "api/organisation";
import { useHistory } from "react-router-dom";
import { useDispatch,  } from "react-redux";

export const useJoinNewUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mutate, isLoading } = useMutation(joinOrgNewUser, {
    onSuccess: (data) => {
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
        technologies: technologyObj,
        platformIds : platformIds,
        user: data?.user,
      }

      dispatch({ type: 'SET_USER_DATA', payload });
      history.push("/main/new_user");
    },
  });
  return { mutate, isLoading };
};
