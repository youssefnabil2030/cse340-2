// src/config.js
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : '';

export const config = {
    port: process.env.PORT || 5000,
    databaseUrl: dbUrl,
    nodeEnv: process.env.NODE_ENV || 'development',
    // ✅ التأكد الدقيق: يعتبر local فقط لو NODE_ENV مش production وكان الرابط فيه localhost
    isLocal: process.env.NODE_ENV !== 'production' && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'))
};
