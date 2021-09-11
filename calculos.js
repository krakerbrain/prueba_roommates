const fs = require("fs");

const agregaGasto = (body) => {
  let verRm = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  let datosRm = verRm.roommates;
  let conteoRm = datosRm.length;

  datosRm.map((e) => {
    if (e.nombre == body.roommate) {
      let recibe = body.monto / conteoRm;
      e.recibe += parseFloat(recibe.toFixed(2));
    } else if (e.nombre !== body.roommate) {
      let debe = body.monto / conteoRm;
      e.debe += parseFloat(debe.toFixed(2));
    }

    fs.writeFileSync("roommates.json", JSON.stringify(verRm, null, 1));
  });
};

const modificaGasto = (body) => {
  let verRm = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  let datosRm = verRm.roommates;
  let conteoRm = datosRm.length;

  datosRm.map((e) => {
    if (e.nombre == body.roommate) {
      let recibe;
      recibe = body.monto / conteoRm;
      e.recibe = parseFloat(recibe.toFixed(2));
    } else if (e.nombre !== body.roommate) {
      let debe;
      debe = body.monto / conteoRm;
      e.debe = parseFloat(debe.toFixed(2));
    }

    fs.writeFileSync("roommates.json", JSON.stringify(verRm, null, 1));
  });
};

module.exports = { agregaGasto, modificaGasto };
