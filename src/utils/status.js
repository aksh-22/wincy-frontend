import moment from "moment";
export const bugStatusColor = {
  Open: "var(--skyBlue)",
  InProgress: "var(--progressBarColor)",
  InReview: "var(--primary)",
  BugPersists: "var(--red)",
  Done: "var(--green)",
};

export const bugStatus = [
  {
    label: "Open",
    value: "Open",
    menuName: "bugStatus",
    color: "var(--primary)",
  },
  {
    label: "In Progress",
    value: "InProgress",
    menuName: "bugStatus",
    color: "var(--progressBarColor)",
  },
  {
    label: "In Review",
    value: "InReview",
    menuName: "bugStatus",
    color: "#0098EB",
  },
  {
    label: "Bug Persists",
    value: "BugPersists",
    menuName: "bugStatus",
    color: "var(--red)",
  },
  {
    label: "Done",
    value: "Done",
    menuName: "bugStatus",
    color: "var(--green)",
  },
];

export const getBugStatusFunction = (currentStatus) => {
  if (currentStatus === "Open") {
    return [bugStatus[1]];
  }

  if (currentStatus === "InProgress") {
    return [bugStatus[0], bugStatus[2]];
  }

  if (currentStatus === "InReview") {
    return [bugStatus[3], bugStatus[4]];
  }

  if (currentStatus === "BugPersists") {
    return [bugStatus[1]];
  }

  if (currentStatus === "Done") {
    return [bugStatus[0]];
  }
};

export const priorityArray = [
  { label: "Low", value: "Low", menuName: "priority" },
  {
    label: "Medium",
    value: "Medium",
    menuName: "priority",
  },
  { label: "High", value: "High", menuName: "priority" },
];

export const previousDateFunction = (date) => {
  if (Math.abs(moment(date).diff(new Date(), "days")) > 3) {
    return moment(date).format("ll");
  } else {
    return moment(date).fromNow();
  }
};
