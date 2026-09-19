// src/db.js
import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

if (!config.databaseUrl) {
    console.error('⚠️ WARNING: DATABASE_URL is not set in environment variables!');
}

const pool = new Pool({
    connectionString: config.databaseUrl,
    // Render أو خدمات السحاب بتتطلب SSL دائماً
    ssl: config.isLocal 
        ? false 
        : { rejectUnauthorized: false }
});

// اختبار الاتصال عند الإقلاع للتحقق من الصحة
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Database Connection Error:', err.message);
    } else {
        console.log('✅ Connected to PostgreSQL successfully!');
        release();
    }
});

export default pool;
