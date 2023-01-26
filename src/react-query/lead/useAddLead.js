import { addLead } from "api/lead";
import { useMutation, useQueryClient } from "react-query";

import { useSelector } from "react-redux";

export const useAddLead = (status) => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );

  const { mutate, isLoading } = useMutation(addLead, {
    onSuccess: ({ data } , localData) => {
      console.log(data.data.lead);
      const { onSuccess} = localData
      console.log("managedByData" , localData )
      try{
        const leads = queryClient.getQueryData(["leads", orgId, status]);
        console.log("leads" , leads)
        leads && leads.data.leads.unshift({
          ...data.data.lead,
          managedBy : localData?.data?.managedByData !== "Managed By" ? [localData?.data?.managedByData] : []
        });
        queryClient.setQueryData(["leads", orgId, status], leads);
        onSuccess && onSuccess()
      }catch(err){
        console.log("Error" , err)
      }
    },
  });

  return { mutate, isLoading };
};
