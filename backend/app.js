const express = require("express");
const mongoose = require("mongoose");
const path=require("path");

const korisniciRoutes = require("./routes/korisnici");
const terapeutiRoutes = require("./routes/terapeuti");
const klijentiRoutes = require("./routes/klijenti");
const tipoviTerapijaRoutes = require("./routes/tipoviTerapija");
const terapijeRoutes = require("./routes/terapije");
const savetovalistaRoutes = require("./routes/savetovalista");
const testoviRoutes = require("./routes/testovi");
const recenzijeRoutes = require("./routes/recenzije");
const terminiRoutes = require("./routes/termini");

mongoose
  .connect(
    "mongodb+srv://miljanasimic:MqA3HKtEKJvm6zIM@therapymate.fiavd.mongodb.net/therapyMate?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Uspostavljena konekcija sa bazom");
  })
  .catch((er) => {
    console.log("Doslo je do greske...");
    console.log(er);
  });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images",express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.use("/korisnici", korisniciRoutes);
app.use("/terapeuti", terapeutiRoutes);
app.use("/klijenti", klijentiRoutes);
app.use("/tipoviTerapija", tipoviTerapijaRoutes);
app.use("/terapije", terapijeRoutes);
app.use("/savetovaliste", savetovalistaRoutes);
app.use("/testovi", testoviRoutes);
app.use("/recenzije", recenzijeRoutes);
app.use("/termini", terminiRoutes);

module.exports = app;
