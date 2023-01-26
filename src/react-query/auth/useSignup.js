import { useMutation } from 'react-query';

import { signup } from 'api/auth';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
export const useSignup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mutate, isLoading } = useMutation(signup, {
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
        technologies: technologyObj,
        user: data?.user,
        platformIds : platformIds,
      };

      dispatch({ type: 'SET_USER_DATA', payload });
      history.push('/main');
    },
  });
  return { mutate, isLoading };
};
