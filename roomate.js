const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
// 1. Ocupar el módulo File System para la manipulación de archivos alojados en el
// servidor (3 Puntos)
// 2. Capturar los errores para condicionar el código a través del manejo de excepciones.
// (1 Punto)

const nuevoRoommate = async () => {
  try {
    const { data } = await axios.get("https://randomuser.me/api/");
    const usuario = data.results[0];
    const user = {
      id: uuidv4().slice(30),
      nombre: `${usuario.name.first} ${usuario.name.last}`,
      debe: 0,
      recibe: 0,
      correo: usuario.email,
    };
    return user;
  } catch (e) {
    throw e;
  }
};

// 3. El botón “Agregar roommate” de la aplicación cliente genera una petición POST (sin
//   payload) esperando que el servidor registre un nuevo roommate random con la API
//   randomuser, por lo que debes preparar una ruta POST /roommate en el servidor que
//   ejecute una función asíncrona importada de un archivo externo al del servidor (la
//   función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule
//   en un JSON (roommates.json).
//   El objeto correspondiente al usuario que se almacenará debe tener un id generado
//   con el paquete UUID. (2 Puntos)

const guardarUsuario = (usuario) => {
  const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  roommatesJSON.roommates.push(usuario);
  fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
};
// Se creó una función de RESET que facilita las pruebas en la App

const reset = (usuario) => {
  const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
  roommatesJSON.roommates.length = 0;
  gastosJSON.gastos.length = 0;

  fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
  fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
};

module.exports = { nuevoRoommate, guardarUsuario, reset };
