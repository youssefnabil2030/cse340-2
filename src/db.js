// src/db.js
import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

if (!config.databaseUrl) {
    console.error('❌ DATABASE_URL is missing in .env file!');
}

const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.isLocal
        ? false 
        : { rejectUnauthorized: false }
});

// اختبار الاتصال عند التشغيل لمعرفة حالة السيرفر
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Database Connection Error:', err.message);
    }
    console.log('✅ Connected to PostgreSQL successfully!');
    release();
});

export default pool;
