import { axiosInstance } from "api/axiosInstance";

export const getBugs = (orgId, projectId, platform, pageNo) => {
  return axiosInstance
    .get(
      `/bugs/${orgId}/${projectId}?${
        platform !== "Un-categorized" ? `platform=${platform}` : ""
      }`
    )
    .then((res) => res?.data?.data);
};

export const getBugsCount = (orgId, projectId) => {
  return axiosInstance
    .get(
      `/bugs/count/${orgId}/${projectId}`
    )
    .then((res) => res?.data?.data?.bugsCount);
};

export const addBug = (orgID, projectID, data) => {
  return axiosInstance.post(`/bugs/${projectID}/${orgID}`, data);
};

export const addSection = (data) => {
  return axiosInstance.post(`/projects/section/${data.orgId}/${data.projectId}/${data.platformId}`, data.data).then((res) => res?.data?.data);
};

export const getSection = (orgId, projectId, platformId) => {
  return axiosInstance
    .get(`/projects/section/${orgId}/${projectId}/${platformId}`)
    .then((res) => res?.data?.data);
};

export const getBugActivity = (orgId, type, _id) => {
  return axiosInstance
    .get(`activities/${orgId}` , {
      params:{
        type:type !== "project" ? type : null,
        entityId:type !== "project" ? _id : null,
        project: type === "project" ? _id : null
      }
    })
    .then((res) => res?.data?.data);
};


export const bugUpdate = (data) => {
  return axiosInstance
    .patch(`/bugs/${data.orgId}/${data.bugId}`, data.data)
    .then((res) => res?.data?.data);
};
export const getSingleBug = (orgId, projectId, bugId) => {
  return axiosInstance
    .get(`/bugs/single/${orgId}/${projectId}/${bugId}`)
    .then((res) => res?.data?.data);
};

export const bugDelete = (data) => {
  return axiosInstance
    .delete(`/bugs/${data.orgId}/${data.projectId}`, { data: data.data })
    .then((res) => res?.data?.data);
};

export const bugUpdateAttachment = (data) => {
  return axiosInstance
    .patch(
      data?.remove
        ? `/bugs/remove-attachments/${data.orgId}/${data.bugId}`
        : `/bugs/add-attachments/${data.orgId}/${data.bugId}`,
      data.data
    )
    .then((res) => res?.data?.data);
};


export const getTaskRelevantBugs = ({orgId, projectId, taskId}) => axiosInstance.get(`/bugs/task/${orgId}/${projectId}/${taskId}`).then(res => res?.data?.data)