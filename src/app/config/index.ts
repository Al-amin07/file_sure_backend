import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  db_url: process.env.DB_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
};
