const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await Equipment.deleteMany({});
    await PricingRule.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@courtbooking.com',
      password: hashedPassword,
      phone: '+1234567890',
      role: 'admin'
    });

    // Create regular user
    const regularPassword = await bcrypt.hash('user123', salt);
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: regularPassword,
      phone: '+1987654321',
      role: 'user'
    });

    console.log('Users created...');

    // Create 4 badminton courts (2 indoor, 2 outdoor)
    const courts = await Court.insertMany([
      {
        name: 'Indoor Court A',
        type: 'indoor',
        description: 'Premium indoor court with air conditioning and professional lighting',
        basePrice: 30,
        amenities: ['Air Conditioning', 'Professional Lighting', 'Scoreboard', 'Seating Area'],
        isActive: true
      },
      {
        name: 'Indoor Court B',
        type: 'indoor',
        description: 'Modern indoor court with excellent ventilation',
        basePrice: 30,
        amenities: ['Air Conditioning', 'LED Lighting', 'Sound System'],
        isActive: true
      },
      {
        name: 'Outdoor Court 1',
        type: 'outdoor',
        description: 'Open-air court with natural lighting, perfect for morning sessions',
        basePrice: 20,
        amenities: ['Night Lights', 'Water Fountain', 'Bench Seating'],
        isActive: true
      },
      {
        name: 'Outdoor Court 2',
        type: 'outdoor',
        description: 'Spacious outdoor court with shade covers',
        basePrice: 20,
        amenities: ['Shade Covers', 'Night Lights', 'Locker Access'],
        isActive: true
      }
    ]);

    console.log('Courts created...');

    // Create 3 coaches
    const coaches = await Coach.insertMany([
      {
        name: 'Coach Michael Johnson',
        email: 'michael@courtbooking.com',
        phone: '+1111222333',
        specialization: 'Singles Strategy',
        experience: 10,
        hourlyRate: 50,
        bio: 'Former national champion with 10 years of coaching experience. Specializes in singles game strategy and footwork.',
        isActive: true
      },
      {
        name: 'Coach Sarah Williams',
        email: 'sarah@courtbooking.com',
        phone: '+1444555666',
        specialization: 'Doubles Tactics',
        experience: 8,
        hourlyRate: 45,
        bio: 'Expert in doubles gameplay and coordination. Great for pairs looking to improve their teamwork.',
        isActive: true
      },
      {
        name: 'Coach David Chen',
        email: 'david@courtbooking.com',
        phone: '+1777888999',
        specialization: 'Beginner Training',
        experience: 5,
        hourlyRate: 35,
        bio: 'Patient and encouraging coach perfect for beginners. Focuses on fundamentals and building confidence.',
        isActive: true
      }
    ]);

    console.log('Coaches created...');

    // Create equipment inventory
    const equipment = await Equipment.insertMany([
      {
        name: 'Professional Racket',
        type: 'racket',
        description: 'High-quality carbon fiber racket suitable for all skill levels',
        totalQuantity: 20,
        pricePerHour: 5,
        isActive: true
      },
      {
        name: 'Beginner Racket',
        type: 'racket',
        description: 'Lightweight racket ideal for beginners',
        totalQuantity: 15,
        pricePerHour: 3,
        isActive: true
      },
      {
        name: 'Court Shoes',
        type: 'shoes',
        description: 'Non-marking court shoes available in various sizes',
        totalQuantity: 25,
        pricePerHour: 4,
        isActive: true
      },
      {
        name: 'Shuttlecock Pack',
        type: 'shuttlecock',
        description: 'Pack of 3 feather shuttlecocks',
        totalQuantity: 50,
        pricePerHour: 2,
        isActive: true
      }
    ]);

    console.log('Equipment created...');

    // Create pricing rules
    const pricingRules = await PricingRule.insertMany([
      {
        name: 'Peak Hour Surcharge',
        description: 'Higher rates during peak evening hours (6 PM - 9 PM)',
        type: 'peak_hour',
        startTime: '18:00',
        endTime: '21:00',
        modifierType: 'multiplier',
        modifierValue: 1.5,
        appliesTo: 'all',
        priority: 10,
        isActive: true
      },
      {
        name: 'Weekend Rate',
        description: 'Additional charge for weekend bookings',
        type: 'weekend',
        applicableDays: [0, 6], // Sunday and Saturday
        modifierType: 'fixed_addition',
        modifierValue: 10,
        appliesTo: 'all',
        priority: 5,
        isActive: true
      },
      {
        name: 'Indoor Premium',
        description: 'Premium rate for indoor courts',
        type: 'indoor_premium',
        modifierType: 'fixed_addition',
        modifierValue: 5,
        appliesTo: 'indoor',
        priority: 3,
        isActive: true
      },
      {
        name: 'Early Bird Discount',
        description: 'Discount for early morning bookings (6 AM - 9 AM)',
        type: 'early_bird',
        startTime: '06:00',
        endTime: '09:00',
        modifierType: 'percentage',
        modifierValue: -15,
        appliesTo: 'all',
        priority: 8,
        isActive: true
      },
      {
        name: 'Christmas Holiday Rate',
        description: 'Special holiday pricing',
        type: 'holiday',
        specificDates: [new Date('2025-12-25'), new Date('2025-12-26')],
        modifierType: 'multiplier',
        modifierValue: 2,
        appliesTo: 'all',
        priority: 20,
        isActive: true
      }
    ]);

    console.log('Pricing rules created...');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Courts: ${await Court.countDocuments()}`);
    console.log(`Coaches: ${await Coach.countDocuments()}`);
    console.log(`Equipment: ${await Equipment.countDocuments()}`);
    console.log(`Pricing Rules: ${await PricingRule.countDocuments()}`);
    
    console.log('\n=== Test Credentials ===');
    console.log('Admin: admin@courtbooking.com / admin123');
    console.log('User: john@example.com / user123');

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
