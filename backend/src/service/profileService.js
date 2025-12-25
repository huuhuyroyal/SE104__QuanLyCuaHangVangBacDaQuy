import profileModel from "../models/profileModel.js";

const profileService = {
  getAllProfiles: async () => {
    try {
      const profiles = await profileModel.getAllProfiles();
      return { errCode: 0, data: profiles };
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const { profilename, oldPassword, newPassword } = data;
      const profile = await profileModel.getProfileByProfilename(profilename);
      if (!profile) {
        return { errCode: 2, message: "Người dùng không tồn tại" };
      }
      if (oldPassword !== profile.MatKhau) {
        return { errCode: 1, message: "Mật khẩu cũ không chính xác!" };
      }
      await profileModel.updatePassword(profilename, newPassword);
      return { errCode: 0, message: "Đổi mật khẩu thành công" };
    } catch (error) {
      throw error;
    }
  },
};

export default profileService;
