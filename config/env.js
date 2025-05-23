import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_END || 'development'}.local` })

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_KEY, ARCJET_ENV, ADMIN_ID } = process.env