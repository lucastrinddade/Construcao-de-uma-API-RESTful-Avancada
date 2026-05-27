const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pendente', 'em_andamento', 'concluida'],
        message: 'Status inválido. Use: pendente, em_andamento ou concluida',
      },
      default: 'pendente',
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O usuário é obrigatório'],
    },
  },
  {
    timestamps: true,
  }
);

// Index para melhor performance nas buscas por usuário
taskSchema.index({ usuario: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
