// src/config.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// تحديد مسار ملف .env بشكل مطلق لضمان تحميله دائماً مهما كان مكان تشغيل السيرفر
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL?.trim(),
    nodeEnv: process.env.NODE_ENV || 'development',
    isLocal: !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')
};
