import express from "express";
const router = express.Router()
import { addProject, getProjects, getProject, deleteProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addProjectSchema } from "../validators/projectValidators.js";
router.use(authMiddleware);

router.post("/",validateRequest(addProjectSchema), addProject )
router.get("/", getProjects )
router.get("/:id", getProject )
router.delete("/:id", deleteProject )
export default router