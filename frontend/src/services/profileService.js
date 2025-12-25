import axios from "./axios";

const profileService = {
  getAllProfiles: () => {
    return axios.get("/api/get-all-profiles");
  },
  changePassword: (data) => {
    return axios.post("/api/change-password", data);
  },
};

export default profileService;
