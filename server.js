import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import db from './src/db.js';
import Organization from './src/models/organizations.js';
import Project from './src/models/projects.js';

// 🟢 1. استيراد ملف الـ Routes المخصص للتصنيفات
import categoriesRouter from './src/routes/categories.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 🟢 2. قراءة بيانات الـ Form من نوع POST (ضروري جداً لعمليات الـ Insert & Update)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

try {
  const sql = fs.readFileSync('./src/setup.sql', 'utf8');
  await db.query(sql);
  console.log("Database initialized successfully!");
} catch (err) {
  console.error("Database setup failed:", err);
}

// 1) Home Route
app.get('/', async (req, res) => {
  try {
    res.render('home', { pageTitle: 'Home' });
  } catch (error) {
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

// 🟢 3. تفعيل الـ Router الخاص بـ Categories (يشمل /categories, /categories/relief, /categories/education, /new-category, الخ)
app.use('/', categoriesRouter);

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
