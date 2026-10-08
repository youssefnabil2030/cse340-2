import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import db from './src/db.js';
import appRouter from './src/routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

// Views and public paths (root-level folders)
const viewsPath = fs.existsSync(path.join(__dirname, 'views'))
  ? path.join(__dirname, 'views')
  : path.join(__dirname, 'src/views');

const publicPath = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, 'src/public');

app.set('views', viewsPath);
app.use(express.static(publicPath));

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize database safely
async function initDb() {
  try {
    const sqlPath = fs.existsSync(path.join(__dirname, 'setup.sql'))
      ? path.join(__dirname, 'setup.sql')
      : path.join(__dirname, 'src/setup.sql');

    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await db.query(sql);
      console.log('✅ Database initialized successfully!');
    } else {
      console.log('⚠️ setup.sql not found, skipping auto-init.');
    }
  } catch (err) {
    console.error('❌ Database setup failed (Server running anyway):', err.message);
  }
}

// Home route
app.get('/', async (req, res) => {
  try {
    res.render('home', { pageTitle: 'Home', title: 'Home' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// All feature routes (organizations, projects, categories + new/edit)
// live in src/routes/ and delegate to controllers (MVC pattern).
app.use('/', appRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Not Found', title: 'Not Found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).send(status === 404 ? 'Not Found' : 'Server Error');
});

app.listen(port, async () => {
  console.log(`🚀 Application is running on port ${port}`);
  await initDb();
});
