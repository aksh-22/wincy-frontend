import { axiosInstance } from "./axiosInstance";

export const getCustomerList = ({ orgId }) => {
  return axiosInstance
    .get(`/organisations/customers/${orgId}`)
    .then((res) => res?.data?.data?.customers);
};

export const createCustomer = ({ orgId, data }) => {
  return axiosInstance
    .post(`/organisations/customers/${orgId}`, data)
    .then((res) => res?.data?.data);
};

export const deleteCustomer = ({ orgId, data }) => {
  return axiosInstance
    .delete(`/organisations/customers/${orgId}`, {
      data: data,
    })
    .then((res) => res?.data?.data);
};

export const updateCustomer = ({ orgId, customerId, data }) => {
  return axiosInstance
    .patch(`/organisations/customers/${orgId}/${customerId}`, data)
    .then((res) => res?.data?.data);
};

export const getSubsidiaries = ({ orgId }) => {
  return axiosInstance
    .get(`/organisations/subsiduaries/${orgId}`)
    .then((res) => res?.data?.data?.subsiduaries);
};

export const createSubsidiaries = ({ orgId, data }) => {
  return axiosInstance
    .post(`/organisations/subsiduaries/${orgId}`, data)
    .then((res) => res?.data?.data?.subsiduary);
};

export const updateSubsidiary = ({ orgId, subsidiaryId, data }) => {
  return axiosInstance
    .patch(`/organisations/subsiduaries/${orgId}/${subsidiaryId}`, data)
    .then((res) => res?.data?.data);
};

export const deleteSubsidiary = ({ orgId, data }) => {
  return axiosInstance
    .delete(`/organisations/subsiduaries/${orgId}`, {
      data,
    })
    .then((res) => res?.data?.data);
};

export const addAccount = ({ orgId, subsidiaryId, data }) =>
  axiosInstance
    .post(`/organisations/accounts/${orgId}/${subsidiaryId}`, data)
    .then((res) => res?.data?.data);

export const getAccount = ({ orgId, subsidiaryId }) =>
  axiosInstance
    .get(`/organisations/accounts/${orgId}`, {
      params: {
        subsiduaryId: subsidiaryId,
      },
    })
    .then((res) => res?.data?.data?.accounts);

export const deleteAccount = ({ orgId, data }) =>
  axiosInstance
    .delete(`/organisations/accounts/${orgId}`, {
      data: data,
    })
    .then((res) => res?.data?.data);

export const getInvoice = ({ orgId  , financialYear , subsiduary}) =>
  axiosInstance
    .get(`/invoices/bill/${orgId}` , {
      params:{
        financialYear ,
        subsiduary 
      }
    })
    .then((res) => res?.data?.data?.invoices);

export const viewInvoice = ({ orgId, invoiceId }) =>
  axiosInstance
    .get(`/invoices/single/${orgId}/${invoiceId}`)
    .then((res) => res?.data?.data?.invoice);

export const createInvoice = ({ data, orgId, projectId, paymentPhaseId }) =>
  axiosInstance
    .post(`/invoices/bill/${orgId}/${projectId}/${paymentPhaseId}`, data)
    .then((res) => res?.data?.data);

export const getInvoiceTransaction = ({ orgId, invoiceId }) =>
  axiosInstance
    .get(`/invoices/transaction/${orgId}/${invoiceId}`)
    .then((res) => res?.data?.data?.transactions);

export const addInvoiceTransaction = ({ orgId, invoiceId ,data}) =>
  axiosInstance
    .post(`/invoices/transaction/${orgId}/${invoiceId}` , data)
    .then((res) => res?.data?.data);

export const deleteInvoice = ({ orgId, invoiceId, projectId, data }) =>
  axiosInstance
    .delete(`/invoices/bill/${orgId}/${projectId}/${invoiceId}`, {
      data,
    })
    .then((res) => res?.data?.data);

    export const updateInvoiceTransaction = ({ orgId, transactionId, data }) => axiosInstance.patch(`/invoices/transaction/${orgId}/${transactionId}` , data).then((res) => res?.data?.data)


    export const updateInvoice = ({orgId , projectId , invoiceId , data}) => axiosInstance.patch(`/invoices/bill/${orgId}/${projectId}/${invoiceId}` , data).then(res => res?.data?.data)