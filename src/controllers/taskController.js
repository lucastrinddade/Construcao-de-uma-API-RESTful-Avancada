const Task = require('../models/Task');

// GET /api/tarefas - Listar todas as tarefas do usuário autenticado
const listarTarefas = async (req, res) => {
  try {
    const { status } = req.query;
    const filtro = { usuario: req.usuario._id };

    if (status) {
      filtro.status = status;
    }

    const tarefas = await Task.find(filtro)
      .populate('usuario', 'nome email')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      sucesso: true,
      total: tarefas.length,
      tarefas,
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar tarefas.',
      erro: error.message,
    });
  }
};

// GET /api/tarefas/:id - Buscar tarefa por ID
const buscarTarefa = async (req, res) => {
  try {
    const tarefa = await Task.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    })
      .populate('usuario', 'nome email')
      .select('-__v');

    if (!tarefa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Tarefa não encontrada.',
      });
    }

    res.status(200).json({
      sucesso: true,
      tarefa,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar tarefa.',
      erro: error.message,
    });
  }
};

// POST /api/tarefas - Criar nova tarefa
const criarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;

    if (!titulo) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O título é obrigatório.',
      });
    }

    const tarefa = await Task.create({
      titulo,
      descricao,
      status,
      usuario: req.usuario._id,
    });

    await tarefa.populate('usuario', 'nome email');

    res.status(201).json({
      sucesso: true,
      mensagem: 'Tarefa criada com sucesso.',
      tarefa,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ sucesso: false, mensagem: mensagens.join('. ') });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar tarefa.',
      erro: error.message,
    });
  }
};

// PUT /api/tarefas/:id - Atualizar tarefa
const atualizarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;
    const dadosAtualizados = {};
    if (titulo !== undefined) dadosAtualizados.titulo = titulo;
    if (descricao !== undefined) dadosAtualizados.descricao = descricao;
    if (status !== undefined) dadosAtualizados.status = status;

    const tarefa = await Task.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      dadosAtualizados,
      { new: true, runValidators: true }
    )
      .populate('usuario', 'nome email')
      .select('-__v');

    if (!tarefa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Tarefa não encontrada.',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Tarefa atualizada com sucesso.',
      tarefa,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ sucesso: false, mensagem: mensagens.join('. ') });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar tarefa.',
      erro: error.message,
    });
  }
};

// DELETE /api/tarefas/:id - Deletar tarefa
const deletarTarefa = async (req, res) => {
  try {
    const tarefa = await Task.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!tarefa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Tarefa não encontrada.',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Tarefa deletada com sucesso.',
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar tarefa.',
      erro: error.message,
    });
  }
};

module.exports = { listarTarefas, buscarTarefa, criarTarefa, atualizarTarefa, deletarTarefa };
