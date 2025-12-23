import {
  getAllServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType
} from "../service/serviceTypeService.js";

const controller = {
  getAll: async (req, res) => {
    try {
      const response = await getAllServiceTypes();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const response = await createServiceType(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const response = await updateServiceType(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ errCode: 1, message: "Missing ID" });
      const response = await deleteServiceType(id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Server Error" });
    }
  }
};

export default controller;