import { deleteEvent } from "api/events";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { mutate: deleteEventMutate, isLoading: deleteLoading } = useMutation(
    (localData) =>
      deleteEvent(localData.data, orgId, localData.eventId, localData.type),
    {
      onSuccess: (_, localData) => {
        try {
          const { date, type, eventId, handleClose } = localData;
          let month = date.split("-")[0];
          let year = date.split("-")[1];
          const previousEvents = queryClient.getQueryData([
            "events",
            orgId,
            month,
            year,
          ]);

          if (type === "private") {
            let privateEvents = previousEvents.privateEvents.filter(
              (item) => item?._id !== eventId
            );
            previousEvents.privateEvents = privateEvents;
          } else {
            let publicEvents = previousEvents.publicEvents.filter(
              (item) => item?._id !== eventId
            );
            previousEvents.publicEvents = publicEvents;
          }
          queryClient.setQueryData(
            ["events", orgId, month, year],
            previousEvents
          );
          handleClose && handleClose();
        } catch (err) {
          console.error("Error on Delete Event", err);
        }
      },
    }
  );
  return { deleteEventMutate, deleteLoading };
};
