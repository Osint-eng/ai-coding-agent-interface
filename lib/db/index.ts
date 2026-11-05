import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
  options: '-c search_path=neon_auth,public',
  max: 5,
})
