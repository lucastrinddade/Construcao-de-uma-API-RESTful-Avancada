const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gera o token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/registrar
const registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se todos os campos foram fornecidos
    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, email e senha são obrigatórios.',
      });
    }

    // Verificar se email já está em uso
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'Este email já está cadastrado.',
      });
    }

    // Criar novo usuário (senha é hasheada automaticamente pelo middleware do model)
    const usuario = await User.create({ nome, email, senha });

    const token = gerarToken(usuario._id);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso.',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    // Erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: mensagens.join('. '),
      });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno no servidor.',
      erro: error.message,
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios.',
      });
    }

    // Buscar usuário com a senha (select: false no model)
    const usuario = await User.findOne({ email }).select('+senha');
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Email ou senha incorretos.',
      });
    }

    // Verificar senha
    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Email ou senha incorretos.',
      });
    }

    const token = gerarToken(usuario._id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno no servidor.',
      erro: error.message,
    });
  }
};

module.exports = { registrar, login };
