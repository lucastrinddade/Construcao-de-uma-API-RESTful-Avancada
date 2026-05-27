const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'],
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
      select: false, // nunca retorna a senha nas queries
    },
  },
  {
    timestamps: true,
  }
);

// Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function (senhaFornecida) {
  return await bcrypt.compare(senhaFornecida, this.senha);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
