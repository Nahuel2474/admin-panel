const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const database = require('./database/database')
var bodyParser = require('body-parser')
require('dotenv').config()



const app = express();

// Settings
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(morgan("dev")); 
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/router'));

app.listen(3000, () => {
  console.log("Connected");
});
