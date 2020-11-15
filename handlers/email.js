const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const emailConfig = require("../config/email");

//Generar HTML
const generarHTML = (archivo, opciones = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${archivo}.pug`,
    opciones
  );
  return juice(html);
};
exports.enviar = async (opciones) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });
  const html = generarHTML(opciones.archivo, opciones);
  const text = htmlToText.fromString(html);
  let mailOptions = {
    from: "Uptask <no-reply@uptask.com>", // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subject, // Subject line
    text, // plain text body
    html, // html body
  };
  console.log(mailOptions);
  const enviarEmail = transporter.sendMail(mailOptions);
  return enviarEmail;
};
