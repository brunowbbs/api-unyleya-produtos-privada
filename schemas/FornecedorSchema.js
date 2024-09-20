const { Schema, model } = require("mongoose");

const FornecedorSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
});

module.exports = model("Fornecedor", FornecedorSchema);
