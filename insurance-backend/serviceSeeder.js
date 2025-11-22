/**
 * Service Seeder
 * Usage:
 *   node serviceSeeder.js        // Seed services
 *   node serviceSeeder.js -d     // Delete all services
 */

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Service = require('./src/models/Service');
const connectDB = require('./src/config/database');

connectDB();

const services = [
  {
    name: 'Life Insurance',
    category: 'life',
    description: 'Provides financial protection for your family in case of death.',
    features: ['Death Benefit', 'Terminal Illness Cover', 'Optional Riders'],
    premiumRange: { min: 50_000, max: 200_000, period: 'year' },
    coverageAmount: { min: 5_000_000, max: 50_000_000, currency: 'RWF' },
    eligibility: { minAge: 18, maxAge: 65, requirements: ['Valid ID', 'Medical Checkup'] },
    documents: [
      { name: 'ID/Passport', required: true },
      { name: 'Medical Report', required: false },
    ],
    terms: 'Policy is valid for 1 year and renewable annually.',
    isActive: true,
    popularityScore: 0,
  },
  {
    name: 'Health Insurance',
    category: 'health',
    description: 'Covers hospitalization, surgery, and outpatient care.',
    features: ['Hospitalization', 'Surgery', 'Medication', 'Dental', 'Vision'],
    premiumRange: { min: 30_000, max: 150_000, period: 'month' },
    coverageAmount: { min: 1_000_000, max: 10_000_000, currency: 'RWF' },
    eligibility: { minAge: 0, maxAge: 65, requirements: ['Valid ID'] },
    documents: [
      { name: 'ID/Passport', required: true },
      { name: 'Medical History', required: false },
    ],
    terms: 'Covers pre-approved medical expenses for the insured.',
    isActive: true,
    popularityScore: 0,
  },
  {
    name: 'Motor Insurance',
    category: 'motor',
    description: 'Protects your vehicle from damage, theft, and liability.',
    features: ['Collision Coverage', 'Theft Protection', 'Third Party Liability'],
    premiumRange: { min: 80_000, max: 400_000, period: 'year' },
    coverageAmount: { min: 2_000_000, max: 50_000_000, currency: 'RWF' },
    eligibility: { minAge: 18, maxAge: 75, requirements: ['Valid Driver License', 'Vehicle Registration'] },
    documents: [
      { name: 'Driver License', required: true },
      { name: 'Vehicle Registration', required: true },
    ],
    terms: 'Policy covers damages and legal liability for one year.',
    isActive: true,
    popularityScore: 0,
  },
  {
    name: 'Home Insurance',
    category: 'property',
    description: 'Covers your home and possessions against fire, theft, and natural disasters.',
    features: ['Fire', 'Theft', 'Natural Disaster', 'Third Party Liability'],
    premiumRange: { min: 100_000, max: 500_000, period: 'year' },
    coverageAmount: { min: 5_000_000, max: 100_000_000, currency: 'RWF' },
    eligibility: { minAge: 18, maxAge: 75, requirements: ['Property Ownership Documents'] },
    documents: [
      { name: 'Property Title', required: true },
      { name: 'ID/Passport', required: true },
    ],
    terms: 'Covers the property and its contents for one year.',
    isActive: true,
    popularityScore: 0,
  },
  {
    name: 'Travel Insurance',
    category: 'travel',
    description: 'Covers medical emergencies and trip cancellations during travel.',
    features: ['Medical Emergencies', 'Trip Cancellation', 'Baggage Loss'],
    premiumRange: { min: 20_000, max: 100_000, period: 'trip' },
    coverageAmount: { min: 500_000, max: 5_000_000, currency: 'RWF' },
    eligibility: { minAge: 0, maxAge: 75, requirements: ['Valid Passport'] },
    documents: [
      { name: 'Passport Copy', required: true },
    ],
    terms: 'Valid for the duration of the trip only.',
    isActive: true,
    popularityScore: 0,
  },
];

const seedServices = async () => {
  try {
    await Service.deleteMany();
    console.log('🗑️  All existing services deleted');

    await Service.insertMany(services);
    console.log('✅ Services seeded successfully');

    process.exit();
  } catch (error) {
    console.error('❌ Service seeding failed:', error);
    process.exit(1);
  }
};

const deleteServices = async () => {
  try {
    await Service.deleteMany();
    console.log('🗑️  All services deleted');
    process.exit();
  } catch (error) {
    console.error('❌ Failed to delete services:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteServices();
} else {
  seedServices();
}
