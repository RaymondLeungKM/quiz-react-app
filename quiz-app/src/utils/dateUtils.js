import moment from "moment";

export const formatISODate = (date) => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};
