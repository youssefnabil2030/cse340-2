// src/db.js
import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

if (!config.databaseUrl) {
    console.error('⚠️ WARNING: DATABASE_URL is not set in environment variables!');
}

const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.isLocal 
        ? false 
        : { rejectUnauthorized: false }
});

// ✅ إمساك الأخطاء المفاجئة للـ Idle Clients لمنع سقوط السيرفر
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle database client:', err.message);
});

// ✅ اختبار الاتصال باستخدام Async/Await لمنع الـ Unhandled Rejection
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL successfully!');
        client.release();
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
        // لا نضع process.exit هنا حتى يستمر السيرفر في العمل ويستجيب للطلبات الأخرى إن أمكن
    }
}

testConnection();

export default pool;
