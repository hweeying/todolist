const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./config/database");
const app = express();

var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// simple route
app.get("/", (req, res) => res.send("Welcome to TodoList"));

//
app.use("/api/todos", require("./routes/todos.routes"));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

db.sync();
