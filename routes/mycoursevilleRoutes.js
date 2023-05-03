const express = require("express");
const mycoursevilleController = require("../controller/mycoursevilleController");

const router = express.Router();

router.get("/auth_app", mycoursevilleController.authApp);
router.get("/access_token", mycoursevilleController.accessToken);
router.get("/get_profile_info", mycoursevilleController.getProfileInformation);
router.get("/get_courses", mycoursevilleController.getCourses);
router.get(
    "/get_course_assignments/:cv_cid",
    mycoursevilleController.getCourseAssignments
);
router.get(
    "/get_assignment_detail/:item_id",
    mycoursevilleController.getAssignmentDetail
);
router.get("/logout", mycoursevilleController.logout);

module.exports = router;
