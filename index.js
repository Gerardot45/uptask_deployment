const express = require("express");
const routes = require("./routes/index");
const path = require("path");
const bodyparser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
//importar las variables
require("dotenv").config({ path: "variables.env" });

//const
const helpers = require("./helpers");

const db = require("./config/db");

require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("conectado al servidor"))
  .catch((error) => console.log(error));

//crear una app de express
const app = express();

//cargar archivos estáticos
app.use(express.static("public"));

//habilitar pug
app.set("view engine", "pug");

//habilitar body-parser
app.use(bodyparser.urlencoded({ extended: true }));

//Agregar flash-messages
app.use(flash());

app.use(cookieParser());

//Nos permiten navegar en diferentes páginas, sin volverse a autenticar
app.use(
  session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

//pasar vardump a la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  console.log(res.locals.usuario);
  next();
});

app.set("views", path.join(__dirname, "./views"));

app.use("/", routes());

//Servidor y puesto
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;
app.listen(port, host, console.log("servidor funcionando"));
//require('./handlers/email')
