import { axiosInstance } from "./axiosInstance";

export const addQuery = (data) => {
    return axiosInstance
      .post(`/queries/query/${data.orgId}/${data.projectId}`, data.data)
      .then((res) => res?.data?.data);
  };
  
  export const getQueries = (orgId , projectId , queryStatus) => {
    return axiosInstance
      .get(`/queries/query/${orgId}/${projectId}` , {
        params: {
          status : queryStatus
        }
      })
      .then((res) => res?.data?.data);
  };
  
  
  export const updateQueries = (data) => {
    return axiosInstance
      .patch(`/queries/query/${data.orgId}/${data.projectId}/${data?.queryId}`, data.data)
      .then((res) => res?.data?.data);
  };
  

  export const addQueryReply = (data) => {
    return axiosInstance
      .post(`/queries/reply/${data.orgId}/${data.projectId}/${data?.queryId}`, data.data)
      .then((res) => res?.data?.data);
  };

  export const getQueryReply = (orgId , projectId , queryId) => {
    return axiosInstance
      .get(`/queries/reply/${orgId}/${projectId}/${queryId}`)
      .then((res) => res?.data?.data);
  };
  
  export const updateQueryReply = (data) => {
    return axiosInstance
      .patch(`/queries/reply/${data.orgId}/${data.projectId}/${data?.replyId}`, data.data)
      .then((res) => res?.data?.data);
  };

  export const deleteQueries = (data) => {
    return axiosInstance
      .delete(`/queries/query/${data.orgId}/${data.projectId}`, {
          data: data.data
      })
      .then((res) => res?.data?.data);
  };

  export const deleteQueryReply = (data) => {
    return axiosInstance
      .delete(`/queries/reply/${data.orgId}/${data.projectId}`, {
          data: data.data
      })
      .then((res) => res?.data?.data);
  };