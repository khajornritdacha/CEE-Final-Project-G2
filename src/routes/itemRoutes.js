<<<<<<< HEAD
const express = require("express");
const itemsController = require("../controller/itemsController");

const router = express.Router();

router.get("/", itemsController.getItems);
router.get("/members", itemsController.getGroupMembers);
router.post("/", itemsController.addItem);
router.delete("/:item_id", itemsController.deleteItem);
=======
const express = require('express');
const itemsController = require('../controller/itemsController');

const router = express.Router();

router.get('/', itemsController.getItems);
router.get('/members', itemsController.getGroupMembers);
router.post('/', itemsController.addItem);
router.delete('/:item_id', itemsController.deleteItem);
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046

module.exports = router;
