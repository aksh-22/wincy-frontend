import { useQuery } from 'react-query';

import { getOrganisations } from 'api/organisation';
import { useDispatch, useSelector } from 'react-redux';
import { useUserType } from 'hooks/useUserType';

export const useOrganisations = () => {
 
  const dispatch = useDispatch();
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );
  const { isLoading, data } = useQuery('organisations', getOrganisations, {
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  if (!isLoading && !selectedOrg?._id)
    dispatch({
      type: 'SELECTED_ORGANISATION',
      payload: data?.organisations?.[0],
    });
  return { isLoading, data };
};
