import express from "express";
const router = express.Router()
import { register, login, logout, getUser } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
router.post("/register",validateRequest(registerSchema), register )
router.post("/login", validateRequest(loginSchema), login )
router.post("/logout", logout )
router.get("/user", getUser);
export default router