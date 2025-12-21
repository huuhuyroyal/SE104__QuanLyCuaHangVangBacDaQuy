import axios from "./axios";

const getAllUnits = () => {
  return axios.get("/api/units");
};

export default { getAllUnits };
