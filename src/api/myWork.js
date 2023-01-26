import { axiosInstance } from "api/axiosInstance";

export const getMyWorkProjects = (orgId) => {
  return axiosInstance
    .get(`/projects/mini/${orgId}`)
    .then((res) => res.data.data.projects);
};

export const getTasks = (orgId, projId, pageSize, pageNo) => {
  return axiosInstance
    .get(`/tasks/mytasks/${orgId}/${projId}`, {
      params: { pageSize: pageSize, pageNo: pageNo },
    })
    .then((res) => res.data.data.tasks);
};

export const addHours = (data) => {
  return axiosInstance.patch(`/tasks/${data.orgId}/${data.taskId}`, data.data);
};

export const getMyworkBugs = (orgId, projectId) => {
  return axiosInstance
    .get(`/bugs/mybugs/${orgId}/${projectId}`)
    .then((res) => res.data.data.bugs);
};
