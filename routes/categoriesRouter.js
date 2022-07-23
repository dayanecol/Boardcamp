import { Router } from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", createCategory);

export default categoriesRouter;
