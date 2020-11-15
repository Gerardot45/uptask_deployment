const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const Sequilize = require("sequelize");
const Op = Sequilize.Op;
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const enviarEmail = require("../handlers/email");
exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

//Funcion para revisar si el usuario está logueado o no
exports.usuarioAutenticado = (req, res, next) => {
  //si el usuario está autenticado, adelante
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/iniciar-sesion");
};

//función para cerrar sesión

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

//Genera un token si el usuario es válido
exports.enviarToken = async (req, res) => {
  //Varificar que el usuario exista
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  //Si no existe el usuario
  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/reestablecer");
  }

  //El usuario existe
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  //Guardarlos en la base de datos
  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  await enviarEmail.enviar({
    usuario,
    subject: "Password reset",
    resetUrl,
    archivo: "reestablecer-password",
  });

  //terminar la ejecución del envio del mail
  req.flash(
    "correcto",
    "Se envió el correo correctamente. Revisa tu bandeja de entrada"
  );
  res.redirect("/iniciar-sesion");
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash("error", "No válido");
    res.redirect("/reestablecer");
  }

  //Formulario para generar la contraseña
  res.render("resetPassword", {
    nombrePagina: "Reestablecer contraseña",
  });
};

//Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
  //verifica el toekn valido y la fecha de expiracion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });

  //verificamos si el usuario existe
  if (!usuario) {
    req.flash("error", "No válido");
    req.redirect("/reestablecer");
  }

  //hashear el nuevo password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  //Guardamos el nuevo password
  await usuario.save();

  req.flash("correcto", "Tu password se ha modificado correctamente");
  res.redirect("/iniciar-sesion");
};
