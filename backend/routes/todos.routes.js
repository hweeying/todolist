const express = require("express");
const router = express.Router();
const db = require("../config/database");
const TodoModel = require("../models/todo");

// Create new Todos
router.post("/", (req, res) => {
  if (!req.body.text) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const todo = {
    text: req.body.text,
    isEdit: req.body.isEdit ? req.body.isEdit : false,
    checked: req.body.checked ? req.body.checked : false,
  };

  TodoModel.create(todo)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Todo.",
      });
    });
});


// Retrieve all Todos from Todos(database)
router.get("/", (req, res) => {
  const text = req.query.text;
  var condition = text ? { text: { [Op.like]: `%${text}%` } } : null;

  TodoModel.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving todos.",
      });
    });
});

// Update a Todo by the id in the request
router.put("/:id", (req, res) => {
  const id = req.params.id;
  
  TodoModel.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Todo was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Todo with id=${id}. Maybe Todo was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Todo with id=" + id,
      });
    });
});
// Delete a Todo with the specified id in the request
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  TodoModel.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Todo was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Todo with id=${id}. Maybe Todo was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Todo with id=" + id,
      });
    });
});

module.exports = router;
