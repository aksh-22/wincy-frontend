import { axiosInstance } from 'api/axiosInstance';

export const updateUser = (data) => {
    console.log(data);
    return axiosInstance.patch('/users', data).then((res) => res);
};

export const permissionManager = (data, orgId) => {
    return axiosInstance
        .post(`/organisations/admin/permission/${orgId}`, data)
        .then((res) => res);
};
