const jwt = require('jsonwebtoken');
const User = require('../models/User');

const autenticar = async (req, res, next) => {
  try {
    // 1. Verificar se o token foi enviado
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Acesso negado. Token não fornecido.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar validade do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Verificar se o usuário ainda existe
    const usuario = await User.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado. Faça login novamente.',
      });
    }

    // 4. Adicionar usuário ao request
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token expirado. Faça login novamente.',
      });
    }
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno no servidor.',
    });
  }
};

module.exports = { autenticar };
