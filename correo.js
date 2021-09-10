const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "marioplantabaja@gmail.com",
    pass: "pvcoahphnavarflx",
  },
});

const send = async (nombre, descripcion, monto, correos) => {
  let mailOptions = {
    from: "marioplantabaja@gmail.com",
    to: ["marioplantabaja@gmail.com"].concat(correos),
    subject: `Nuevo gasto agregado`,
    html: `<h3>Se ha registrado un nuevo gasto de ${nombre}. La descripción es: ${descripcion}, por un monto de $.${monto}</h3>`,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
  } catch (e) {
    throw e;
  }
};

module.exports = { send };
