const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const authCheck = require("../middleware/auth-check");

const Korisnik = require("../models/korisnik");
const Termin = require("../models/termin");
const Klijent = require("../models/klijent");
const Terapeut = require("../models/terapeut");
const Terapija = require("../models/terapija");
const TipTerapije = require("../models/tipTerapije");
const Test = require("../models/test");
const Recenzija = require("../models/recenzija");
const Odgovor = require("../models/odgovor");

//vraca sve klijente
router.get("", authCheck, async (req, res) => {
  try {
    const klijenti = await Klijent.find({});
    console.log(klijenti);
    res.send(klijenti);
  } catch {
    res.status(404).send("Doslo je do greske, pokusajte ponovo.");
  }
});

//vraca klijenta ciji je id prosledjen
router.get("/:id", authCheck, async (req, res) => {
  try {
    if (req.params.id.length == 24) {
      const klijent = await Klijent.findById(req.params.id);
      if (klijent) {
        console.log(klijent);
        res.send(klijent);
      } else {
        res
          .status(404)
          .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
      }
    } else
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  } catch {
    res.status(404).send("Doslo je do greske, pokusajte ponovo.");
  }
});

//vraca klijenta ciji je id prosledjen
router.get("/profil/:id", authCheck, async (req, res) => {
  try {
    if (req.params.id.length == 24) {
      const klijent = await Klijent.findById(req.params.id);
      if (klijent) {
        console.log(klijent);
        res.send({
          id: klijent._id,
          ime: klijent.ime,
          prezime: klijent.prezime,
          email: klijent.email,
          telefon: klijent.telefon,
          slika: klijent.slika,
          obavestenja: klijent.obavestenja.length,
          testovi: klijent.testovi.length,
        });
      } else {
        res
          .status(404)
          .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
      }
    } else
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  } catch {
    res.status(404).send("Doslo je do greske, pokusajte ponovo.");
  }
});

//vraca klijenta ciji je id prosledjen i njegove terapije
router.get("/:id/terapije", authCheck, async (req, res) => {
  try {
    if (req.params.id.length == 24) {
      const klijent = await Klijent.findById(req.params.id).populate(
        "terapije"
      );
      if (klijent) {
        console.log(klijent);
        res.send(klijent);
      } else {
        res
          .status(404)
          .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
      }
    } else
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  } catch {
    res.status(404).send("Doslo je do greske, pokusajte ponovo.");
  }
});

//vraca klijenta ciji je id prosledjen i njegove terapije plus naziv tipa plus info o terapeutu
router.get("/:id/terapijeInfo", authCheck, async (req, res) => {
  try {
    if (req.params.id.length == 24) {
      const terapije = await Klijent.findById(req.params.id).select("terapije");
      console.log(terapije);
      const info = [];
      for (let ter of terapije.terapije) {
        console.log(ter.idTerapije);
        const t = await Terapija.findById(ter.idTerapije)
          .populate("tip", "naziv")
          .populate("terapeut", "ime prezime specijalizacija");
        console.log(t);
        info.push({
          idTerapije: t._id,
          detaljiTerapije: t.detalji,
          cena: t.cena,
          tipTerapije: t.tip.naziv,
          odradjeno: ter.odradjeno,
          ukupno: ter.ukupno,
          imeTerapeuta: t.terapeut.ime,
          prezimeTerapeuta: t.terapeut.prezime,
          specijalizacija: t.terapeut.specijalizacija,
          idTerapeuta: t.terapeut._id,
        });
      }
      res.send(info);
    } else {
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
    }
  } catch {
    res
      .status(404)
      .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  }
});

//vraca id svih terapeuta od klijenta ciji je id prosledjen
router.get("/:idKlijenta/terapeuti", authCheck, async (req, res) => {
  try {
    if (req.params.idKlijenta.length === 24) {
      console.log("vode");
      const terapeuti = await Terapeut.find({
        klijenti: req.params.idKlijenta,
      });
      console.log("cao");
      if (terapeuti) {
        console.log(req.params.idKlijenta);
        console.log(terapeuti);
        const izabraniTerapeuti = [];
        for (let t of terapeuti) {
          izabraniTerapeuti.push(t._id);
        }
        res.send(izabraniTerapeuti);
      } else
        res
          .status(404)
          .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
    } else
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  } catch {
    res
      .status(404)
      .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  }
});

