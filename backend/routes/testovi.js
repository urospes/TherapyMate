const express=require('express');
const router=express.Router();
const authCheck=require("../middleware/auth-check");

const Test=require('../models/test');
const Pitanje=require('../models/pitanje');
const Odgovor=require('../models/odgovor');
const Klijent=require('../models/klijent');
const Terapeut=require('../models/terapeut');


//vraca terapeutu sve njegove testove
router.get("/terapeut/:idTerapeuta",authCheck,async (req,res)=>{
  try{
    if(req.params.idTerapeuta.length===24){
      const terapeut=await Terapeut.findById(req.params.idTerapeuta);
      if(!terapeut){
        return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
      }
      const testovi =await Test.find({terapeut:req.params.idTerapeuta,arhiviran:false}).populate('pitanja');
      res.send(testovi);
    }
    else{
      return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
    }
  }catch{
    return res.status(404).status("Došlo je do greške, probajte ponovo.")
  }

})

//dodavanje novog testa od strane terapeuta ciji je id prosledjen
router.post("",authCheck,async (req,res)=>{
  try{
    const terapeut=await Terapeut.findById(req.body.idTerapeuta);
      if(!terapeut){
        return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
      }
      console.log(terapeut)
    const test =new Test({
      arhiviran:false,
      terapeut: req.body.idTerapeuta
    });
    const kreiranTest=await test.save();
    res.send(kreiranTest._id);
  }
  catch{
    res.status(304).send("Neuspešno kreiranje testa, probajte ponovo.");
  }
})

//dodavanje pitanja testu
router.post("/:idTesta",authCheck,async (req,res)=>{
  try{
    const test=await Test.findById(req.params.idTesta);
    const pitanja=req.body.pitanja;
    console.log(test, pitanja);

    for(let p of pitanja){
      const pitanje = new Pitanje({
        tekstPitanja:p.tekstPitanja,
        ponudjeniOdgovori:p.ponudjeniOdgovori
      });
    const novoPitanje=await pitanje.save();
    test.pitanja.push(novoPitanje);
    }
    await test.save();
    res.send("Uspešno dodavanje pitanja");
  }catch{
    res.status(304).send("Greška pri dodavanju pitanja, probajte ponovo.");
  }
})

//dodeljivanje testa klijentu
router.patch("/dodeljivanjeKlijentu",authCheck,async (req,res)=>{
  try{
    const test=await Test.findById(req.body.idTesta);
    const terapeut=await Terapeut.findById(test.terapeut);
    if(!terapeut){
      return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
    }
    const klijent =await Klijent.findById(req.body.idKlijenta);
    if(!klijent){
      return res.status(404).send("Nije moguće dodeljivanje testa, ovaj klijent nije više član našeg savetovališta.");
    }
    let otkazaoPretlatu="da";
    for(let k of terapeut.klijenti){
      if(String(k)==String(req.body.idKlijenta)){
        otkazaoPretlatu="ne";
        break;
      }
    }
    if(otkazaoPretlatu=="da"){
      return res.status(404).send("Nije moguće dodeljivanje testa, ovaj klijent je otkazao saradnju sa Vama.");
    }
    test.klijenti.push(klijent);
    klijent.testovi.push(test);
    await test.save();
    await klijent.save();
    res.send("Test je uspešno dodeljen klijentu.");
  }catch{
    res.status(304).send("Greška pri dodeljivanju testa, probajte ponovo.");
  }
})

//klijent radi test
router.patch("/radjenjeTesta/:idTesta/:idKlijenta",authCheck,async(req,res)=>{
    try{
      const odgovori=req.body.odgovori;
      for(let o of odgovori){
        const odg=new Odgovor({
          sadrzajOdgovora:o.sadrzajOdgovora,
          test:req.params.idTesta,
          klijent:req.params.idKlijenta,
          pitanje:o.idPitanja
        });
        console.log(odg);
        await odg.save();
      }
      await Klijent.findByIdAndUpdate(req.params.idKlijenta, {$pull: { 'testovi': req.params.idTesta }})
      res.send("Test je odrađen uspešno.");
    }catch{
      res.status(304).send("Greška pri rađenju testa, probajte ponovo.");
    }
  })

