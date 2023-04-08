const mg = require("mongoose");

const ledgerSchema = mg.Schema({
  id: String,
  email: { type: String, required: true },
  pan: { type: String, required: true },
  desc: { type: String, required: true },
  trans: { type: String, required: true },
  balance: { type: Number, required: true },
  amount: Number,
});

const ledgerModel = mg.model("ledger", ledgerSchema);

module.exports = ledgerModel;
