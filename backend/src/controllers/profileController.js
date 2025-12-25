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

const handleCreateProfile = async (req, res) => {
  try {
    if (!req.body.TenTaiKhoan || !req.body.MatKhau || !req.body.Role) {
      return res
        .status(200)
        .json({ errCode: 1, message: "Missing required params" });
    }
    const result = await profileService.createNewProfile(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errCode: -1, message: "Error from server" });
  }
};

const handleDeleteProfile = async (req, res) => {
  try {
    if (!req.body.profilename) {
      return res
        .status(200)
        .json({ errCode: 1, message: "Missing profilename" });
    }
    const result = await profileService.deleteProfile(req.body.profilename);
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
  handleCreateProfile,
  handleDeleteProfile,
  handleChangePassword,
};
