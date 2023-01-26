import { deleteInvoice } from "api/invoice";
import { InvoiceFilterContext } from "context/invoiceFilterContext";
import { convertFinancialYearToString } from "pages/invoice/FilterInInvoice";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { jsonParser } from "utils/jsonParser";

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { filter } = useContext(InvoiceFilterContext);
  const { goBack } = useHistory();
  let financialYear = filter?.financialYear
    ? convertFinancialYearToString(filter?.financialYear)
    : null;
  console.log({ filter });
  return useMutation(deleteInvoice, {
    onMutate: (localData) => {
      // queryClient.setQueryData(["lead", orgId, leadId], data);
    },
    onSuccess: (data, localData) => {
      try {
        const { handleClose, orgId, invoiceId } = localData;
        const tempInvoice = queryClient.getQueryData([
          "invoice",
          orgId,
          financialYear,
          filter?.subsiduary,
        ]);
        const tempInvoiceCopy = jsonParser(tempInvoice);
        console.log({ tempInvoice });
        const temp = tempInvoice.filter((el) => el?._id !== invoiceId);
        console.log({ temp });
        queryClient.setQueryData(
          ["invoice", orgId, financialYear, filter?.subsiduary],
          temp
        );
        handleClose && handleClose();
        goBack && goBack();
        return { tempInvoiceCopy };
      } catch (error) {
        console.log({ error });
      }
    },
    onError: (_, localData, context) => {
      const { orgId } = localData;
      queryClient.setQueryData(
        ["invoice", orgId, financialYear, filter?.subsiduary],
        context?.tempInvoiceCopy
      );
    },
  });
};
