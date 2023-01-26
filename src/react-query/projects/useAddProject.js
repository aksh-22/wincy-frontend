import { useMutation, useQueryClient } from 'react-query';

import { createProject } from 'api/project';
// import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
export const useAddProject = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createProject, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries('activeProjects');
      handleClose();
    },
  });
  return { mutate, isLoading };
};
