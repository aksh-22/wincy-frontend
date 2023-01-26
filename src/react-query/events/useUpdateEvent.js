import { updateEvent } from "api/events";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );

  const { isLoading: updateLoading, mutate: updateMutate } = useMutation(
    (localData) =>
      updateEvent(localData.data, orgId, localData?.eventId, localData?.type),
    {
      onSuccess: (_, localData) => {
        try {
          const { date } = localData?.data;
          const { handleClose, eventId, data } = localData;
          let month = date.split("-")[0];
          let year = date.split("-")[2];
          const previousEvents = queryClient.getQueryData([
            "events",
            orgId,
            month,
            year,
          ]);
          if (localData.type === "private") {
            let newPrivateEvent = previousEvents?.privateEvents?.map((item) => {
              if (item?._id === eventId) {
                return (item = {
                  ...item,
                  ...data,
                });
              } else {
                return item;
              }
            });
            previousEvents.privateEvents = newPrivateEvent;
          } else {
            let newPublicEvet = previousEvents?.publicEvents?.map((item) => {
              if (item?._id === eventId) {
                return (item = {
                  ...item,
                  ...data,
                });
              } else {
                return item;
              }
            });
            previousEvents.publicEvents = newPublicEvet;
          }
          queryClient.setQueryData(
            ["events", orgId, month, year],
            previousEvents
          );
          handleClose && handleClose();
        } catch (err) {
          console.error(err);
        }
      },
    }
  );
  return { updateLoading, updateMutate };
};
