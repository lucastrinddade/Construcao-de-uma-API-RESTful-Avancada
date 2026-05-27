const express = require('express');
const router = express.Router();
const { autenticar } = require('../middlewares/auth');
const {
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} = require('../controllers/userController');

// Todas as rotas abaixo exigem autenticação
router.use(autenticar);

/**
 * @route   GET /api/usuarios
 * @desc    Listar todos os usuários
 * @access  Privado
 */
router.get('/', listarUsuarios);

/**
 * @route   GET /api/usuarios/:id
 * @desc    Buscar usuário por ID
 * @access  Privado
 */
router.get('/:id', buscarUsuario);

/**
 * @route   PUT /api/usuarios/:id
 * @desc    Atualizar dados do usuário
 * @access  Privado (somente o próprio usuário)
 */
router.put('/:id', atualizarUsuario);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Deletar usuário
 * @access  Privado (somente o próprio usuário)
 */
router.delete('/:id', deletarUsuario);

module.exports = router;
