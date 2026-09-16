-- ====================================================================
-- 1. Create Clean Slate
-- ====================================================================
DROP TABLE IF EXISTS public.project_categories CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- ====================================================================
-- 2. Create Base Tables
-- ====================================================================
CREATE TABLE public.organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL DEFAULT 'default-logo.png',
    location VARCHAR(150) NOT NULL,
    date_created DATE DEFAULT CURRENT_DATE
);

CREATE TABLE public.projects (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    organization_id INT NOT NULL REFERENCES public.organizations(organization_id) ON DELETE CASCADE
);

CREATE TABLE public.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ====================================================================
-- 3. Create Junction Table
-- ====================================================================
CREATE TABLE public.project_categories (
    project_id INT NOT NULL REFERENCES public.projects(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES public.categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ====================================================================
-- 4. Seed Data (3 Organizations, 15 Projects, 5 Categories)
-- ====================================================================

-- Organizations (3 rows)
INSERT INTO public.organizations (name, description, contact_email, logo_filename, location, date_created) VALUES
    ('Hope Worldwide', 'Global non-profit focused on community development and disaster assistance.', 'contact@hopeworldwide.org', 'hope-logo.png', 'Salt Lake City, UT', '2024-01-15'),
    ('EcoGuardians', 'Action-driven environmental protection and reforestation group.', 'info@ecoguardians.org', 'eco-logo.png', 'Boise, ID', '2024-03-22'),
    ('Global Relief Network', 'Dedicated to emergency logistics and food relief distribution.', 'support@globalrelief.org', 'default-logo.png', 'Rexburg, ID', '2024-02-10');

-- Categories (5 rows)
INSERT INTO public.categories (name) VALUES 
    ('Community Outreach'),
    ('Environmental Cleanup'),
    ('Education & Tutoring'),
    ('Disaster Relief'),
    ('Healthcare Support');

-- Projects (15 rows total — exactly 5 per organization)
INSERT INTO public.projects (name, description, location, start_date, organization_id) VALUES
    -- Hope Worldwide (Org ID: 1)
    ('City Food Drive', 'Distributing fresh meals and essential supplies to local family shelters.', 'Salt Lake City, UT', '2024-05-10', 1),
    ('Youth Literacy Mentorship', 'Providing after-school tutoring and reading assistance for primary students.', 'Rexburg, ID', '2024-07-01', 1),
    ('Community Garden Outreach', 'Building neighborhood gardens to address local fresh food access.', 'Salt Lake City, UT', '2024-08-01', 1),
    ('Senior Companion Program', 'Connecting youth volunteers with isolated seniors for weekly home visits.', 'Provo, UT', '2024-09-15', 1),
    ('Warm Coat Drive', 'Collecting and distributing winter apparel for vulnerable families.', 'Salt Lake City, UT', '2024-10-10', 1),

    -- EcoGuardians (Org ID: 2)
    ('River Cleanup Initiative', 'Removing microplastics and debris from the local riverbed.', 'Boise, ID', '2024-06-01', 2),
    ('Green Space Development', 'Planting indigenous trees and creating urban community gardens.', 'Boise, ID', '2024-06-15', 2),
    ('Forest Reforestation Drive', 'Planting native trees in regions damaged by recent forest fires.', 'McCall, ID', '2024-07-20', 2),
    ('Urban Recycling Campaign', 'Setting up accessible recycling stations across downtown districts.', 'Boise, ID', '2024-08-05', 2),
    ('Wildlife Habitat Restoration', 'Restoring wetland habitats for migratory bird species.', 'Nampa, ID', '2024-09-01', 2),

    -- Global Relief Network (Org ID: 3)
    ('Emergency Medical Supply Drive', 'Sorting and packing crucial medical supplies for regional emergency response.', 'Salt Lake City, UT', '2024-08-12', 3),
    ('Disaster Shelter Setup', 'Constructing temporary modular housing for displaced families.', 'Rexburg, ID', '2024-08-25', 3),
    ('Clean Water Distribution', 'Deploying mobile filtration systems to rural water-stressed areas.', 'Idaho Falls, ID', '2024-09-05', 3),
    ('Mobile Clinic Support', 'Assisting medical staff with basic triage and prescription deliveries.', 'Pocatello, ID', '2024-09-20', 3),
    ('Emergency Food Box Assembly', 'Packing non-perishable food parcels for immediate natural disaster distribution.', 'Rexburg, ID', '2024-10-01', 3);

-- Junction Table Records (Every project mapped to at least 1 category)
INSERT INTO public.project_categories (project_id, category_id) VALUES
    (1, 1),  -- City Food Drive -> Community Outreach
    (2, 3),  -- Youth Literacy Mentorship -> Education & Tutoring
    (3, 1),  -- Community Garden Outreach -> Community Outreach
    (4, 1),  -- Senior Companion Program -> Community Outreach
    (5, 1),  -- Warm Coat Drive -> Community Outreach
    (6, 2),  -- River Cleanup Initiative -> Environmental Cleanup
    (7, 2),  -- Green Space Development -> Environmental Cleanup
    (8, 2),  -- Forest Reforestation Drive -> Environmental Cleanup
    (9, 2),  -- Urban Recycling Campaign -> Environmental Cleanup
    (10, 2), -- Wildlife Habitat Restoration -> Environmental Cleanup
    (11, 4), -- Emergency Medical Supply Drive -> Disaster Relief
    (11, 5), -- Emergency Medical Supply Drive -> Healthcare Support
    (12, 4), -- Disaster Shelter Setup -> Disaster Relief
    (13, 4), -- Clean Water Distribution -> Disaster Relief
    (14, 5), -- Mobile Clinic Support -> Healthcare Support
    (15, 4); -- Emergency Food Box Assembly -> Disaster Relief
