import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ✅ طالما server.js بره في الـ Root، بنحتاج ندخل جوه src/
import db from './src/db.js';
import Organization from './src/models/organizations.js';
import Project from './src/models/projects.js';
import categoriesRouter from './src/routes/categories.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

// ✅ ضبط مسار views و public بالنسبة للـ Root
const viewsPath = fs.existsSync(path.join(__dirname, 'views')) 
  ? path.join(__dirname, 'views') 
  : path.join(__dirname, 'src/views');

const publicPath = fs.existsSync(path.join(__dirname, 'public')) 
  ? path.join(__dirname, 'public') 
  : path.join(__dirname, 'src/public');

app.set('views', viewsPath);
app.use(express.static(publicPath));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ تهيئة قاعدة البيانات بأمان
async function initDb() {
  try {
    const sqlPath = fs.existsSync(path.join(__dirname, 'setup.sql'))
      ? path.join(__dirname, 'setup.sql')
      : path.join(__dirname, 'src/setup.sql');

    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await db.query(sql);
      console.log("✅ Database initialized successfully!");
    } else {
      console.log("⚠️ setup.sql not found, skipping auto-init.");
    }
  } catch (err) {
    console.error("❌ Database setup failed (Server running anyway):", err.message);
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

app.listen(port, async () => {
  console.log(`🚀 Application is running on port ${port}`);
  await initDb();
});
