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
  createNewProfile: async (data) => {
    try {
      const isExist = await profileModel.checkProfileExist(data.TenTaiKhoan);
      if (isExist) {
        return { errCode: 1, message: "Tên đăng nhập đã tồn tại!" };
      }

      await profileModel.createNewProfile(
        data.TenTaiKhoan,
        data.MatKhau,
        data.Role
      );
      return { errCode: 0, message: "Tạo tài khoản thành công!" };
    } catch (error) {
      throw error;
    }
  },

  deleteProfile: async (profilename) => {
    try {
      const profile = await profileModel.checkProfileExist(profilename);
      if (!profile) {
        return { errCode: 2, message: "Người dùng không tồn tại" };
      }
      await profileModel.deleteProfile(profilename);
      return { errCode: 0, message: "Xóa thành công" };
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const { profilename, oldPassword, newPassword } = data;
      const profile = await profileModel.getprofileByprofilename(profilename);
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
