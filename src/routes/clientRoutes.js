import express from "express";
const router = express.Router()
import { addClient, getClients, getClient, deleteClient } from "../controllers/clientController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addClientSchema } from "../validators/clientValidators.js";
router.use(authMiddleware);

router.post("/", validateRequest(addClientSchema), addClient )
router.get("/", getClients )
router.get("/:id", getClient )
router.delete("/:id", deleteClient )
export default router