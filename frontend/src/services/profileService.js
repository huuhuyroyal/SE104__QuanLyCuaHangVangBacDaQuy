import axios from "./axios";

const profileService = {
  getAllProfiles: () => {
    return axios.get("/api/get-all-profiles");
  },
  createProfile: (data) => {
    return axios.post("/api/create-profile", data);
  },
  deleteProfile: (profilename) => {
    return axios.post("/api/delete-profile", {
      profilename: profilename,
    });
  },
  changePassword: (data) => {
    return axios.post("/api/change-password", data);
  },
};

export default profileService;
