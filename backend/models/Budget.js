const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kind: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: false,
    default: ''
  },
  month: {
    type: Number,
    required: true, // 1-12
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  plannedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Budget = mongoose.model('Budget', BudgetSchema)

module.exports = Budget
