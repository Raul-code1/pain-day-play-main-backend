const express = require("express");
const router = express.Router();

const {
  createCompany,
  getAllCompanies,
  getSingleCompay,
  updateCompany,
  deleteCompany,
  uploadImage,
} = require("../controllers/CompanyController");

const {
  authenticateUser,
  rolesPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllCompanies)
  .post([authenticateUser, rolesPermissions], createCompany);

router
  .route("/uploadImage")
  .post([authenticateUser, rolesPermissions], uploadImage);

router
  .route("/:id")
  .get(getSingleCompay)
  .patch([authenticateUser, rolesPermissions], updateCompany)
  .delete([authenticateUser, rolesPermissions], deleteCompany);

module.exports = router;
