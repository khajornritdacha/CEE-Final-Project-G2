const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();

router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);
router.get("/get_profile_info", coursevilleController.getProfileInformation);
router.get("/get_courses", coursevilleController.getCourses);
router.get(
  "/get_course_assignments/:cv_cid",
  coursevilleController.getCourseAssignments
);
router.get(
  "/get_assignment_detail/:item_id",
  coursevilleController.getAssignmentDetail
);
router.get("/logout", coursevilleController.logout);

module.exports = router;
