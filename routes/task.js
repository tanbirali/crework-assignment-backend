const express = require("express");
const {
  getBoard,
  createCard,
  reorderCard,
  moveCard,
  editCard,
  deleteCard,
} = require("../controllers/tasks");
const router = express.Router();

router.get("/task/:id", getBoard);
router.post("/task/new", createCard);

router.put("/task/reorder", reorderCard);
router.put("/task/move", moveCard);

router.put("/task/edit", editCard);
router.put("/task/delete", deleteCard);
module.exports = router;
