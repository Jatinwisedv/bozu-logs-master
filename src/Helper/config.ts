import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT || '4000',
  database: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/your-default-db',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  deployedUrl: process.env.DEPLYED_URL || 'http://localhost:4000',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
    lifetime: process.env.JWT_LIFETIME || '1d',
  },
  
  admin: {
    name: process.env.ADMIN_NAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: process.env.ADMIN_ROLE || 'ADMIN',
  }
};

// Type checking to ensure all required environment variables are present
const requiredEnvs = [
  'DB_URL',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export default config;