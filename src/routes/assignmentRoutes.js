const express = require('express');
const assignmentController = require('../controller/assignmentsController');
const router = express.Router();

router.post('/', assignmentController.addAssignment);
router.get('/', assignmentController.readAssignmentsMcv);

router.get('/', (req, res) => {
  res.send('hello');
});

module.exports = router;
