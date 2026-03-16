import express from "express";
const router = express.Router()
import { addPayment, getPayments, getPayment, deletePayment } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addPaymentSchema } from "../validators/paymentValidators.js";
router.use(authMiddleware);

router.post("/",validateRequest(addPaymentSchema), addPayment )
router.get("/", getPayments )
router.get("/:id", getPayment )
router.delete("/:id", deletePayment )
export default router