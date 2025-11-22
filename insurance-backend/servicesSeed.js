// servicesSeed.js - Run this file to populate initial services
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const Service = require('./src/models/service'); // Changed from lowercase 'service' to match model name

dotenv.config({ path: './.env' });

const services = [
  {
    name: 'Comprehensive Life Insurance',
    description: 'Protect your family\'s future with comprehensive life coverage that provides financial security and peace of mind.',
    category: 'life',
    premium: 'FRW 25,000/month',
    features: [
      'Death benefit coverage up to FRW 50M',
      'Critical illness rider included',
      'Flexible premium payment options',
      'Tax benefits available'
    ],
    benefits: [
      'Financial protection for your loved ones',
      'Coverage for terminal illness',
      'No medical exam for policies under FRW 10M',
      'Premium waiver on disability'
    ],
    coverage: 'Covers natural death, accidental death, and terminal illnesses',
    exclusions: ['Suicide within first 2 years', 'Death during criminal activity'],
    requirements: ['Age 18-65', 'Valid ID', 'Medical examination for high coverage'],
    status: 'active'
  },
  {
    name: 'Health Insurance Plus',
    description: 'Complete healthcare coverage including hospitalization, surgery, and outpatient care for you and your family.',
    category: 'health',
    premium: 'FRW 45,000/month',
    features: [
      'Unlimited hospitalization coverage',
      'Outpatient consultation included',
      'Emergency ambulance service',
      'Access to network hospitals nationwide'
    ],
    benefits: [
      'Cashless treatment at network hospitals',
      'Annual health check-up',
      'Maternity coverage',
      'Dental and optical care'
    ],
    coverage: 'Covers hospitalization, surgeries, diagnostics, and medications',
    exclusions: ['Pre-existing conditions (first year)', 'Cosmetic procedures'],
    requirements: ['Valid ID', 'Medical history declaration'],
    status: 'active'
  },
  {
    name: 'Motor Comprehensive Insurance',
    description: 'Full protection for your vehicle against accidents, theft, and third-party liabilities.',
    category: 'motor',
    premium: 'FRW 180,000/year',
    features: [
      'Own damage coverage',
      'Third-party liability (unlimited)',
      'Theft and vandalism protection',
      '24/7 roadside assistance'
    ],
    benefits: [
      'Free vehicle towing',
      'Replacement vehicle during repairs',
      'Windscreen replacement',
      'Personal accident cover for driver'
    ],
    coverage: 'Covers accident damage, theft, fire, and third-party claims',
    exclusions: ['Damage during unlicensed driving', 'Wear and tear'],
    requirements: ['Valid driving license', 'Vehicle registration', 'Vehicle inspection report'],
    status: 'active'
  },
  {
    name: 'Home & Property Insurance',
    description: 'Comprehensive protection for your home and belongings against fire, theft, and natural disasters.',
    category: 'property',
    premium: 'FRW 120,000/year',
    features: [
      'Building structure coverage',
      'Contents insurance included',
      'Natural disaster protection',
      'Alternative accommodation coverage'
    ],
    benefits: [
      'Replacement cost coverage',
      'Emergency repairs covered',
      'Liability protection',
      'Valuable items protection'
    ],
    coverage: 'Covers fire, theft, flood, earthquake, and structural damage',
    exclusions: ['Damage due to negligence', 'Normal wear and tear'],
    requirements: ['Property ownership documents', 'Property valuation', 'Security measures in place'],
    status: 'active'
  },
  {
    name: 'Travel Insurance',
    description: 'Stay protected while traveling abroad with coverage for medical emergencies, trip cancellations, and lost baggage.',
    category: 'travel',
    premium: 'FRW 35,000/trip',
    features: [
      'International medical coverage up to $100,000',
      'Trip cancellation reimbursement',
      'Lost baggage compensation',
      '24/7 emergency assistance'
    ],
    benefits: [
      'Emergency medical evacuation',
      'Travel delay compensation',
      'Document replacement assistance',
      'Adventure sports coverage available'
    ],
    coverage: 'Covers medical emergencies, trip disruptions, and lost belongings',
    exclusions: ['Pre-existing medical conditions', 'Travel to restricted countries'],
    requirements: ['Valid passport', 'Travel itinerary', 'Age 0-75'],
    status: 'active'
  },
  {
    name: 'Business Insurance Package',
    description: 'Comprehensive coverage for your business including property, liability, and business interruption.',
    category: 'business',
    premium: 'FRW 350,000/year',
    features: [
      'Commercial property coverage',
      'Public liability insurance',
      'Business interruption coverage',
      'Employee compensation'
    ],
    benefits: [
      'Legal expense coverage',
      'Equipment breakdown insurance',
      'Cyber liability protection',
      'Professional indemnity'
    ],
    coverage: 'Covers property damage, liability claims, and income loss',
    exclusions: ['Intentional damage', 'War and terrorism'],
    requirements: ['Business registration', 'Financial statements', 'Business premises inspection'],
    status: 'active'
  },
  {
    name: 'Group Life Insurance',
    description: 'Affordable life insurance coverage for employee groups with flexible benefits and easy administration.',
    category: 'group',
    premium: 'FRW 8,000/employee/month',
    features: [
      'Coverage for all employees',
      'Accidental death benefit',
      'Easy online administration',
      'No medical exams required'
    ],
    benefits: [
      'Tax benefits for employer',
      'Attract and retain talent',
      'Quick claim processing',
      'Family coverage options'
    ],
    coverage: 'Covers death and total permanent disability of employees',
    exclusions: ['Suicide within first year', 'Self-inflicted injuries'],
    requirements: ['Minimum 10 employees', 'Company registration', 'Employee list'],
    status: 'active'
  },
  {
    name: 'Education Savings Plan',
    description: 'Secure your child\'s educational future with a savings plan that offers guaranteed returns and life coverage.',
    category: 'savings',
    premium: 'FRW 50,000/month',
    features: [
      'Guaranteed maturity benefit',
      'Life insurance coverage included',
      'Flexible premium payment',
      'Tax benefits under Section 80C'
    ],
    benefits: [
      'Lump sum payout at maturity',
      'Premium waiver on parent\'s death',
      'Partial withdrawals allowed',
      'Loan facility available'
    ],
    coverage: 'Covers education expenses and provides life insurance',
    exclusions: ['Early withdrawal penalties apply'],
    requirements: ['Child age 0-18', 'Parent age 21-55', 'Valid ID'],
    status: 'active'
  },
  {
    name: 'Investment Plan Plus',
    description: 'Grow your wealth with market-linked returns while enjoying life insurance protection.',
    category: 'investment',
    premium: 'FRW 100,000/month',
    features: [
      'Market-linked returns',
      'Multiple fund options',
      'Life insurance coverage',
      'Switch between funds freely'
    ],
    benefits: [
      'Potential for high returns',
      'Tax benefits available',
      'Partial withdrawals allowed',
      'Loyalty bonuses'
    ],
    coverage: 'Investment growth with life insurance protection',
    exclusions: ['Market risks apply', 'No guaranteed returns'],
    requirements: ['Age 18-65', 'Minimum 5-year term', 'Risk profile assessment'],
    status: 'active'
  }
];

const seedServices = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('MongoDB Connected...');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Existing services cleared');

    // Insert new services
    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} services added successfully`);

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
};

// Run the seed function
seedServices();