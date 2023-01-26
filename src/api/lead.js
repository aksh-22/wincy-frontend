import { axiosInstance } from "api/axiosInstance";
import moment from "moment";
export const addLead = (data) => {
  return axiosInstance
    .post(`/leads/new/${data.id}`, data.data)
    .then((res) => res);
};

export const getLeads = (orgId, status) => {
  if (status === "isFavourite") {
    return axiosInstance.get(`/leads/fav/${orgId}`).then((res) => res.data);
  } else {
    return axiosInstance
      .get(`/leads/lead/${orgId}?status=${status}`)
      .then((res) => res.data);
  }
};

export const getLead = (orgId, leadId) => {
  return axiosInstance
    .get(`/leads/lead/${orgId}/${leadId}`)
    .then((res) => res.data.data);
};

export const updateLead = (data) => {
  return axiosInstance
    .patch(`/leads/update/${data.orgId}/${data.leadId}`, data.data)
    .then((res) => res.data);
};

export const deleteLead = (data) => {
  return axiosInstance
    .delete(`/leads/delete/${data.orgId}/${data.leadId}`)
    .then((res) => res.data);
};

export const addActivityInLead = (data) =>
  axiosInstance
    .post(`/leads/activity/${data?.orgId}/${data?.leadId}`, data.data)
    .then((res) => res?.data?.data);

export const getActivityInLead = (orgId, leadId) =>
  axiosInstance
    .get(`/leads/activity/${orgId}/${leadId}`)
    .then((res) => res?.data?.data);

export const updateLeadActivity = (data) => {
  return axiosInstance
    .patch(`/leads/activity/${data.orgId}/${data.leadActivityId}`, data.data)
    .then((res) => res.data);
};

export const deleteLeadActivity = (data) => {
  return axiosInstance
    .delete(`/leads/activity/${data.orgId}`, {
      data: data?.data,
    })
    .then((res) => res.data);
};
export const todayFollowUpLead = (orgId) =>
  axiosInstance
    .get(`/leads/bydate/${orgId}`, {
      params: {
        date: moment(new Date()).format("MM-DD-YYYY"),
      },
    })
    .then((res) => res?.data?.data);

export const getReferenceGroup = (orgId, range) =>
  axiosInstance
    .get(`/leads/dashboard/${orgId}`, {
      params: {
        from: range?.startDate,
        to: range?.endDate,
      },
    })
    .then((res) => res?.data?.data);

export const sortLeads = (orgId, data) =>
  axiosInstance
    .patch(`/leads/sortLeads/${orgId}`, data)
    .then((res) => res?.data?.data);
