// backend/src/service/unitService.js
import UnitModel from "../models/unitModel.js";

export const getAllUnitsService = async () => {
  try {
    const data = await UnitModel.getAll();
    return { errCode: 0, data };
  } catch (error) {
    return { errCode: 1, data: [] };
  }
};