//ahiviranje/brisanje testova
router.patch("/arhiviranjeTesta/:idTesta",authCheck,async(req,res)=>{
  try{
    const test=await Test.findById(req.params.idTesta);
    const terapeut=await Terapeut.findById(test.terapeut);
    if(!terapeut){
      return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
    }
    if(test.klijenti.length===0){
      await test.delete();
    }else{
      test.arhiviran=true;
      await test.save();
    }
    return res.send("Test je uspešno obrisan.");
  }catch{
    res.status(304).send("Greška pri rađenju testa, probajte ponovo.");
  }
})


//testovi i odgovori od klijenta kod terapeuta
router.get("/klijent/:idKlijenta/:idTerapeuta",authCheck,async(req,res)=>{
  try{
    const terapeut=await Terapeut.findById(req.params.idTerapeuta);
    if(!terapeut){
      return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
    }
    const klijent =await Klijent.findById(req.params.idKlijenta);
    if(!klijent){
      return res.status(404).send("Pregled urađenih testova nije moguć, ovaj klijent nije više član našeg savetovališta.");
    }
    let otkazaoPretlatu="da";
    for(let k of terapeut.klijenti){
      if(String(k)==String(req.params.idKlijenta)){
        otkazaoPretlatu="ne";
        break;
      }
    }
    if(otkazaoPretlatu=="da"){
      return res.status(404).send("Pregled urađenih testova nije moguć, ovaj klijent je otkazao saradnju sa Vama.");
    }
    const testoviId=await Test.find({klijenti:req.params.idKlijenta,terapeut:req.params.idTerapeuta}).select('_id');
    const testoviOdgovori=[];
    for(let t of testoviId){
      const odgovori=await Odgovor.find({test:t,klijent:req.params.idKlijenta}).select('sadrzajOdgovora').populate('pitanje');
      if(odgovori.length>0)
         testoviOdgovori.push(odgovori);
    }
    res.send(testoviOdgovori);
  }catch{
    res.status(404).send("Greška pri učitavanju urađenih testova klijenta, probajte ponovo.");
  }
})

//testovi koje klijent treba da uradi
router.get("/neuradjeni/:idKlijenta",authCheck,async(req,res)=>{
  try{
    const klijent=await Klijent.findById(req.params.idKlijenta);
    if(!klijent){
      return res.status(404).send("Dodavanje novog testa nije moguće, ovaj klijent nije više član našeg savetovališta.");
    }
    const idTestova=klijent.testovi;
    const testovi=[];
    for(let id of idTestova){
      const test=await Test.findById(id).populate('pitanja').populate('terapeut','ime prezime email').select('pitanja terapeut');
      testovi.push(test);
    }
    res.send(testovi);
  }catch{
    res.status(404).send("Doslo je do greške kod učitavanja testova, probajte ponovo.");
  }
})

//testovi koje terapeut moze da dodeli klijentu(nisu vec dodeljeni)
router.get("/:idTerapeuta/nedodeljeni/:idKlijenta",authCheck,async(req,res)=>{
  try{
    const terapeut=await Terapeut.findById(req.params.idTerapeuta);
    if(!terapeut){
      return res.status(404).send("Došlo je do greške, probajte da se prijavite ponovo.");
    }
    const klijent=await Klijent.findById(req.params.idKlijenta);
    if(!klijent){
      return res.status(404).send("Dodeljivanje testova nije moguće, ovaj klijent nije više član našeg savetovališta.");
    }
    let otkazaoPretlatu="da";
    for(let k of terapeut.klijenti){
      if(String(k)==String(req.params.idKlijenta)){
        otkazaoPretlatu="ne";
        break;
      }
    }
    if(otkazaoPretlatu=="da"){
      return res.status(404).send("Dodeljivanje testova nije moguće, ovaj klijent je otkazao saradnju sa Vama.");
    }
    const testovi=await Test.find({terapeut:req.params.idTerapeuta,arhiviran:false,klijenti:{$nin:req.params.idKlijenta}}).populate('pitanja');;

    res.send(testovi);
  }catch{
    res.status(404).send("Doslo je do greške kod učitavanja testova, probajte ponovo.");
  }
})



module.exports=router;
