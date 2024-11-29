const express = require("express");
const router = express.Router();
const { loginUser, registerUser, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const {checkDuplicateEmail, verifyToken, renewToken} = require('../middlewares/index');
// Ruta para registro de usuario
router.post("/register", [checkDuplicateEmail], registerUser);

// Ruta para inicio de sesión
router.post("/login", loginUser);

//jwt 
router.get("/renew", verifyToken, renewToken);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);


module.exports = router;