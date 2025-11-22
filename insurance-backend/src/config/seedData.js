const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Policy = require('../models/Policy');
const connectDB = require('./database');

dotenv.config({
    path: './.env'
});

const seedData = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Policy.deleteMany({});

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@sanlam.rw',
      phone: '+250788000000',
      username: 'admin',
      password: 'Admin123!',
      idNumber: '1199900000000001',
      address: 'Sanlam Head Office, Kigali',
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Admin created:', {
      email: adminUser.email,
      username: adminUser.username,
      password: 'Admin123!'
    });

    // Create Test Client Users
    console.log('👥 Creating test client users...');
    
    const client1 = await User.create({
      firstName: 'Gustave',
      lastName: 'Karekezi',
      email: 'gustave.k@example.com',
      phone: '+250786979551',
      username: 'gustave',
      password: 'Client123!',
      idNumber: '1199080001234567',
      address: 'KN 4 Ave, Gasabo, Kigali',
      role: 'client',
      isActive: true,
      isVerified: true
    });

    const client2 = await User.create({
      firstName: 'Jean Marie',
      lastName: 'Uwimana',
      email: 'jean.uwimana@example.com',
      phone: '+250788123456',
      username: 'jeanmarie',
      password: 'Client123!',
      idNumber: '1198570001234568',
      address: 'KG 11 Ave, Kicukiro, Kigali',
      role: 'client',
      isActive: true,
      isVerified: true
    });

    const client3 = await User.create({
      firstName: 'Alice',
      lastName: 'Mukamana',
      email: 'alice.m@example.com',
      phone: '+250789654321',
      username: 'alice',
      password: 'Client123!',
      idNumber: '1199580001234569',
      address: 'KK 15 Ave, Nyarugenge, Kigali',
      role: 'client',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Test clients created');

    // Create Sample Policies for Clients
    console.log('🛡️  Creating sample policies...');

    await Policy.create([
      {
        policyNumber: "E390073",
        holder: client1._id,
        type: 'Life Insurance',
        premium: 50000,
        coverage: 10000000,
        paymentFrequency: 'Monthly',
        startDate: new Date('2023-06-21'),
        endDate: new Date('2026-06-21'),
        nextPayment: new Date('2025-11-15'),
        status: 'Active',
        beneficiary: {
          name: 'Marie Karekezi',
          relationship: 'Spouse',
          phone: '+250788111111'
        },
        totalPaid: 850000
      },
      {
        policyNumber: "S390074",
        holder: client2._id,
        type: 'Health Insurance',
        premium: 35000,
        coverage: 5000000,
        paymentFrequency: 'Monthly',
        startDate: new Date('2023-08-15'),
        endDate: new Date('2026-08-15'),
        nextPayment: new Date('2025-11-20'),
        status: 'Active',
        beneficiary: {
          name: 'Self',
          relationship: 'Self',
          phone: '+250788123456'
        },
        totalPaid: 455000
      },
      { policyNumber: "P390075",
        holder: client3._id,
        type: 'Motor Insurance',
        premium: 120000,
        coverage: 15000000,
        paymentFrequency: 'Annually',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2025-01-10'),
        nextPayment: new Date('2025-01-10'),
        status: 'Active',
        totalPaid: 120000
      }
    ]);

    console.log('✅ Sample policies created');

    console.log('\n📋 ========== SEED DATA SUMMARY ==========\n');
    console.log('🔐 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email: admin@sanlam.rw');
    console.log('   Username: admin');
    console.log('   Password: Admin123!\n');
    
    console.log('👥 CLIENT LOGIN CREDENTIALS:');
    console.log('   1. Username: gustave | Password: Client123!');
    console.log('   2. Username: jeanmarie | Password: Client123!');
    console.log('   3. Username: alice | Password: Client123!\n');
    
    console.log('✅ Database seeded successfully!\n');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();