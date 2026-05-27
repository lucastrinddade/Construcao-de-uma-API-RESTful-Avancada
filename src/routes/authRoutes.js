const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

/**
 * @route   POST /api/auth/registrar
 * @desc    Registrar novo usuário
 * @access  Público
 */
router.post('/registrar', registrar);

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuário e retornar token JWT
 * @access  Público
 */
router.post('/login', login);

module.exports = router;
