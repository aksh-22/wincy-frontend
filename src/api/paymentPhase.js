import { axiosInstance } from 'api/axiosInstance';

export const createPaymentPhase = ({ orgId, projectId, data }) =>
    axiosInstance
        .post(`/projects/payment-phase/${orgId}/${projectId}`, data)
        .then((res) => res?.data?.data?.paymentPhase);

export const updatePaymentPhaseMilestone = ({ orgId, projectId, data }) =>
    axiosInstance
        .patch(`/projects/payment-phase-milestone/${orgId}/${projectId}`, data)
        .then((res) => res?.data);

export const deletePaymentPhase = ({ orgId, projectId, data }) =>
    axiosInstance
        .delete(`/projects/payment-phase/${orgId}/${projectId}`, {
            data: data,
        })
        .then((res) => res?.data?.data);

export const getPaymentPhase = ({ orgId, projectId }) =>
    axiosInstance
        .get(`/projects/payment-phase/${orgId}/${projectId}`)
        .then((res) => res?.data?.data?.paymentPhases);

export const updatePaymentPhase = ({
    orgId,
    projectId,
    paymentPhaseId,
    data,
}) =>
    axiosInstance
        .patch(
            `/projects/payment-phase/${orgId}/${projectId}/${paymentPhaseId}`,
            data
        )
        .then((res) => res?.data?.data);

export const getPaymentPhaseLinkedInvoices = (orgId, paymentPhaseId) =>
    axiosInstance
        .get(`/projects/payment-phase/invoice/${orgId}/${paymentPhaseId}`)
        .then((res) => res?.data.data.invoices);
