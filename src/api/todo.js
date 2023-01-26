import { axiosInstance } from "api/axiosInstance";
export const addTodo = (data) => {
    return axiosInstance
      .post(`/tasks/todo/${data.orgId}/${data.projectId}/${data?.taskId}`, data.data)
      .then((res) => res?.data?.data);
  };
  
  export const getTodo = (orgId , projectId , taskId) => {
    return axiosInstance
      .get(`/tasks/todo/${orgId}/${projectId}/${taskId}`)
      .then((res) => res?.data?.data);
  };

  export const updateTodo = (data) => {
    if(data?.isSort){
      return axiosInstance
      .post(`tasks/sortTodo/${data?.orgId}/${data?.taskId}`, data.data)
      .then((res) => res?.data?.data);
    }else{
      return axiosInstance
      .patch(`tasks/todo/${data?.orgId}/${data?.todoId}` , data.data)
      .then((res) => res?.data?.data);
    }
  
  };
  
  export const deleteTodo = (data) => {
    return axiosInstance
      .delete(`tasks/todo/${data?.orgId}/${data?.todoId}`)
      .then((res) => res?.data?.data);
  };
  
  