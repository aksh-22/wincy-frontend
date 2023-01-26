import { axiosInstance } from "api/axiosInstance";

export const getPrivateEvents = () => {
  return axiosInstance.get(`/events/private`).then((res) => res.data.data);
};

export const getEvents = (orgId, month, year) => {
  return axiosInstance
    .get(`/events/my/${orgId}?month=${month}&year=${year}`)
    .then((res) => res.data.data);
};

export const createOrganisationEvent = (data, orgId, type) => {
  return axiosInstance
    .post(`/events/${type}/${type === "public" ? orgId : ""}`, data)
    .then((res) => res.data.data);
};

export const updateEvent = (data, orgId, eventId , type) => {
  return axiosInstance
    .patch(`events/${type}/${type === "public" ? `${orgId}/${eventId}` : `${eventId}`}`, data)
    .then((res) => res.data.data);
};


export const deleteEvent = ( data , orgId, eventId , type) => {

  return axiosInstance
    .delete(`events/${type}/${type === "public" ? `${orgId}/${eventId}` : `${eventId}`}` , data)
    .then((res) => res.data.data);
};