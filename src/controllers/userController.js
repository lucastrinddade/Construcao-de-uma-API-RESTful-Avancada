const User = require('../models/User');

// GET /api/usuarios - Listar todos os usuários (sem senha)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('-__v');
    res.status(200).json({
      sucesso: true,
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar usuários.',
      erro: error.message,
    });
  }
};

// GET /api/usuarios/:id - Buscar usuário por ID
const buscarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-__v');
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado.',
      });
    }
    res.status(200).json({
      sucesso: true,
      usuario,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID inválido.',
      });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar usuário.',
      erro: error.message,
    });
  }
};

// PUT /api/usuarios/:id - Atualizar usuário
const atualizarUsuario = async (req, res) => {
  try {
    // Somente o próprio usuário pode se atualizar
    if (req.usuario._id.toString() !== req.params.id) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para atualizar este usuário.',
      });
    }

    const { nome, email } = req.body;
    const dadosAtualizados = {};
    if (nome) dadosAtualizados.nome = nome;
    if (email) dadosAtualizados.email = email;

    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      dadosAtualizados,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado.',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso.',
      usuario,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ sucesso: false, mensagem: mensagens.join('. ') });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar usuário.',
      erro: error.message,
    });
  }
};

// DELETE /api/usuarios/:id - Deletar usuário
const deletarUsuario = async (req, res) => {
  try {
    if (req.usuario._id.toString() !== req.params.id) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para deletar este usuário.',
      });
    }

    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado.',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso.',
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar usuário.',
      erro: error.message,
    });
  }
};

module.exports = { listarUsuarios, buscarUsuario, atualizarUsuario, deletarUsuario };
