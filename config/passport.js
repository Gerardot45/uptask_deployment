const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Referencia al modelo a autenticar

const Usuarios = require("../models/Usuarios");

//Local strategy
passport.use(
  new LocalStrategy(
    //por default, passport espera un usuario y una contraseña
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1,
          },
        });

        //el usuario existe, pero el password es incorrecto
        if (!usuario.verificarPassword(password)) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        //Email existe, password correcto
        return done(null, usuario);
      } catch (error) {
        //Ese usuario no existe
        return done(null, false, { message: "Ese usuario no existe" });
      }
    }
  )
);

//Serializar y desserializar el usuario

passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;
