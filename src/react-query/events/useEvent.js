import { getEvents } from "api/events";
import moment from "moment";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

export const useEvent = (currentMonthDate) => {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  let month = currentMonthDate.split("-")[0];
  let year = currentMonthDate.split("-")[1];
  console.log({ currentMonthDate } , month , year);
  const { isLoading, data, refetch } = useQuery(
    ["events", orgId, ('0' + month).slice(-2), year],
    () => getEvents(orgId, ('0' + month).slice(-2), year),
    {
      enabled: !!orgId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  let events = {
  };
  try {
    if (data) {
      data.privateEvents?.map((item, index) => {
        events = {
          ...events,
          [moment(item?.date).format("DD-MM-YYYY")]:
            events?.[moment(item?.date).format("DD-MM-YYYY")] ?? [],
        };
        events[moment(item?.date).format("DD-MM-YYYY")].push(item);
        return null;
      });

      data.publicEvents?.map((item, index) => {
        events = {
          ...events,
          [moment(item?.date).format("DD-MM-YYYY")]:
            events?.[moment(item?.date).format("DD-MM-YYYY")] ?? [],
        };
        events[moment(item?.date).format("DD-MM-YYYY")].push(item);
        return null;
      });
      console.log("events", events);
    }
  } catch (err) {
    console.error("Error on Use Event", err);
  }
  return { isLoading, data, refetch , events };
};
