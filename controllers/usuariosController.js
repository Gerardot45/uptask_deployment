const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");
exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear cuenta en UpTask",
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "inicia sesión   en UpTask",
    error,
  });
};

exports.CrearCuenta = async (req, res) => {
  //Leer los datos
  const { email, password } = req.body;

  try {
    //Crear el usuario
    await Usuarios.create({
      email,
      password,
    });

    //Crear una url de confirmación
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    //Crear el objeto de usuario
    const usuario = { email };
    //Enviar email
    await enviarEmail.enviar({
      usuario,
      subject: "Confirma tu cuenta Uptask",
      confirmarUrl,
      archivo: "confirmar-cuenta",
    });
    //redirigir al usuario
    req.flash("correcto", "Confirma tu cuenta. Revisa tu e-mail");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    //console.log(error);
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear cuenta de Uptask",
      email,
      password,
    });
  }
};

exports.formResetRestablecerPassword = (req, res) => {
  res.render("reestablecer", {
    nombrePagina: "Restablece tu contraseña",
  });
};

//Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });

  if (!usuario) {
    req.flash("error", "no válido");
    res.redirect("/crear-cuenta");
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash("correcto", "Cuenta activada correctamente");
  res.redirect("/iniciar-sesion");
};
