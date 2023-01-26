import moment from "moment";

export const dateCondition = (date, format) => {
  return date?.includes("T")
    ? moment(date).format(format ?? "DD-MM-YYYY")
    : moment(date, "MM-DD-YYYY").format(format ?? "DD-MM-YYYY");
};
