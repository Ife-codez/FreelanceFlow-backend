import { z } from "zod";

const addProjectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  budget: z.number().positive("Budget must be a positive number"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  clientId: z.string().uuid("Invalid client ID"),
});

export { addProjectSchema };