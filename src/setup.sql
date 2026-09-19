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
-- 4. Seed Data (3+ Organizations, 5+ Projects, 5+ Categories, 5+ Junctions)
-- ====================================================================

-- Organizations (3 rows)
INSERT INTO public.organizations (name, description, contact_email, logo_filename, location, date_created) VALUES
    ('Hope Worldwide', 'Global non-profit focused on community development and disaster assistance.', 'contact@hopeworldwide.org', 'hope-logo.png', 'Salt Lake City, UT', '2024-01-15'),
    ('EcoGuardians', 'Action-driven environmental protection and reforestation group.', 'info@ecoguardians.org', 'eco-logo.png', 'Boise, ID', '2024-03-22'),
    ('Global Relief Network', 'Dedicated to emergency logistics and food relief distribution.', 'support@globalrelief.org', 'default-logo.png', 'Rexburg, ID', '2024-02-10');

-- Projects (5 rows with location and NOT NULL organization_id)
INSERT INTO public.projects (name, description, location, start_date, organization_id) VALUES
    ('City Food Drive', 'Distributing fresh meals and essential supplies to local family shelters.', 'Salt Lake City, UT', '2024-05-10', 1),
    ('River Cleanup Initiative', 'Removing microplastics and debris from the local riverbed.', 'Boise, ID', '2024-06-01', 2),
    ('Green Space Development', 'Planting indigenous trees and creating urban community gardens.', 'Boise, ID', '2024-06-15', 2),
    ('Youth Literacy Mentorship', 'Providing after-school tutoring and reading assistance for primary students.', 'Rexburg, ID', '2024-07-01', 1),
    ('Emergency Medical Supply Drive', 'Sorting and packing crucial medical supplies for regional emergency response.', 'Salt Lake City, UT', '2024-08-12', 3);

-- Categories (4 rows)
INSERT INTO public.categories (name) VALUES 
    ('Community Outreach'),
    ('Environmental Cleanup'),
    ('Education & Tutoring'),
    ('Disaster Relief');

-- Junction Table Records (5 rows)
INSERT INTO public.project_categories (project_id, category_id) VALUES
    (1, 1), -- City Food Drive -> Community Outreach
    (2, 2), -- River Cleanup -> Environmental Cleanup
    (3, 1), -- Green Space -> Community Outreach
    (3, 2), -- Green Space -> Environmental Cleanup
    (4, 3); -- Youth Mentorship -> Education & Tutoring
