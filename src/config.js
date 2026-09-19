// src/config.js
import dotenv from 'dotenv';

// تحميل .env لو الملف موجود محلياً (على جهازك)
dotenv.config();

const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : '';

export const config = {
    port: process.env.PORT || 5000,
    databaseUrl: dbUrl,
    nodeEnv: process.env.NODE_ENV || 'development',
    // التأكد لو الاتصال محلي أو عبر سيرفر سحابي (Render / Cloud)
    isLocal: !dbUrl || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')
};
