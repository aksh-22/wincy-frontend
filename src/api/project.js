import { axiosInstance } from "api/axiosInstance";

export const getProjects = (orgId, status, projectType) => {
  return axiosInstance
    .get(`/projects/${orgId}`, {
      params: {
        status,
        projectType,
      },
    })
    .then((res) => res.data?.data);
};

export const createProject = (data) => {
  return axiosInstance
    .post(`/projects/${data.orgId}`, data.data)
    .then((res) => res.data);
};

export const addMilestoneApi = (data) => {
  return axiosInstance
    .post(`/tasks/milestone/${data.orgId}/${data.projectId}`, data.data)
    .then((res) => res.data?.data);
};

export const getProjectMilestones = (orgId, projectId) => {
  return axiosInstance
    .get(`/tasks/milestones/${orgId}/${projectId}`)
    .then((res) => res.data?.data);
};
export const updateMilestone = (data) => {
  return axiosInstance.patch(
    `/tasks/milestone/${data.orgId}/${data.projectId}/${data.milestoneId}`,
    data.data
  );
};

export const getProjectTask = ({ orgId, projectId }) =>
  axiosInstance
    .get(`/tasks/project/${orgId}/${projectId}`)
    .then((res) => res.data?.data);

export const getProjectInfo = (orgId, projectId) => {
  return axiosInstance
    .get(`/projects/single/${orgId}/${projectId}`)
    .then((res) => res?.data?.data);
};

export const deleteTask = (data) => {
  return axiosInstance.delete(`/tasks/${data.orgId}/${data.projectId}`, {
    data: data?.data,
  });
};

export const updateProject = (data) => {
  return axiosInstance.patch(
    `/projects/${data.orgId}/${data.projectId}`,
    data.formData
  );
};

export const assignProject = (data) => {
  return axiosInstance.patch(
    `/projects/assign/${data.orgId}/${data.projectId}`,
    data.data
  );
};

export const deleteProject = (data) => {
  return axiosInstance.delete(`/projects/${data.orgId}/${data.projectId}`, {});
};

export const getProjectAttachment = (orgId, projectId) => {
  return axiosInstance
    .get(`/projects/attachments/${orgId}/${projectId}`)
    .then((res) => res?.data?.data);
};

export const addProjectAttachment = (data) => {
  return axiosInstance
    .post(`/projects/attachments/${data.orgId}/${data.projectId}`, data.data)
    .then((res) => res?.data?.data);
};

export const updateProjectAttachment = (data) => {
  return axiosInstance
    .patch(
      `/projects/attachments/${data.orgId}/${data.projectId}/${data?.attachmentId}`,
      data.data
    )
    .then((res) => res?.data?.data);
};

export const deleteProjectAttachment = (data) => {
  return axiosInstance.delete(
    `/projects/attachments/${data.orgId}/${data.projectId}`,
    {
      data: data.data,
    }
  );
};

export const addCredentials = (data) => {
  return axiosInstance
    .patch(`/projects/credentials/${data.orgId}/${data.projectId}`, data.data)
    .then((res) => res?.data?.data);
};
