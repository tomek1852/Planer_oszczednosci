const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kind: {
    type: String,
    enum: ['income', 'expense'], // dochód / wydatek
    required: true
  },
  name: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null // null = kategoria główna, nie podkategoria
  }
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category
