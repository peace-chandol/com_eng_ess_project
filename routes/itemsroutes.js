const express = require("express");
const itemsController = require("../controller/itemsController");

const router = express.Router();

router.get("/", itemsController.getItem);
router.get("/:student_id", itemsController.getStudentInfo);
router.get("/:student_id/tasks", itemsController.getStudentTasks);
router.get("/:student_id/subjects", itemsController.getStudentSubjects);

router.post("/:student_id/tasks", itemsController.addTask);
router.post("/:student_id/subjects", itemsController.addSubject);

router.put("/:student_id/tasks", itemsController.updateTaskStatus);

router.delete("/:student_id/tasks/:item_name", itemsController.deleteTask);

console.log("route is connecting")

module.exports = router;
