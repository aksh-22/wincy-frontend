export const addSpaceUpperCase = (s) => {
  let ss = !s ? "N/A" : s?.replace(/([a-z])([A-Z])/g, "$1 $2");
  // console.log('sds', ss);
  return ss;
};
