const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const {loginValidation,signupValidation}=require("../Middleware/AuthValidation");
const {signupController,loginController } = require("../Controller/AuthController");
const router = express.Router();

// Login Route
router.post('/login',loginValidation,loginController);

// Signup Route
router.post('/signup',signupValidation,signupController);

module.exports = router;
