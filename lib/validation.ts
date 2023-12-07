import * as z from "zod";

export const EmployeeSchema = z.object({
    email: z.string().max(100),
    first_name: z.string().max(100),
    last_name: z.string().max(100),
    avatar_url: z.string(),
    // role: z.string().max(100),
    // salary: z.coerce.number().min(0).refine(value => !isNaN(value), {
    //     message: "Salary must be a valid number",
    // })
});

