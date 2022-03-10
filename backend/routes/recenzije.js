const express = require("express");
const router = express.Router();
const authCheck=require("../middleware/auth-check");

const Recenzija = require("../models/recenzija");
const Klijent = require("../models/klijent");
const Terapeut = require("../models/terapeut");

//vraca sve recenzije za terapeuta ciji je id prosledjen
router.get("/:id", async (req, res) => {
  try{
    if (req.params.id.length == 24) {
      const recenzije = await Recenzija.find({ terapeut: req.params.id }).populate('klijent','email');
      res.send(recenzije);
    } else {
      res.status(404).send("Ne postoji terapeut sa ovim id-em!!");
    }
  }catch{
    res.status(404).send("Ne postoji terapeut sa ovim id-em!!");
  }

});

router.delete("/:id",authCheck,async(req,res)=>{
  try{
    await Recenzija.findByIdAndDelete(req.params.id);
    res.send("Uspešno obrisana recenzija");
  }catch{
    res.status(305).send("Doslo je do greske prilikom brisanja recenzije.");
  }
})

//dodavanje nove recenzije terapeutu ciji je id prosledjen
router.post("",authCheck, async (req, res) => {
  try {
    const klijent=await Klijent.findById(req.body.idKlijenta).select('terapije');
    if(!klijent){
      return res.status(404).send("Doslo je do greske, pokusajte da se prijavite ponovo.");
    }
    const terapeut=await Terapeut.findById(req.body.idTerapeuta);
    if(!terapeut){
      return res.status(404).send("Ocenjivanje nije moguce. Ovaj terapeut vise ne saradjuje sa nasim savetovaliste, Vasa saradnja je automatski otkazana.");
    }
    const vecOcenjen = await Recenzija.findOne({
      terapeut: req.body.idTerapeuta,
      klijent: req.body.idKlijenta,
    });
    console.log(vecOcenjen)
    if (vecOcenjen != null) {
      return res.status(305).send("Vec ste ocenili ovog terapeuta.");
    }

    let mozeDaOceni="ne";
    for(let ter of klijent.terapije){
      if(ter.odradjeno>0){
        const terapeut=await Terapeut.findOne({_id:req.body.idTerapeuta,terapije:ter.idTerapije});
        console.log(terapeut);
        if(terapeut!=null)
        {
          mozeDaOceni="da";
          break;
        }
      }
    }
    if(mozeDaOceni==="da"){

      const recenzija = new Recenzija({
      ocena: req.body.ocena,
      komentar: req.body.komentar,
      terapeut: req.body.idTerapeuta,
      klijent: req.body.idKlijenta,
      });
      console.log(recenzija);
      await recenzija.save();
      return res.status(200).send("Uspesno ste ocenili terapeuta.");
    }else{
      console.log("vso");
      return res.status(305).send("Ne mozete da ocenite ovog terapeuta jer niste imali nijednu seansu.");
    }

  } catch {
    return res.status(500).send("Greska");
  }
});

module.exports = router;