//vraca informacije o klijentovim terapeutima
router.get("/:idKlijenta/terapeutiInfo", authCheck, async (req, res) => {
  try {
    const terapeuti = await Terapeut.find({ klijenti: req.params.idKlijenta });
    const terapeutiInfo = [];
    for (el of terapeuti) {
      terapeutiInfo.push({
        id: el._id,
        ime: el.ime,
        prezime: el.prezime,
        email: el.email,
        telefon: el.telefon,
        specijalizacija: el.specijalizacija,
        slika: el.slika,
      });
    }
    res.send(terapeutiInfo);
  } catch {
    res
      .status(404)
      .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  }
});

//vraca klijentove terapeute i njegove izabrane terapije kod njih
router.get("/:idKlijenta/terapeutiTerapije", authCheck, async (req, res) => {
  try {
    const terapijeKlijenta = await Klijent.findById(
      req.params.idKlijenta
    ).select("terapije");
    if (!terapijeKlijenta) {
      return res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
    }
    const terapeuti = await Terapeut.find({ klijenti: req.params.idKlijenta });
    const odgovor = [];
    let naziviTerapija = [];
    for (let terapeut of terapeuti) {
      naziviTerapija = [];
      for (let terapijaTerapeuta of terapeut.terapije) {
        for (let terapijaKlijenta of terapijeKlijenta.terapije) {
          if (
            String(terapijaKlijenta.idTerapije) == String(terapijaTerapeuta)
          ) {
            const nazivTer = await TipTerapije.findOne({
              terapije: terapijaKlijenta.idTerapije,
            }).select("naziv");
            naziviTerapija.push({
              idTerapije: terapijaTerapeuta,
              naziv: nazivTer.naziv,
            });
            break;
          }
        }
      }
      odgovor.push({
        idTerapeuta: terapeut._id,
        ime: terapeut.ime,
        prezime: terapeut.prezime,
        telefon: terapeut.telefon,
        terapije: naziviTerapija,
      });
    }
    res.send(odgovor);
  } catch {
    res
      .status(404)
      .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
  }
});

//klijent bira terapeuta
router.patch("/izborTerapeuta", authCheck, async (req, res) => {
  try {
    const terapeut = await Terapeut.findById(req.body.idTerapeuta);
    const klijent = await Klijent.findById(req.body.idKlijenta);
    if (!terapeut) {
      return res
        .status(404)
        .send(
          "Ovaj terapeut vise ne saradjuje sa nasim savetovaliste, probajte sa nekim drugim."
        );
    }
    if (klijent) {
      terapeut.klijenti.push(req.body.idKlijenta);
      await terapeut.save();
      res.send("Uspesna pretplata!");
    } else {
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
    }
  } catch {
    res.status(404).send("Doslo je do greske.");
  }
});

//klijent otkazuje terapeuta
router.patch("/otkazivanjeTerapeuta", authCheck, async (req, res) => {
  try {
    console.log("**************************************");
    const termini = await Termin.find({
      klijent: req.body.idKlijenta,
      terapeut: req.body.idTerapeuta,
    });
    console.log(termini);
    if (termini.length === 0) {
      const terapeut = await Terapeut.findByIdAndUpdate(req.body.idTerapeuta, {
        $pull: { klijenti: req.body.idKlijenta },
      });
      if (terapeut) {
        let klijent = await Klijent.findById(req.body.idKlijenata);
        console.log(terapeut.terapije);
        if (terapeut.terapije.length === 0) {
          console.log("if");
          return res.send("Uspesno otkazivanje!");
        }
        for (let ter of terapeut.terapije) {
          klijent = await Klijent.findByIdAndUpdate(req.body.idKlijenta, {
            $pull: { terapije: { idTerapije: ter._id } },
          });
          console.log(klijent);
        }
        if (klijent) {
          return res.send("Uspesno otkazivanje!");
        } else {
          return res
            .status(404)
            .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
        }
      } else {
        return res
          .status(404)
          .send(
            "Ovaj terapeut vise ne saradjuje sa nasim savetovaliste, Vasa saradnja je automatski otkazana."
          );
      }
    } else {
      return res
        .status(305)
        .send("Otkazivanje saradnje nije moguce jer imate zakazane termine!");
    }
  } catch {
    res.status(404).send("Doslo je do greske.");
  }
});

