import express from "express";
import { getMaterials } from "../database/sub-category/materialModel.js";
import { getBrands } from "../database/sub-category/brandModel.js";
import { getCategories } from "../database/category/categoryModel.js";

const categoryRouter = express.Router();

//get all active categories
categoryRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getCategories({ status: "active" });
    res.json({
      status: "success",
      message: "",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

// get all subcategories (brand/ materials)
categoryRouter.get("/sub-categories", async (req, res, next) => {
  try {
    const brands = await getBrands();
    const materials = await getMaterials();

    if (brands?.length > 0 && materials?.length > 0) {
      return res.json({
        status: "success",
        message: "",
        brands,
        materials,
      });
    }
    res.json({
      status: "error",
      message: "Couldn't resolve request, try again",
    });
  } catch (error) {
    next(error);
  }
});

export default categoryRouter;
