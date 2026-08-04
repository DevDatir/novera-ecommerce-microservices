import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  addressLine1: z.string().min(5),

  addressLine2: z.string(),

  city: z.string().min(2),

  state: z.string().min(2),

  postalCode: z.string().regex(/^\d{6}$/),

  country: z.string().min(2),

  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;