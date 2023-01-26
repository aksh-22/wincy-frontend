import { axiosInstance } from "api/axiosInstance";

export const updatePlayerId = ({ orgId, playerId }) => {
  return axiosInstance
    .patch(`/notifications/user/${orgId}/${playerId}`)
    .then((res) => res?.data?.data);
};

export const getNotificationCount = ({ orgId }) => {
  return axiosInstance
    .get(`notifications/count/${orgId}`)
    .then((res) => res?.data?.data);
};

export const resetNotificationCount = ({ orgId }) => {
  return axiosInstance
    .patch(`/notifications/count/${orgId}`)
    .then((res) => res?.data?.data);
};

export const markAllRead = ({ orgId }) => {
  return axiosInstance
    .patch(`/notifications/readAll/${orgId}`)
    .then((res) => res?.data?.data);
};

export const markReadSingle = ({ orgId, notificationId }) => {
  return axiosInstance
    .patch(`/notifications/read/${orgId}/${notificationId}`)
    .then((res) => res?.data?.data);
};

export const getNotification = ({ orgId, status, pageNo, pageSize }) => {
  return axiosInstance
    .get(`/notifications/my/${orgId}`, {
      params: {
        status: status,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    })
    .then((res) => res?.data?.data);
};
