const express = require('express');
const router = express.Router();
const { autenticar } = require('../middlewares/auth');
const {
  listarTarefas,
  buscarTarefa,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa,
} = require('../controllers/taskController');

// Todas as rotas exigem autenticação
router.use(autenticar);

/**
 * @route   GET /api/tarefas
 * @desc    Listar tarefas do usuário autenticado (filtro opcional: ?status=pendente)
 * @access  Privado
 */
router.get('/', listarTarefas);

/**
 * @route   GET /api/tarefas/:id
 * @desc    Buscar tarefa por ID
 * @access  Privado
 */
router.get('/:id', buscarTarefa);

/**
 * @route   POST /api/tarefas
 * @desc    Criar nova tarefa
 * @access  Privado
 */
router.post('/', criarTarefa);

/**
 * @route   PUT /api/tarefas/:id
 * @desc    Atualizar tarefa
 * @access  Privado
 */
router.put('/:id', atualizarTarefa);

/**
 * @route   DELETE /api/tarefas/:id
 * @desc    Deletar tarefa
 * @access  Privado
 */
router.delete('/:id', deletarTarefa);

module.exports = router;
