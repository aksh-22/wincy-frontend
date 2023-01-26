import { deleteProject } from 'api/project';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

export const useDeleteProject = (setIsEdit) => {
  const queryClient = useQueryClient();
const history = useHistory();

  const { mutate: mutateDeleteProject, isLoading: isDeleteMutateLoading } =
    useMutation(deleteProject, {
      onMutate : (data) => {
        
      },
      onSuccess: (data, localData) => {

console.log("Delete Project Success")
localData?.handleClose && localData?.handleClose()
localData?.toggle && localData?.toggle()
history.replace('/main/projects')
      },
      onError: (err) => {
        console.log('err:', err);
      },
    });

  return { mutateDeleteProject, isDeleteMutateLoading };
};
