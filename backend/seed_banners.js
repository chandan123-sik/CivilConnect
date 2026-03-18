const mongoose = require('mongoose');
require('dotenv').config();
const Banner = require('./module/admin/models/Banner');

const starterSlides = [
    {
        title: "Let's get started",
        description: "Build your dream project with verified experts and quality materials today.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format",
        type: "get-started",
        isActive: true,
        order: 1
    },
    {
        title: "Manage Everything",
        description: "From labor tracking to material audits, manage your site directly with ease.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format",
        type: "get-started",
        isActive: true,
        order: 2
    },
    {
        title: "Verified Experts",
        description: "Connect with certified engineers and contractors for safe construction.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format",
        type: "get-started",
        isActive: true,
        order: 3
    }
];

async function seedBanners() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        // Check if get-started banners exist
        const count = await Banner.countDocuments({ type: 'get-started' });
        if (count === 0) {
            console.log('No get-started banners found. Seeding...');
            await Banner.insertMany(starterSlides);
            console.log('Banners seeded successfully!');
        } else {
            console.log('get-started banners already exist.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seedBanners();
