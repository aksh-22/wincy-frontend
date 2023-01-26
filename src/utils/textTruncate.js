// export const textTruncate = (string) => {
//     if (string.length > 10) return string.substring(0, 10) + "...";
//     else return string
//   };
//   ​
export const textTruncateMore = (string, count) => {
  if (string?.length > count ?? 25) {
    return string.substring(0, count ?? 25) + "...";
  } else return string;
};

export const start_and_end = (str) => {
  if (str.length > 35) {
    return str.substr(0, 20) + "..." + str.substr(str.length - 10, str.length);
  }
  return str;
};

export const capitalizeFirstLetter = (string) => {
  try {
    let trimString = string?.trim() ?? "N/A";
    return trimString.charAt(0).toUpperCase() + trimString.slice(1);
  } catch (err) {
    console.log(err);
  }
};
