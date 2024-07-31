const express = require("express");

const { login, signUp } = require("../controllers/auth");

const router = express.Router();

router.post("/user/login", login);
router.post("/user/signup", signUp);

module.exports = router;
