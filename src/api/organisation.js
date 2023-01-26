import { axiosInstance } from 'api/axiosInstance';

export const addOrganisation = (data) => {
    return axiosInstance.post(`/organisations`, data);
};
export const getOrganisations = () => {
    return axiosInstance.get(`/organisations`).then((res) => res.data?.data);
};

export const updateOrg = (data) => {
    return axiosInstance.patch(`/organisations/${data.orgId}`, data.data);
};
export const getOrgUsers = (orgID, projectID) => {
    return axiosInstance
        .get(`/projects/users/${orgID}/${projectID}`)
        .then((res) => res?.data?.data);
};

export const getInvitedOrgUsers = (orgID) => {
    return axiosInstance
        .get(`/organisations/invitations/${orgID}`)
        .then((res) => res?.data.data);
};

export const getOrgTeam = (orgID) => {
    return axiosInstance
        .get(`/organisations/team/${orgID}`)
        .then((res) => res?.data.data);
};

export const sendInvitation = (data) => {
    return axiosInstance.post(`/organisations/${data.orgId}`, data.data);
};

export const revokeInvite = (data) => {
    return axiosInstance.delete(`/organisations/invitation/${data.orgId}`, {
        data: data.data,
    });
};

export const removeOrgUser = (data) => {
    return axiosInstance.delete(
        `/organisations/user/${data.orgId}/${data.userId}`
    );
};

export const joinOrgExistedUser = (token) => {
    return axiosInstance.get(`/organisations/join/${token}`);
};

export const joinOrgNewUser = (data) => {
    console.log('apipage', data);
    return axiosInstance
        .post(`/users/${data.token}`, data.data)
        .then((res) => res.data?.data);
};

export const editRoleAndDesignation = (data) => {
    return axiosInstance.patch(
        `/organisations/roles/${data.orgId}/${data.userId}`,
        data.data
    );
};

export const deleteOrganisation = (data) => {
    return axiosInstance.delete(`/organisations/${data?.orgId}`);
};
