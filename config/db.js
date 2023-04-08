const mg = require("mongoose");

const connection = mg.connect(
  `mongodb+srv://mandar:mandar@cluster0.le1hx.mongodb.net/bank?retryWrites=true&w=majority`
);

module.exports = connection;
