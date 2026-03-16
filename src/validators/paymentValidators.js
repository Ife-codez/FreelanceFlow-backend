import { z } from "zod";

const addPaymentSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  amount: z.number().positive("Amount must be a positive number"),
  dueDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "dueDate must be a valid date e.g. 2025-02-14",
  }).transform((val) => new Date(val)), // ✅ auto converts string to Date object
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).optional(),
  projectId: z.string().uuid("Invalid project ID"),
});

export { addPaymentSchema };