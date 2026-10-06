import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Photo from '../models/Photo.js';
import { connectDB } from '../config/db.js';

dotenv.config();

// Exact demo placeholder fixtures sourced from current portfolio data
const demoProjects = [
  {
    title: 'DevCanvas UI Kit',
    description: 'A lightweight, accessible component library and token-driven design system built for modern React applications. [Demo Placeholder]',
    tags: ['React', 'JavaScript', 'CSS Modules', 'Vite'],
    githubUrl: 'https://github.com/Oluwaifemi2005',
    liveDemoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: true,
    order: 1
  },
  {
    title: 'ShutterCloud Asset Manager',
    description: 'Web application tailored for photographers to organize client proofing galleries, sort metadata, and export selects. [Demo Placeholder]',
    tags: ['React', 'JavaScript', 'REST APIs', 'CSS Grid'],
    githubUrl: 'https://github.com/Oluwaifemi2005',
    liveDemoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: true,
    order: 2
  },
  {
    title: 'AudioWave Visualizer',
    description: 'Interactive real-time audio visualization tool utilizing the Web Audio API with responsive canvas rendering. [Demo Placeholder]',
    tags: ['JavaScript', 'HTML5 Canvas', 'Web Audio API', 'CSS3'],
    githubUrl: 'https://github.com/Oluwaifemi2005',
    liveDemoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: true,
    order: 3
  },
  {
    title: 'Editorial Portfolio Engine',
    description: 'Fast, markdown-powered static content engine designed for minimalist creative portfolios and technical case studies. [Demo Placeholder]',
    tags: ['React', 'React Router', 'Markdown', 'Vite'],
    githubUrl: 'https://github.com/Oluwaifemi2005',
    liveDemoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: false,
    order: 4
  },
  {
    title: 'TaskMatrix Productivity Dashboard',
    description: 'Clean Kanban and sprint tracking dashboard featuring drag-and-drop workflow management and analytics. [Demo Placeholder]',
    tags: ['React', 'State Management', 'CSS Flexbox', 'JavaScript'],
    githubUrl: 'https://github.com/Oluwaifemi2005',
    liveDemoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: false,
    order: 5
  }
];

const demoPhotos = [
  {
    title: 'Neon Reverie',
    category: 'Portraits',
    description: 'Experimental neon portraiture exploring magenta and cyan continuous illumination in a studio setting. [Demo Placeholder]',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: true,
    order: 1
  },
  {
    title: 'Golden Hour Bloom',
    category: 'Editorial',
    description: 'Natural golden hour lighting portrait session captured in an open countryside landscape. [Demo Placeholder]',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: true,
    order: 2
  },
  {
    title: 'Studio High-Key',
    category: 'Portraits',
    description: 'High-energy expressive studio portraiture against clean solid color backdrops. [Demo Placeholder]',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: true,
    order: 3
  },
  {
    title: 'Urban Geometry',
    category: 'Street',
    description: 'Architectural lines and street contrast captured in metropolitan downtown corridors. [Demo Placeholder]',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: false,
    order: 4
  },
  {
    title: 'Nocturne Horizons',
    category: 'Street',
    description: 'Long exposure night street photography emphasizing light trails and atmospheric fog. [Demo Placeholder]',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: false,
    order: 5
  },
  {
    title: 'Monochrome Study',
    category: 'Editorial',
    description: 'Black and white portrait study focusing on textures, shadow angles, and natural expression. [Demo Placeholder]',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    imagePublicId: null,
    featured: false,
    order: 6
  }
];

async function seedData() {
  console.log('[Seed] Connecting to MongoDB...');
  const conn = await connectDB();

  if (!conn) {
    console.error('[Seed Error] Could not connect to database. Ensure MongoDB is running and MONGODB_URI is set.');
    process.exit(1);
  }

  try {
    console.log('[Seed] Clearing existing demo projects and photography...');
    await Project.deleteMany({});
    await Photo.deleteMany({});

    console.log('[Seed] Inserting demo software projects...');
    const createdProjects = await Project.insertMany(demoProjects);
    console.log(`[Seed Success] Inserted ${createdProjects.length} demo software projects.`);

    console.log('[Seed] Inserting demo photography items...');
    const createdPhotos = await Photo.insertMany(demoPhotos);
    console.log(`[Seed Success] Inserted ${createdPhotos.length} demo photography items.`);

    console.log('[Seed Finished] Database seeding completed successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed data: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedData();
