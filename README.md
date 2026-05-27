# API RESTful MVC com JWT

API RESTful construída com Node.js, Express e MongoDB utilizando arquitetura MVC com autenticação via JWT.

##  Arquitetura

```
src/
├── config/
│   └── database.js          # Configuração do MongoDB
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   ├── userController.js    # Lógica de usuários
│   └── taskController.js    # Lógica de tarefas
├── middlewares/
│   └── auth.js              # Middleware de autenticação JWT
├── models/
│   ├── User.js              # Schema de Usuário (Mongoose)
│   └── Task.js              # Schema de Tarefa (Mongoose)
├── routes/
│   ├── authRoutes.js        # Rotas de autenticação
│   ├── userRoutes.js        # Rotas de usuários
│   └── taskRoutes.js        # Rotas de tarefas
├── app.js                   # Configuração do Express
└── server.js                # Ponto de entrada
```

##  Como executar

### 1. Pré-requisitos
- Node.js v18+
- MongoDB (local ou Atlas)

### 2. Instalação

```bash
# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Configurar `.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/api-mvc
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
```

### 4. Executar

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload)
npm run dev
```

---

##  Endpoints

###  Autenticação (público)

#### Registrar usuário
```
POST /api/auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta (201):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário cadastrado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "64abc...",
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "123456"
}
```

---

###  Usuários (requer token JWT)

> Envie o token no header: `Authorization: Bearer <token>`

| Método | Rota               | Descrição                   |
|--------|--------------------|-----------------------------|
| GET    | /api/usuarios      | Listar todos os usuários    |
| GET    | /api/usuarios/:id  | Buscar usuário por ID       |
| PUT    | /api/usuarios/:id  | Atualizar usuário           |
| DELETE | /api/usuarios/:id  | Deletar usuário             |

#### Atualizar usuário
```
PUT /api/usuarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João Atualizado",
  "email": "joao.novo@email.com"
}
```

---

###  Tarefas (requer token JWT)

| Método | Rota              | Descrição                        |
|--------|-------------------|----------------------------------|
| GET    | /api/tarefas      | Listar tarefas do usuário        |
| GET    | /api/tarefas/:id  | Buscar tarefa por ID             |
| POST   | /api/tarefas      | Criar nova tarefa                |
| PUT    | /api/tarefas/:id  | Atualizar tarefa                 |
| DELETE | /api/tarefas/:id  | Deletar tarefa                   |

#### Criar tarefa
```
POST /api/tarefas
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Estudar Node.js",
  "descricao": "Revisar conceitos de Express e Mongoose",
  "status": "pendente"
}
```

#### Filtrar por status
```
GET /api/tarefas?status=pendente
GET /api/tarefas?status=em_andamento
GET /api/tarefas?status=concluida
```

**Status disponíveis:** `pendente` | `em_andamento` | `concluida`

---

##  Modelos de Dados

### User
| Campo     | Tipo   | Obrigatório | Observações              |
|-----------|--------|-------------|--------------------------|
| nome      | String | ✅           | Mínimo 1 caractere       |
| email     | String | ✅           | Único, formato válido    |
| senha     | String | ✅           | Mínimo 6 chars, hasheada |
| createdAt | Date   | Auto        | Gerado automaticamente   |
| updatedAt | Date   | Auto        | Gerado automaticamente   |

### Task
| Campo     | Tipo     | Obrigatório | Observações                      |
|-----------|----------|-------------|----------------------------------|
| titulo    | String   | ✅           | Título da tarefa                 |
| descricao | String   | ❌           | Descrição opcional               |
| status    | String   | ❌           | Default: `pendente`              |
| usuario   | ObjectId | ✅           | Referência ao User               |
| createdAt | Date     | Auto        | Gerado automaticamente           |
| updatedAt | Date     | Auto        | Gerado automaticamente           |

---

##  Segurança

- Senhas criptografadas com **bcryptjs** (salt rounds: 12)
- Autenticação via **JWT** com expiração configurável
- Usuários só podem editar/deletar seus próprios dados
- Tarefas isoladas por usuário (cada um vê apenas as suas)
- Senha nunca retornada nas respostas (`select: false`)

##  Dependências

| Pacote        | Versão  | Uso                          |
|---------------|---------|------------------------------|
| express       | ^4.18.2 | Framework web                |
| mongoose      | ^8.0.3  | ODM para MongoDB             |
| jsonwebtoken  | ^9.0.2  | Geração e verificação de JWT |
| bcryptjs      | ^2.4.3  | Hash de senhas               |
| dotenv        | ^16.3.1 | Variáveis de ambiente        |
| nodemon       | ^3.0.2  | Hot-reload em desenvolvimento|
