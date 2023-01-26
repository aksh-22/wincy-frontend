export const appendCountOnString = (array, string, number , oldString) => {
    let checkDublicasy = array.filter(
      (item) => item?.title?.toLowerCase() === string.toLocaleLowerCase()
    );

    if (checkDublicasy.length) {
      return  appendCountOnString(array, `${oldString}(${number+1})`, number+1 , oldString);
    } else {
      return number === 0 ? string : `${oldString}(${number})`;
    }
  };