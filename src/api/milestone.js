import { axiosInstance } from "api/axiosInstance";
import axios from "axios";

const CancelToken = axios.CancelToken;
let taskCancelToken = null;

export const getMilestoneModuleList = (orgId, milestoneId) => {
  return axiosInstance
    .get(`/tasks/module/${orgId}/${milestoneId}`)
    .then((res) => res?.data?.data);
};

export const createMilestoneModule = (data) => {
  return axiosInstance
    .post(
      `/tasks/module/${data.orgId}/${data.projectId}/${data.milestoneId}`,
      data.data
    )
    .then((res) => res.data.data);
};

export const updateMilestoneModule = (data) => {
  return axiosInstance
    .patch(`/tasks/module/${data.orgId}/${data.moduleId}`, data.data)
    .then((res) => res.data.data);
};
export const deleteModule = (data) => {
  return axiosInstance
    .delete(`/tasks/module/${data?.orgId}/${data?.projectId}`, {
      data: data?.data,
    })
    .then((res) => res?.data?.data);
};

export const getMilestoneTask = (orgId, milestoneId) =>
  axiosInstance
    .get(`/tasks/${orgId}/${milestoneId}`)
    .then((res) => res?.data?.data);

export const getSubTasks = ({ orgId, milestoneId, taskId }) =>
  axiosInstance
    .get(`/tasks/${orgId}/${milestoneId}/sub-task/${taskId}`)
    .then((res) => res?.data?.data);

export const getMilestoneInfo = (orgId, projectId, milestoneId) => {
  return axiosInstance
    .get(`/tasks/milestone/${orgId}/${projectId}/${milestoneId}`)
    .then((res) => res?.data?.data);
};

export const addTask = (data) => {
  return axiosInstance
    .post(
      `/tasks/task/${data.orgId}/${data.projectId}/${data.milestoneId}`,
      data.data
    )
    .then((res) => res?.data?.data);
};

export const updateTaskDescription = (data) => {
  if (taskCancelToken !== null) {
    taskCancelToken();
  }
  return axiosInstance
    .patch(`/tasks/description/${data.orgId}/${data.taskId}`, data.data, {
      cancelToken: new CancelToken((e) => {
        taskCancelToken = e;
      }),
    })
    .then((res) => res?.data?.data);
};

export const updateTask = (data) => {
  if (taskCancelToken !== null) {
    taskCancelToken();
  }
  return axiosInstance
    .patch(`/tasks/${data.orgId}/${data.taskId}`, data.data, {
      cancelToken: new CancelToken((e) => {
        taskCancelToken = e;
      }),
    })
    .then((res) => res?.data?.data);
};

export const updateMultipleTask = (data) => {
  return axiosInstance
    .patch(`/tasks/multi/${data.orgId}/${data.projectId}`, data.data)
    .then((res) => res?.data?.data);
};

export const moveTo = (data) => {
  return axiosInstance
    .patch(`/tasks/move/tasks/${data?.orgId}`, data.data)
    .then((res) => res?.data?.data);
};

export const copyTo = (data) => {
  return axiosInstance
    .patch(`/tasks/copy/tasks/${data?.orgId}`, data.data)
    .then((res) => res?.data?.data);
};

export const moduleMoveTo = (data) => {
  return axiosInstance
    .patch(
      `/tasks/move/modules/${data?.orgId}/${data?.toMilestoneId}`,
      data.data
    )
    .then((res) => res?.data?.data);
};

export const sortTask = (data) => {
  return axiosInstance.patch(
    `/tasks/sortTasks/${data?.orgId}/${data?.milestoneId}`,
    data?.data
  );
};

export const sortModule = (data) => {
  return axiosInstance.patch(
    `/tasks/sortModules/${data?.orgId}/${data?.milestoneId}`,
    data?.data
  );
};

export const sortMilestone = (data) => {
  return axiosInstance.patch(
    `/tasks/sortMilestones/${data?.orgId}/${data?.projectId}`,
    data?.data
  );
};

export const taskAttachment = (data) => {
  return axiosInstance
    .patch(`/tasks/attachments/${data?.orgId}/${data?.taskId}`, data?.data)
    .then((res) => res?.data?.data);
};

// export const createSubTask = (data) => {
//     return axiosInstance.post(
//         `/tasks/subtask/${data?.subtaskId}`, data.data
//     ).then((res) => res?.data?.data);
// };

// export const updateSubTask = (data) => {
//    return axiosInstance.patch(
//         `/tasks/subtask/${data?.taskId}/${data?.subtaskId}`, data.data
//     ).then((res) => res?.data?.data);
// };

// export const subTasksDelete = (data) => {
//     console.log(data)
//     return axiosInstance.delete(
//          `/tasks/subtask/${data?.orgId}/${data?.taskId}`, {
//              data : data.data
//          }
//      ).then((res) => res?.data?.data);
//  };

//  export const markMultipleSubTask = (data) => {
//     return axiosInstance.patch(
//          `/tasks/${data?.taskId}`, data.data
//      ).then((res) => res?.data?.data);
//  };

export const deleteMilestone = (data) => {
  return axiosInstance
    .delete(`/tasks/milestone/${data?.orgId}/${data?.milestoneId}`, {})
    .then((res) => res?.data?.data);
};
