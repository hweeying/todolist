const Sequelize = require("sequelize");

const db = require("../config/database");

const TodoModel = db.define("todos", {
  text: {
    type: Sequelize.STRING,
  },
  isEdit: {
    type: Sequelize.BOOLEAN,
  },
  checked: {
    type: Sequelize.BOOLEAN,
  },

});

module.exports = TodoModel;
