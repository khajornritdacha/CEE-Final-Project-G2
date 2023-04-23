const express = require("express");
const itemsController = require("../controller/itemsController");

const router = express.Router();

router.get("/", itemsController.getItems);
router.get("/members", itemsController.getGroupMembers);
router.post("/", itemsController.addItem);
router.delete("/:item_id", itemsController.deleteItem);

module.exports = router;
