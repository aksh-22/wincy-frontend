import { createOrganisationEvent } from "api/events";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const userData = useSelector((state) => state?.userReducer?.userData?.user);

  const { mutate, isLoading } = useMutation(
    (localData) =>
      createOrganisationEvent(localData.data, orgId, localData?.type),
    {
      onSuccess: (data, localData) => {
        try {
          const { date } = localData.data;
          let month = date.split("-")[0];
          let year = date.split("-")[2];
          const previousEvents = queryClient.getQueryData([
            "events",
            orgId,
            month,
            year,
          ]);
          console.log("previousEvents" , previousEvents , date , month , year)
          if (localData.type === "private") {
            previousEvents.privateEvents.unshift({
              ...data.event,
              createdBy: [
                {
                  name: userData?.name,
                  email: userData?.email,
                  profilePicture: userData.profilePicture,
                },
              ],
            });
          } else {
            previousEvents.publicEvents.unshift({
              ...data.event,
              createdBy: [
                {
                  name: userData?.name,
                  email: userData?.email,
                  profilePicture: userData.profilePicture,
                },
              ],
            });
          }
          queryClient.setQueryData(
            ["events", orgId, month, year],
            previousEvents
          );
          localData?.handleClose && localData?.handleClose();
        } catch (err) {
          console.error(err);
        }
      },
      onError: (error) => {
        console.error("error", error);
      },
    }
  );
  return { mutate, isLoading };
};
