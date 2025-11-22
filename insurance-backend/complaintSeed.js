const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database"); // Adjust path if needed
const User = require("./src/models/User");
const Complaint = require("./src/models/Complaint");

dotenv.config({ path: "./.env" });

const complaintsData = [
  {
    subject: "Claim payment delay",
    category: "Claims",
    policyNumber: "E390073",
    status: "In Progress",
    priority: "high",
    description: "My claim payment has been delayed for over 2 weeks.",
    response: "We are currently reviewing your case."
  },
  {
    subject: "Policy document not received",
    category: "Documentation",
    policyNumber: "S390074",
    status: "Resolved",
    priority: "medium",
    description: "I have not received my policy documents after registration.",
    response: "Documents have been sent to your registered email."
  },
  {
    subject: "Premium amount discrepancy",
    category: "Billing",
    policyNumber: "P390075",
    status: "Open",
    priority: "medium",
    description: "The premium amount charged is different from what was agreed.",
    response: null
  },
  {
    subject: "Unable to access online portal",
    category: "Technical",
    policyNumber: "E390076",
    status: "Closed",
    priority: "low",
    description: "I cannot log in to my account on the website.",
    response: "Issue resolved. Password reset link sent."
  }
];

const seedComplaints = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Ensure test client exists
    let user = await User.findOne({ email: "client@test.com" });
    if (!user) {
      user = await User.create({
        firstName: "Test",
        lastName: "Client",
        username: "testclient",
        email: "client@test.com",
        password: "password123",
        idNumber: "1234567890",
        role: "client"
      });
    }

    // 3. Clear existing complaints
    await Complaint.deleteMany({});

    // 4. Assign unique complaintNumber for each complaint
    const complaintsWithUser = complaintsData.map((c, index) => ({
    ...c,
    complaintNumber: `CMP-${new Date().getFullYear()}-${String(index + 1).padStart(3, "0")}`,
    user: user._id
  }));
    // 5. Insert complaints
    await Complaint.insertMany(complaintsWithUser);

    console.log("Sample complaints seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding complaints:", error);
    process.exit(1);
  }
};

seedComplaints();
