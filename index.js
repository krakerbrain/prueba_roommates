const http = require("http");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const url = require("url");
const { nuevoRoommate, guardarUsuario, borrarUsuario } = require("./roomate.js");

http
  .createServer((req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");
      res.end(fs.readFileSync("index.html", "utf8"));
    }

    if (req.url.startsWith("/roommate") && req.method == "POST") {
      nuevoRoommate()
        .then(async (usuario) => {
          guardarUsuario(usuario);
          res.end(JSON.stringify(usuario, null, 1));
        })
        .catch((e) => {
          res.statusCode = 500;
          res.end();
          console.log("Error en el registro de un usuario random", e);
        });
    }

    if (req.url.startsWith("/deleteUser") && req.method == "DELETE") {
      nuevoRoommate()
        .then(async (usuario) => {
          borrarUsuario(usuario);
          res.end(JSON.stringify(usuario, null, 1));
        })
        .catch((e) => {
          res.statusCode = 500;
          res.end();
          console.log("Error borrando usuario", e);
        });
    }

    if (req.url.startsWith("/roommates") && req.method == "GET") {
      res.setHeader("content-type", "application/json");
      res.end(fs.readFileSync("roommates.json", "utf8"));
    }

    // Array que contiene todos los datos desde el archivo
    let gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    let gastos = gastosJSON.gastos;

    // Ruta para disponibilizar los datos desde archivo gastos.json
    if (req.url.startsWith("/gastos") && req.method == "GET") {
      res.end(JSON.stringify(gastosJSON, null, 1));
    }

    // Ruta para agregar nuevos registros al archivo gastos.json
    if (req.url.startsWith("/gasto") && req.method == "POST") {
      let body;

      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });

      req.on("end", () => {
        gasto = {
          id: uuidv4().slice(30),
          roommate: body.roommate,
          descripcion: body.descripcion,
          monto: body.monto,
        };

        gastos.push(gasto);

        let verRm = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        let datosRm = verRm.roommates;
        let conteoRm = datosRm.length;

        datosRm.map((e) => {
          if (e.nombre == body.roommate) {
            let recibe = body.monto / conteoRm;
            e.recibe += recibe;
          } else if (e.nombre !== body.roommate) {
            let debe = body.monto / conteoRm;
            e.debe += debe;
          }
          fs.writeFileSync("roommates.json", JSON.stringify(verRm, null, 1));
        });

        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 1));
        res.end();
        console.log("Gasto registrado con éxito en el archivo gastos.json");
      });
    }

    // Ruta para actualizar registros del archivo gastos.json
    if (req.url.startsWith("/gasto") && req.method == "PUT") {
      let body;

      // Traer el id a través de query strings
      const { id } = url.parse(req.url, true).query;

      req.on("data", (payload) => {
        body = JSON.parse(payload);
        body.id = id;
      });

      req.on("end", () => {
        let verRm = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        let datosRm = verRm.roommates;
        let conteoRm = datosRm.length;
        datosRm.map((e) => {
          if (e.nombre == body.roommate) {
            let recibe = body.monto / conteoRm;
            console.log("recibe " + recibe);
            e.recibe = recibe;
            console.log("formula " + (e.recibe += recibe));
          } else if (e.nombre !== body.roommate) {
            let debe = body.monto / conteoRm;

            e.debe = debe;
          }
          fs.writeFileSync("roommates.json", JSON.stringify(verRm, null, 1));
        });

        gastosJSON.gastos = gastos.map((g) => {
          if (g.id == body.id) {
            return body;
          }
          return g;
        });
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 1));
        res.end();
      });
    }
    // Ruta para borrar registros del archivo gastos.json
    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;

      gastosJSON.gastos = gastos.filter((g) => g.id !== id);

      fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 1));
      res.end();
    }
  })
  .listen(3000, console.log("Servidor ON"));
