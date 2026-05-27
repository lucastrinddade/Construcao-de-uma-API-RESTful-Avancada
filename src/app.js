const express = require('express');
const app = express();

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/tarefas', taskRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API MVC com JWT está funcionando!',
    versao: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/registrar': 'Registrar novo usuário',
        'POST /api/auth/login': 'Autenticar e obter token',
      },
      usuarios: {
        'GET /api/usuarios': 'Listar usuários (autenticado)',
        'GET /api/usuarios/:id': 'Buscar usuário por ID (autenticado)',
        'PUT /api/usuarios/:id': 'Atualizar usuário (autenticado)',
        'DELETE /api/usuarios/:id': 'Deletar usuário (autenticado)',
      },
      tarefas: {
        'GET /api/tarefas': 'Listar tarefas do usuário (autenticado)',
        'GET /api/tarefas/:id': 'Buscar tarefa por ID (autenticado)',
        'POST /api/tarefas': 'Criar tarefa (autenticado)',
        'PUT /api/tarefas/:id': 'Atualizar tarefa (autenticado)',
        'DELETE /api/tarefas/:id': 'Deletar tarefa (autenticado)',
      },
    },
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota ${req.originalUrl} não encontrada.`,
  });
});

// Handler de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno no servidor.',
    erro: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

module.exports = app;