//klijent bira terapiju
router.patch("/izborTerapije", authCheck, async (req, res) => {
  try {
    const klijent = await Klijent.findById(req.body.idKlijenta);
    if (klijent) {
      const terapija = await Terapija.findById(req.body.idTerapije);
      if (terapija) {
        klijent.terapije.push({
          idTerapije: req.body.idTerapije,
          ukupno: 10,
          odradjeno: 0,
        });
        await klijent.save();
        const terapeut = await Terapeut.findOne({
          terapije: req.body.idTerapije,
        });
        const idKlijenata = terapeut.klijenti;
        const id = idKlijenata.findIndex((el) => el == req.body.idKlijenta);
        if (id === -1) {
          terapeut.klijenti.push(klijent);
          await terapeut.save();
        }
        res.send("Uspesan izbor terapije");
      } else {
        res
          .status(404)
          .send(
            "Terapeut vise ne nudi ovu terapiju, izaberite neku drugu terapiju."
          );
      }
    } else {
      res
        .status(404)
        .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
    }
  } catch {
    res.status(404).send("Doslo je do greske. Neuspesan izbor terapije!");
  }
});

//klijent otkazuje
router.patch("/otkazivanjeTerapije", authCheck, async (req, res) => {
  try {
    const terapija = await Terapija.findById(req.body.idTerapije);
    if (terapija) {
      const termin = await Termin.findOne({
        terapija: req.body.idTerapije,
        klijent: req.body.idKlijenta,
      });
      if (termin != null) {
        res
          .status(305)
          .send(
            "Neuspesno otkazivanje terapije jer imate zakazan termin za ovu terapiju."
          );
      } else {
        const klijent = await Klijent.findByIdAndUpdate(req.body.idKlijenta, {
          $pull: { terapije: { idTerapije: req.body.idTerapije } },
        });
        if (klijent) {
          res.send("Uspesno ste otkazali terapiju!");
        } else {
          res
            .status(404)
            .send("Doslo je do greske, pokusajte da se prijavite ponovo.");
        }
      }
    } else {
      res
        .status(404)
        .send(
          "Terapeut vise ne nudi ovu terapiju, terapija Vam je automatski otkazana."
        );
    }
  } catch {
    res.status(404).send("Neuspešno otkazivanje terapije, probajte kasnije.");
  }
});

//brise nalog klijenta ciji je id prosledjen
router.delete("/:id", authCheck, async (req, res) => {
  try {
    const klijent = await Klijent.findById(req.params.id);

    //brise se nalog klijenta iz kolekcije korisnik
    await Korisnik.findOneAndDelete({ email: klijent.email });

    //terapeutima se brise klijent
    await Terapeut.updateMany(
      { klijenti: req.params.id },
      { $pull: { klijenti: req.params.id } }
    );

    //svi zakazani termini se otkazuju
    const zakazaniTermini = await Termin.find({ klijent: req.params.id });
    for (let termin of zakazaniTermini) {
      termin.slobodan = true;
      termin.potvrdjen = false;
      termin.klijent = null;
      termin.terapija = null;
      await termin.save();
    }

    //sve recenzije klijenta se brisu
    await Recenzija.deleteMany({ klijent: req.params.id });

    //u testovima se brise iz liste dodeljenih klijenata
    await Test.updateMany(
      { klijenti: req.params.id },
      { $pull: { klijenti: req.params.id } }
    );

    //svi odgovori na testove se brisu
    await Odgovor.deleteMany({ klijent: req.params.id });

    //klijent se brise
    await Klijent.findByIdAndDelete(req.params.id);

    res.send("Uspesno brisanje klijenta!");
  } catch {
    (err) => {
      console.log(err);

      res.status(303).send("Greska pri brisanju!");
    };
  }
});

const MYME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const validan = MYME_TYPE_MAP[file.mimetype];
    let greska = new Error("Nevalidan mime type!");
    if (validan) {
      greska = null;
    }
    cb(greska, "backend/images");
  },
  filename: (req, file, cb) => {
    const imeSlike = file.originalname.toLowerCase().split(" ").join("-");
    const ekstenzija = MYME_TYPE_MAP[file.mimetype];
    cb(null, imeSlike + "-" + Date.now() + "." + ekstenzija);
  },
});

