import authService from "../service/authService.js";
const handleLogin = async (req, res) => {
  const { TenTaiKhoan, MatKhau } = req.body;

  try {
    const response = await authService.login(TenTaiKhoan, MatKhau);

    const { statusCode, ...data } = response;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi Server",
    });
  }
};

export default { handleLogin };
