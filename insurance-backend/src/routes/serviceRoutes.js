const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getServiceCategories
} = require("../controllers/servicesController");

const { protect, authorize } = require("../middleware/auth");

// ==================== PUBLIC ROUTES ====================
// Get all services (public access)
router.get("/", getAllServices);

// Get service by ID (public access)
router.get("/:id", getServiceById);

// Get service categories with counts
router.get("/categories/list", getServiceCategories);

// ==================== CLIENT ROUTES (Protected) ====================
// Submit service application (authenticated users)
router.post("/applications", protect, submitApplication);

// Get my applications (authenticated users)
router.get("/applications/my-applications", protect, getMyApplications);

// ==================== ADMIN ROUTES (Protected + Admin Only) ====================
// Create new service
router.post("/", protect, authorize("admin"), createService);

// Update service
router.put("/:id", protect, authorize("admin"), updateService);

// Delete service
router.delete("/:id", protect, authorize("admin"), deleteService);

// Get all applications (admin only)
router.get("/applications/all", protect, authorize("admin"), getAllApplications);

// Update application status (admin only)
router.put("/applications/:id/status", protect, authorize("admin"), updateApplicationStatus);

module.exports = router;