//registrovanje novog klijenta
router.post(
  "",
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    if (
      req.body.ime == null ||
      req.body.prezime == null ||
      req.body.email == null ||
      req.body.lozinka == null ||
      req.body.telefon == null
    ) {
      return res
        .status(409)
        .status("Niste uneli validne podatke, proverite ponovo.");
    }
    const hesiranaLozinka = await bcrypt.hash(req.body.lozinka, 12);
    const imeKlijenta =
      req.body.ime.charAt(0).toUpperCase() + req.body.ime.slice(1);
    const prezimeKlijenta =
      req.body.prezime.charAt(0).toUpperCase() + req.body.prezime.slice(1);
    let putanjaSlike =
      "http://localhost:3000/images/universal.jpg-1624898058820.jpg";
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      putanjaSlike = url + "/images/" + req.file.filename;
    }

    const klijent = new Klijent({
      ime: imeKlijenta,
      prezime: prezimeKlijenta,
      email: req.body.email,
      lozinka: hesiranaLozinka,
      telefon: req.body.telefon,
      slika: putanjaSlike,
      odobren: false,
    });
    const korisnik = new Korisnik({
      email: req.body.email,
      lozinka: hesiranaLozinka,
      odobren: false,
      tip: "klijent",
    });
    korisnik
      .save()
      .then(async (odg) => {
        res.send("Poslat na odobravanje");
        await klijent.save();
      })
      .catch((err) => {
        res.status(409).send("Postoji nalog sa ovim email-om");
      });
  }
);

//azuriranje podataka o konkretnom klijentu
router.put(
  "/:id",
  authCheck,
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    try {
      if (
        req.body.ime == null ||
        req.body.prezime == null ||
        req.body.email == null ||
        req.body.telefon == null
      ) {
        return res
          .status(409)
          .status("Niste uneli validne podatke, proverite ponovo.");
      }
      const klijent = await Klijent.findById(req.params.id);
      if (klijent) {
        if (req.body.lozinka != "") {
          const validnaLozinka = await bcrypt.compare(
            req.body.lozinka,
            klijent.lozinka
          );
          if (validnaLozinka) {
            const korisnik = await Korisnik.findOne({ email: klijent.email });
            const unetaNovaLozinka = await bcrypt.hash(
              req.body.novaLozinka,
              12
            );
            korisnik.lozinka = unetaNovaLozinka;
            klijent.lozinka = unetaNovaLozinka;
            if (req.body.email != klijent.email) {
              korisnik.email = req.body.email;
              klijent.email = req.body.email;
            }
            await korisnik.save();
          } else {
            return res
              .status(305)
              .send(
                "Uneta lozinka se ne poklapa sa trenutnom lozinkom, proverite unete podatke."
              );
          }
        }
        const imeKlijenta =
          req.body.ime.charAt(0).toUpperCase() + req.body.ime.slice(1);
        const prezimeKlijenta =
          req.body.prezime.charAt(0).toUpperCase() + req.body.prezime.slice(1);
        let putanjaSlike = req.body.imagePath;
        if (req.file) {
          const url = req.protocol + "://" + req.get("host");
          putanjaSlike = url + "/images/" + req.file.filename;
        }
        klijent.slika = putanjaSlike;
        klijent.ime = imeKlijenta;
        klijent.prezime = prezimeKlijenta;
        klijent.telefon = req.body.telefon;
        await klijent.save();
        return res.send("Podaci su uspešno ažurirani.");
      } else {
        return res
          .status(404)
          .send("Neuspešno ažuriranje podataka, prijavite se ponovo.");
      }
    } catch {
      res
        .status(305)
        .send("Neuspešno ažuriranje podataka, prijavite se ponovo.");
    }
  }
);

router.patch("/promenaBrojaSeansi", authCheck, async (req, res) => {
  try {
    const klijent = await Klijent.findById(req.body.idKlijenta);
    if (!klijent) {
      return res
        .status(305)
        .send("Ovaj klijent nije vise clan naseg savetovalista.");
    }
    for (let ter of klijent.terapije) {
      if (String(ter.idTerapije) == String(req.body.idTerapije)) {
        ter.ukupno = req.body.noviBrojPotrebnih;
        await klijent.save();
        return res.send("Uspesno ste promeni klijentu broj potrebih seansi.");
      }
    }
    res.status(305).send("Klijent je otkazao ovu terapiju.");
  } catch {
    res.status(305).send("Doslo je do greske, probajte ponovo.");
  }
});

module.exports = router;
