import { useMutation, useQueryClient } from 'react-query';

import { bugDelete } from 'api/bugs.service';
import { useSelector } from 'react-redux';

export const useBugDelete = (
) => {
    const queryClient = useQueryClient();

    const { mutate: mutateDeleteBug, isLoading: isDeleteBugLoading } =
        useMutation(bugDelete, {
            onMutate: async (localData) => {
                let newBug = []
                try {
                    let previousBugs = []
                    localData?.platforms?.map((platform) => {
                        let bug = queryClient.getQueryData(['bugs', localData?.orgId, localData?.projectId, platform?.name ?? 'un-categorizes', 1])
                        previousBugs.push({
                            bug: bug,
                            platform: platform?.name ?? 'un-categorizes'
                        })
                    })

                    let newArray = []
                    previousBugs?.map((item) => {
                        if (item?.bug?.bugs !== undefined) {
                            newArray = item?.bug?.bugs?.filter((bugs) => !localData?.data?.bugs?.includes(bugs?._id))
                            newBug.push({
                                bugs: newArray,
                                platform: item?.platform,
                                count: item?.count
                            })

                        } else {
                            newBug.push(undefined)
                        }
                        return null
                    })

                    // console.log({previousBugs} , {newBug} )
                } catch (err) {
                    console.log('err:', err);
                }
                return { newBug }
            },

            onSuccess: (data, localData, context) => {
                context?.newBug?.map((item, index) => (
                    queryClient.setQueriesData(['bugs', localData?.orgId, localData?.projectId, item?.platform, 1], item)
                ))

                localData?.handleClose && localData?.handleClose()
                localData?.onToggle && localData?.onToggle()
            },

        });

    return { mutateDeleteBug, isDeleteBugLoading };
};
