const express = require('express');
const assignmentController = require('../controller/assignmentsController');
const router = express.Router();

router.post('/', assignmentController.addAssignment);
router.get('/', assignmentController.getAssignedAssignments);
router.get('/missed', assignmentController.getMissedAssignments);
router.get('/done', assignmentController.getDoneAssignments);
router.get('/courses', assignmentController.getCourses);

module.exports = router;
