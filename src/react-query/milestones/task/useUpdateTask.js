import { useMutation, useQueryClient } from 'react-query';

import { updateTask, updateTaskDescription } from 'api/milestone';
import { jsonParser } from 'utils/jsonParser';

export const useUpdateTask = (handleClose, isDescription) => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        isDescription ? updateTaskDescription : updateTask,
        {
            onMutate: async (localData) => {
                try {
                    const { milestoneId, orgId, parentId } = localData;
                    await queryClient.cancelQueries([
                        'tasks',
                        orgId,
                        milestoneId,
                    ]);

                    if (parentId) {
                        let temp = subTaskUpdateLogic({
                            localData,
                            queryClient,
                        });

                        return temp;
                    } else {
                        let temp = taskUpdateLogic({
                            localData,
                            queryClient,
                        });

                        return temp;
                    }
                } catch (err) {
                    console.error('Error on Task Update', err);
                }
            },

            onSuccess: async (newData, localData, context) => {
                const { previousTasksCopy, previousSubTaskCopy } = context;
                const { milestoneId, orgId, taskId, moduleId, parentId } =
                    localData;
                try {
                    if (isDescription) {
                        return;
                    }
                    if (parentId) {
                        for (
                            let i = 0;
                            previousSubTaskCopy?.tasks.length;
                            i++
                        ) {
                            if (previousSubTaskCopy?.tasks[i]?._id === taskId) {
                                previousSubTaskCopy.tasks[i] = {
                                    ...previousSubTaskCopy?.tasks[i],
                                    ...newData?.task,
                                };
                                break;
                            }
                        }
                        queryClient.setQueryData(
                            ['subTask', orgId, milestoneId, parentId],
                            previousSubTaskCopy
                        );
                    } else {
                        for (let i = 0; previousTasksCopy.length; i++) {
                            if (previousTasksCopy[i]?._id[0] === moduleId) {
                                let tasks = previousTasksCopy[i]?.tasks;
                                for (let j = 0; j < tasks?.length; j++) {
                                    if (tasks[j]?._id === taskId) {
                                        tasks[j] = {
                                            ...tasks[j],
                                            ...newData?.task,
                                        };
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        // TODO: Uncomment this code
                        queryClient.setQueryData(
                            ['tasks', orgId, milestoneId],
                            [...previousTasksCopy]
                        );
                    }
                } catch (Err) {
                    console.error(Err);
                }
            },

            onError: (err, localData, context) => {
                console.error(err);
                const {
                    previousTasks,
                    prevMilestones,
                    previousProject,
                    previousSubTask,
                } = context;
                const {
                    milestoneId,
                    orgId,
                    projectId,
                    assigneesStatus,
                    parentId,
                } = localData;
                if (parentId) {
                    queryClient.setQueryData(
                        ['subTask', orgId, milestoneId, parentId],
                        previousSubTask
                    );
                } else {
                    queryClient.setQueryData(
                        ['tasks', orgId, milestoneId],
                        previousTasks
                    );
                    if (assigneesStatus && projectId) {
                        queryClient.setQueryData(
                            ['projectInfo', orgId, projectId],
                            {
                                ...previousProject,
                            }
                        );

                        queryClient.setQueriesData(
                            ['milestones', orgId, projectId],
                            prevMilestones
                        );
                    }
                }
            },
        }
    );

    return { mutate, isLoading };
};

const subTaskUpdateLogic = ({ queryClient, localData }) => {
    const {
        milestoneId,
        orgId,
        data,
        taskId,
        moduleId,
        assigneesStatus,
        projectId,
        updateTaskStatus,
        parentId,
    } = localData;
    const { assigneeUpdate, assigneeData } = data;
    let previousSubTask = queryClient?.getQueryData([
        'subTask',
        orgId,
        milestoneId,
        parentId,
    ]);
    const previousSubTaskCopy = jsonParser(previousSubTask);
    let tasks = previousSubTaskCopy?.tasks;
    let status = {
        NotStarted: 0,
        Active: 0,
        Completed: 0,
    };
    let tempStatus = '';
    let prevStatus = '';
    for (let j = 0; tasks?.length; j++) {
        if (tasks[j]?._id === taskId) {
            if (assigneeUpdate) {
                tasks[j] = {
                    ...tasks[j],
                    assignees: assigneeData,
                };
            } else if (assigneesStatus) {
                !['WaitingForReview', 'UnderReview', 'ReviewFailed'].includes(
                    updateTaskStatus
                ) &&
                    (tasks[j] = {
                        ...tasks[j],
                        assigneesStatus,
                    });
                assigneesStatus?.map((item) => {
                    if (item?.status === 'NotStarted') {
                        status.NotStarted = +1;
                    }

                    if (item?.status === 'Active') {
                        status.Active = +1;
                    }

                    if (item?.status === 'Completed') {
                        status.Completed = +1;
                    }
                    return null;
                });
                prevStatus = tasks[j].status;

                if (
                    status.Active > 0 ||
                    (status.Completed > 0 &&
                        status.Completed &&
                        tasks[j]?.assigneesStatus?.length)
                ) {
                    tasks[j].status = 'Active';
                    tempStatus = 'Active';
                }

                if (status.Completed === tasks[j]?.assigneesStatus?.length) {
                    tasks[j].status = 'WaitingForReview';
                    tempStatus = 'WaitingForReview';
                }
                if (
                    status.NotStarted === tasks[j]?.assigneesStatus?.length ||
                    (status.NotStarted > 0 &&
                        status.Completed === 0 &&
                        status.Active === 0 &&
                        status.NotStarted &&
                        tasks[j]?.assigneesStatus?.length)
                ) {
                    tasks[j].status = 'NotStarted';
                    tempStatus = 'NotStarted';
                }
            } else if (updateTaskStatus) {
                prevStatus = tasks[j].status;
                let tempAssigneesStatus = tasks[j]?.assigneesStatus?.map(
                    (item) => {
                        item.status = updateTaskStatus;
                        return item;
                    }
                );
                tasks[j] = {
                    ...tasks[j],
                    ...data,
                    assigneesStatus: tempAssigneesStatus,
                };

                tasks[j]?.assigneesStatus?.map((item) => {
                    if (item?.status === 'NotStarted') {
                        status.NotStarted = +1;
                    }

                    if (item?.status === 'Active') {
                        status.Active = +1;
                    }

                    if (item?.status === 'Completed') {
                        status.Completed = +1;
                    }
                    return null;
                });

                if (
                    [
                        'WaitingForReview',
                        'UnderReview',
                        'ReviewFailed',
                    ].includes(updateTaskStatus)
                ) {
                    tempStatus = updateTaskStatus;
                }

                if (
                    status.Active > 0 ||
                    (status.Completed > 0 &&
                        status.Completed &&
                        tasks[j]?.assigneesStatus?.length)
                ) {
                    tempStatus = 'Active';
                }

                if (status.Completed === tasks[j]?.assigneesStatus?.length) {
                    // tasks[j].status = "Completed";
                    tempStatus = 'Completed';
                }
                if (
                    status.NotStarted === tasks[j]?.assigneesStatus?.length ||
                    (status.NotStarted > 0 &&
                        status.Completed === 0 &&
                        status.Active === 0 &&
                        status.NotStarted &&
                        tasks[j]?.assigneesStatus?.length)
                ) {
                    // tasks[j].status = "NotStarted";
                    tempStatus = 'NotStarted';
                }
                if (!tasks[j]?.assigneesStatus?.length) {
                    tempStatus = data?.status;
                }
            } else {
                tasks[j] = {
                    ...tasks[j],
                    ...data,
                    descriptionUpdatedAt: data?.description
                        ? new Date()
                        : tasks[j]?.descriptionUpdatedAt,
                };
            }
            break;
        }
    }

    queryClient.setQueryData(['subTask', orgId, milestoneId, parentId], {
        ...previousSubTaskCopy,
        tasks,
    });

    return {
        previousSubTaskCopy: {
            ...previousSubTaskCopy,
            tasks,
        },
        previousSubTask,
    };
};

const taskUpdateLogic = ({ queryClient, localData }) => {
    const {
        milestoneId,
        orgId,
        data,
        taskId,
        moduleId,
        assigneesStatus,
        projectId,
        updateTaskStatus,
    } = localData;
    const { assigneeUpdate, assigneeData } = data;

    const previousTasks = queryClient.getQueryData([
        'tasks',
        orgId,
        milestoneId,
    ]);
    let status = {
        NotStarted: 0,
        Active: 0,
        Completed: 0,
    };
    let tempStatus = '';
    let prevStatus = '';
    const previousTasksCopy = jsonParser(previousTasks);
    for (let i = 0; previousTasksCopy.length; i++) {
        if (previousTasksCopy[i]?._id[0] === moduleId) {
            let tasks = previousTasksCopy[i]?.tasks;
            console.log({ data });
            for (let j = 0; j < tasks?.length; j++) {
                if (tasks[j]?._id === taskId) {
                    if (assigneeUpdate) {
                        tasks[j] = {
                            ...tasks[j],
                            assignees: assigneeData,
                        };
                    } else if (assigneesStatus) {
                        ![
                            'WaitingForReview',
                            'UnderReview',
                            'ReviewFailed',
                        ].includes(updateTaskStatus) &&
                            (tasks[j] = {
                                ...tasks[j],
                                assigneesStatus,
                            });
                        assigneesStatus?.map((item) => {
                            if (item?.status === 'NotStarted') {
                                status.NotStarted = +1;
                            }

                            if (item?.status === 'Active') {
                                status.Active = +1;
                            }

                            if (item?.status === 'Completed') {
                                status.Completed = +1;
                            }
                            return null;
                        });
                        prevStatus = tasks[j].status;

                        if (
                            status.Active > 0 ||
                            (status.Completed > 0 &&
                                status.Completed &&
                                tasks[j]?.assigneesStatus?.length)
                        ) {
                            tasks[j].status = 'Active';
                            tempStatus = 'Active';
                        }

                        if (
                            status.Completed ===
                            tasks[j]?.assigneesStatus?.length
                        ) {
                            tasks[j].status = 'WaitingForReview';
                            tempStatus = 'WaitingForReview';
                        }
                        if (
                            status.NotStarted ===
                                tasks[j]?.assigneesStatus?.length ||
                            (status.NotStarted > 0 &&
                                status.Completed === 0 &&
                                status.Active === 0 &&
                                status.NotStarted &&
                                tasks[j]?.assigneesStatus?.length)
                        ) {
                            tasks[j].status = 'NotStarted';
                            tempStatus = 'NotStarted';
                        }
                    } else if (updateTaskStatus) {
                        prevStatus = tasks[j].status;
                        let tempAssigneesStatus = tasks[
                            j
                        ]?.assigneesStatus?.map((item) => {
                            item.status = updateTaskStatus;
                            return item;
                        });
                        tasks[j] = {
                            ...tasks[j],
                            ...data,
                            assigneesStatus: tempAssigneesStatus,
                        };

                        tasks[j]?.assigneesStatus?.map((item) => {
                            if (item?.status === 'NotStarted') {
                                status.NotStarted = +1;
                            }

                            if (item?.status === 'Active') {
                                status.Active = +1;
                            }

                            if (item?.status === 'Completed') {
                                status.Completed = +1;
                            }
                            return null;
                        });

                        if (
                            [
                                'WaitingForReview',
                                'UnderReview',
                                'ReviewFailed',
                            ].includes(updateTaskStatus)
                        ) {
                            tempStatus = updateTaskStatus;
                        }

                        if (
                            status.Active > 0 ||
                            (status.Completed > 0 &&
                                status.Completed &&
                                tasks[j]?.assigneesStatus?.length)
                        ) {
                            tempStatus = 'Active';
                        }

                        if (
                            status.Completed ===
                            tasks[j]?.assigneesStatus?.length
                        ) {
                            // tasks[j].status = "Completed";
                            tempStatus = 'Completed';
                        }
                        if (
                            status.NotStarted ===
                                tasks[j]?.assigneesStatus?.length ||
                            (status.NotStarted > 0 &&
                                status.Completed === 0 &&
                                status.Active === 0 &&
                                status.NotStarted &&
                                tasks[j]?.assigneesStatus?.length)
                        ) {
                            // tasks[j].status = "NotStarted";
                            tempStatus = 'NotStarted';
                        }
                        if (!tasks[j]?.assigneesStatus?.length) {
                            tempStatus = data?.status;
                        }
                    } else {
                        tasks[j] = {
                            ...tasks[j],
                            ...data,
                            descriptionUpdatedAt: data?.description
                                ? new Date()
                                : tasks[j]?.descriptionUpdatedAt,
                        };
                    }
                    break;
                }
            }
            break;
        }
    }

    const prevMilestones = queryClient.getQueryData([
        'milestones',
        orgId,
        projectId,
    ]);
    const previousProject = queryClient.getQueryData([
        'projectInfo',
        orgId,
        projectId,
    ]);
    if (prevMilestones) {
        const previousProjectCopy = jsonParser(previousProject);
        if (tempStatus === 'Completed' && prevStatus !== 'Completed') {
            previousProjectCopy.tasksCount = {
                ...previousProjectCopy.tasksCount,
                completedTasks:
                    (previousProjectCopy?.tasksCount?.completedTasks ?? 0) + 1,
            };
        }
        if (
            ['Active', 'NotStarted'].includes(tempStatus) &&
            prevStatus === 'Completed'
        ) {
            previousProjectCopy.tasksCount = {
                ...previousProjectCopy.tasksCount,
                completedTasks:
                    (previousProjectCopy?.tasksCount?.completedTasks ?? 0) - 1,
            };
        }

        queryClient.setQueryData(['projectInfo', orgId, projectId], {
            ...previousProjectCopy,
        });

        let prevMilestonesCopy = jsonParser(prevMilestones);
        let milestones = prevMilestonesCopy?.milestones;
        for (let i = 0; i < milestones?.length; i++) {
            if (milestones[i]?._id === milestoneId) {
                if (tempStatus === prevStatus || !tempStatus) {
                    // console.debug("Not Do anything" , prevStatus , tempStatus)
                } else if (milestones[i].taskCount) {
                    milestones[i].taskCount = {
                        ...milestones[i].taskCount,
                        [prevStatus]: milestones[i].taskCount?.[prevStatus] - 1,
                        [tempStatus]:
                            (milestones[i].taskCount?.[tempStatus] ?? 0) + 1,
                    };
                } else {
                    milestones[i].taskCount = {
                        [tempStatus]: 1,
                    };
                }

                //  Milestone status Update
                const {
                    Active,
                    NotStarted,
                    Completed,
                    WaitingForReview,
                    UnderReview,
                    ReviewFailed,
                } = milestones[i].taskCount;
                let taskCount =
                    (Active ?? 0) +
                    (NotStarted ?? 0) +
                    (Completed ?? 0) +
                    (WaitingForReview ?? 0) +
                    (UnderReview ?? 0) +
                    (ReviewFailed ?? 0);
                if (
                    Active > 0 ||
                    WaitingForReview > 0 ||
                    UnderReview > 0 ||
                    ReviewFailed > 0 ||
                    (Completed > 0 && Completed && taskCount)
                ) {
                    milestones[i].status = 'Active';
                }

                if (Completed === taskCount) {
                    milestones[i].status = 'Completed';
                }
                if (
                    NotStarted === taskCount ||
                    (NotStarted > 0 &&
                        Completed === 0 &&
                        Active === 0 &&
                        NotStarted &&
                        taskCount)
                ) {
                    milestones[i].status = 'NotStarted';
                }
                // End

                break;
            }
        }

        queryClient.setQueriesData(
            ['milestones', orgId, projectId],
            prevMilestonesCopy
        );
    }
    queryClient.setQueryData(
        ['tasks', orgId, milestoneId],
        [...previousTasksCopy]
    );

    return {
        previousTasks,
        previousTasksCopy,
        previousProject,
        prevMilestones,
    };
};
