const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const router = express.Router();
const authCheck=require("../middleware/auth-check");

const Korisnik = require("../models/korisnik");
const Terapeut = require("../models/terapeut");
const Klijent = require("../models/klijent");
const Administrator=require("../models/administrator");

//prijavljivanje na aplikaciju
router.post("/prijavljivanje", async (req, res) => {
  try{
    const potencijalnoUlogovan = await Korisnik.findOne({
      email: req.body.email,
    });
    let id;
    if (potencijalnoUlogovan) {
      const tacnaLozinka = await bcrypt.compare(
        req.body.lozinka,
        potencijalnoUlogovan.lozinka
      ); //poredi unetu lozinku i kriptovanu i vraca true ako je lozinka ispravna
      if (tacnaLozinka) {
        console.log("tacna lozinka",req.body.lozinka,potencijalnoUlogovan.lozinka);

        if (!potencijalnoUlogovan.odobren) {

          return res.status(401).send("Nalog nije odobren");
        } else {
          if (potencijalnoUlogovan.tip === "klijent") {
            const k = await Klijent.findOne({ email: req.body.email });
            id = k._id;
          } else if (potencijalnoUlogovan.tip === "terapeut") {
            const t = await Terapeut.findOne({ email: req.body.email });
            id = t._id;
          }
            else {
              const t = await Administrator.findOne({ email: req.body.email });
            id = t._id;
            }

          const token = jwt.sign(
            {
              email: req.body.email,
              korisnikId: id,
              tipKorisnika: potencijalnoUlogovan.tip,
            },
            "token",
            { expiresIn: "1h" }
          );
          console.log({
            token: token,
            korisnikId: id,
            tipKorisnika: potencijalnoUlogovan.tip,
          });

          res.send({
            token: token,
            korisnikId: id,
            tipKorisnika: potencijalnoUlogovan.tip,
            trajanjeTokena: 60,
          });
        }
      }
      else {
        res.status(401).send("Greska pri logovanju");
      }
    } else {
      res.status(401).send("Greska pri logovanju");
    }

  }catch{
    res.status(401).send("Greska pri logovanju");
  }

});



//odobravanje korisnickog naloga na osnovu id-a
router.patch("/odobravanjeNaloga",authCheck, async (req, res) => {
  try {
    let email;
    const klijent=await Klijent.findById(req.body.id);
    if(klijent!=null){
      klijent.odobren=true;
      email=klijent.email;
      await klijent.save();
    }else{
      const terapeut=await Terapeut.findById(req.body.id);
      terapeut.odobren=true;
      email=terapeut.email;
      await terapeut.save();
    }
    await Korisnik.findOneAndUpdate({email:email},{odobren:true});

    const posiljac = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therapy.mate.superb@gmail.com',
        pass: 'SuPerB2021!'
      }
    });

    const opcije = {
      from: 'therapy.mate.superb@gmail.com',
      to: email,
      subject: 'Dobrodošli na TherapyMate :)',
      html: '<h1>Vaš nalog je uspešno odobren</h1><p>Nadamo se da ćete biti zadovoljni uslugama naše aplikacije.</p>'
    };

    posiljac.sendMail(opcije, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Mejl je uspesno poslat: ' + info.response);
      }
    });
    res.send("Nalog uspesno odobren!");

  } catch {
    res.status(305).send("Greska prilikom odobravanja naloga.");
  }
});

//vraca sve naloge, prvo neodobre pa odobrene klijente, pa terapeute
router.get("",authCheck,async(req,res)=>{
  try{
  const sviNalozi=[];
  const neodobreni=await Korisnik.find({odobren:false});
  console.log(neodobreni)
  for(let neodob of neodobreni){
    if(neodob.tip==="klijent"){
      const klijent=await Klijent.findOne({email:neodob.email});
      sviNalozi.push(klijent);
    }else if(neodob.tip==="terapeut"){
      const terapeut=await Terapeut.findOne({email:neodob.email});
      sviNalozi.push(terapeut);
    }
  }
  const klijenti=await Klijent.find({odobren:true});
  for(let k of klijenti){
    sviNalozi.push(k);
  }
  const terapeuti=await Terapeut.find({odobren:true});
  for(let t of terapeuti){
    sviNalozi.push(t);
  }
  res.send(sviNalozi)
  }
  catch{
    res.status(404).send("Greska;")
  }
})

//registrovanje novog administratora-ne koristimo u app
router.post("",async (req,res)=>{
  const hesiranaLozinka= await bcrypt.hash(req.body.lozinka,12);
  const admin =new Administrator({
    ime: req.body.ime,
    prezime: req.body.prezime,
    email: req.body.email,
    lozinka: hesiranaLozinka,
    telefon: req.body.telefon,
    odobren: true
  });
  const korisnik=new Korisnik({
    email: req.body.email,
    lozinka: hesiranaLozinka,
    odobren: true,
    tip: "administrator"
  });
  korisnik.save().then(async(odg)=>{
    await admin.save();
  })
  .catch(err=>{
    res.status(409).send("Postoji nalog sa ovim email-om");
  })
})

module.exports = router;
