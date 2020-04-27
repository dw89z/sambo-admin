export const addCommas = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatDate = (date) => {
  if (date) {
    const yearNum = date.getFullYear();
    let monthNum = date.getMonth() + 1;
    let dayNum = date.getDate();
    let year = yearNum.toString();
    let month = monthNum.toString();
    let day = dayNum.toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    if (day.length === 1) {
      day = "0" + day;
    }
    const fulldate = `${year}${month}${day}`;
    return fulldate;
  }
};
