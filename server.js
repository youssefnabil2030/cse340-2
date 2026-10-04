import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ✅ 1. تصحيح المسارات المحلية (لأننا بالفعل داخل مجلد src)
import db from './db.js';
import Organization from './models/organizations.js';
import Project from './models/projects.js';
import categoriesRouter from './routes/categories.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

// ✅ 2. ضبط المسارات بالشكل الصحيح
const viewsPath = fs.existsSync(path.join(__dirname, '../views')) 
  ? path.join(__dirname, '../views') 
  : path.join(__dirname, 'views');

const publicPath = fs.existsSync(path.join(__dirname, '../public')) 
  ? path.join(__dirname, '../public') 
  : path.join(__dirname, 'public');

app.set('views', viewsPath);
app.use(express.static(publicPath));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ 3. تشغيل الـ Setup بأمان داخل دالة Async لتفادي الـ Top-Level Await Crashes
async function initDb() {
  try {
    const sqlPath = fs.existsSync(path.join(__dirname, 'setup.sql'))
      ? path.join(__dirname, 'setup.sql')
      : path.join(__dirname, '../setup.sql');

    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await db.query(sql);
      console.log("✅ Database initialized successfully!");
    } else {
      console.log("⚠️ setup.sql not found, skipping auto-init.");
    }
  } catch (err) {
    console.error("❌ Database setup failed (Server will continue running):", err.message);
  }
}

// 1) Home Route
app.get('/', async (req, res) => {
  try {
    res.render('home', { pageTitle: 'Home' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// 2) Organizations Route
app.get('/organizations', async (req, res) => {
  try {
    const organizationData = await Organization.getAll();
    res.render('organizations', { 
      pageTitle: 'Organizations',
      organizations: organizationData 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// 3) Projects Route
app.get('/projects', async (req, res) => {
  try {
    const projectData = await Project.getAll();
    res.render('projects', { 
      pageTitle: 'Service Projects',
      projects: projectData 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// 4) Categories Router
app.use('/', categoriesRouter);

// ✅ 4. بدء السيرفر بعد محاولة تهيئة القاعدة
app.listen(port, async () => {
  console.log(`🚀 Application is running on port ${port}`);
  await initDb();
});
