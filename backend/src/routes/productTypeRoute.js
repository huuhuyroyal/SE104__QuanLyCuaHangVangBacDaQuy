import express from "express";
import { 
  getAllTypesService, 
  createTypeService, 
  updateTypeService, 
  deleteTypeService 
} from "../service/productTypeService.js";

const router = express.Router();

const initProductTypeRoute = (app) => {
  // 1. GET ALL
  router.get("/api/product-types", async (req, res) => {
    try {
      const response = await getAllTypesService();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  });

  // 2. CREATE
  router.post("/api/product-types/create", async (req, res) => {
    try {
      const response = await createTypeService(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  });

  // 3. UPDATE
  router.post("/api/product-types/update", async (req, res) => {
    try {
      const response = await updateTypeService(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  });

  // 4. DELETE
  router.post("/api/product-types/delete", async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ errCode: 1, message: "Thiếu ID!" });
      
      const response = await deleteTypeService(id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ errCode: -1, message: "Lỗi Server" });
    }
  });

  return app.use("/", router);
};

export default initProductTypeRoute;