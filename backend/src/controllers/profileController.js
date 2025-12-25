import profileService from "../service/profileService.js";

const handleGetAllProfiles = async (req, res) => {
  try {
    const result = await profileService.getAllProfiles();
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errCode: -1, message: "Error from server" });
  }
};

const handleChangePassword = async (req, res) => {
  try {
    const result = await profileService.changePassword(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errCode: -1, message: "Error from server" });
  }
};

export default {
  handleGetAllProfiles,
  handleChangePassword,
};
