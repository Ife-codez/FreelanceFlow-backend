import {z} from 'zod'

const addClientSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

export { addClientSchema }