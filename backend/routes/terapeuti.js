const express=require('express');
const bcrypt = require('bcrypt');
const router=express.Router();
const multer=require("multer");
const authCheck=require("../middleware/auth-check");

const Terapeut=require('../models/terapeut');
const Korisnik=require('../models/korisnik');
const Klijent=require('../models/klijent');
const TipTerapije=require('../models/tipTerapije');
const Recenzija=require('../models/recenzija');
const Terapija=require('../models/terapija');
const Termin = require('../models/termin');
const Test = require('../models/test');
const Pitanje = require('../models/pitanje');
const Odgovor=require('../models/odgovor');

//vraca sve terapeute
router.get("",authCheck,async (req,res)=>{
  try{
    const terapeuti =await Terapeut.find({});
    return res.send(terapeuti);
  }catch{
    return res.status(404).send("Doslo je do greske!");
  }
})

//vraca osnovne informacije o terapeutima
router.get("/osnovneInfo",async (req,res)=>{
  try{
    const terapeuti =await Terapeut.find({});
    const terapeutiInfo=[];
    for(el of terapeuti){
      const recenzije=await Recenzija.find({terapeut:el._id});
      let ocena=0;
      for(r of recenzije){
        ocena+=r.ocena;
      }
      const terapije=await TipTerapije.find({terapeuti:el._id},'naziv');
      let prosecnaOcena=0;
      if(recenzije.length!==0){
        prosecnaOcena=ocena/parseFloat(recenzije.length);
      }
      terapeutiInfo.push({id:el._id,
      ime:el.ime,
      prezime:el.prezime,
      ocena:prosecnaOcena,
      brKlijenata:el.klijenti.length,
      brTerapija:terapije.length,
      tipoviTerapija: terapije,
      slika:el.slika});
    }
    res.send(terapeutiInfo);
    }catch{
      res.status(404).send("Doslo je do greske!");
    }

})

//vraca terapeuta
router.get("/:id",authCheck,async (req,res)=>{
  try{
    if(req.params.id.length==24){
      const terapeut =await Terapeut.findById(req.params.id);
      if(terapeut){
        console.log(terapeut);
        res.send(terapeut);
      }
      else{
        res.status(404).send("Ne postoji trazeni terapeut.");
      }
    }
    else
        res.status(404).send("Ne postoji trazeni terapeut.");
  }catch{
    res.status(404).send("Doslo je do greske!");
  }

})

//vraca obavestenja terapeutu
router.get("/:id/obavestenja",authCheck, async (req, res) => {
  try{
    const terapeut = await Terapeut.findById(req.params.id).select('obavestenja');
    if(terapeut){
      return res.send(terapeut.obavestenja);
    }
    return res.status(404).send("Ne postoji trazeni terapeut.");

  }catch{
    return res.status(404).send("Ne postoji trazeni terapeut.");
  }

});

const MYME_TYPE_MAP={
  'image/png':'png',
  'image/jpg':'jpg',
  'image/jpeg':'jpg'
};

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const validan=MYME_TYPE_MAP[file.mimetype];
    let greska=new Error("Nevalidan mime type!");
    if(validan){
      greska=null;
    }
    cb(greska,"backend/images");
  },
  filename:(req,file,cb)=>{
    console.log(file)
    const imeSlike=file.originalname.toLowerCase().split(' ').join('-');
    const ekstenzija=MYME_TYPE_MAP[file.mimetype];
    cb(null,imeSlike+'-'+Date.now()+'.'+ekstenzija);

  }
});

//registrovanje novog terapeuta
router.post("",multer({storage:storage}).single("image"),async (req,res)=>{
  if(req.body.ime==null||req.body.prezime==null||req.body.email==null||req.body.lozinka==null||req.body.telefon==null||req.body.specijalizacija==null||req.body.opis==null){
    return res.status(409).status("Niste uneli validne podatke, proverite ponovo.")
  }
  const hesiranaLozinka= await bcrypt.hash(req.body.lozinka,12);
  const imeTerapeuta=req.body.ime.charAt(0).toUpperCase()+ req.body.ime.slice(1);
  const prezimeTerapeuta=req.body.prezime.charAt(0).toUpperCase()+ req.body.prezime.slice(1);

  let putanjaSlike="http://localhost:3000/images/universal.jpg-1624898058820.jpg";
  if(req.file){
    const url=req.protocol+'://'+req.get("host");
    putanjaSlike=url+'/images/'+req.file.filename;
  }

  const terapeut =new Terapeut({
    ime: imeTerapeuta,
    prezime: prezimeTerapeuta,
    email: req.body.email,
    lozinka: hesiranaLozinka,
    telefon: req.body.telefon,
    specijalizacija: req.body.specijalizacija,
    opis: req.body.opis,
    slika: putanjaSlike,
    odobren: false
  });

  const korisnik=new Korisnik({
    email: req.body.email,
    lozinka: hesiranaLozinka,
    odobren: false,
    tip: "terapeut"
  });

  try{
    await korisnik.save();
    await terapeut.save();

    res.send("Poslat na odobravanje");
  }
  catch{
    return res.status(409).send("Postoji nalog sa ovim email-om");
  }
})

//azuriranje podataka o konkretnom terapeutu
router.put("/:id",authCheck,multer({storage:storage}).single("image"), async (req,res)=>{
  try{
    if(req.body.ime==null||req.body.prezime==null||req.body.email==null||req.body.telefon==null||req.body.specijalizacija==null||req.body.opis==null){
      return res.status(409).status("Niste uneli validne podatke, proverite ponovo.")
    }
    const terapeut = await Terapeut.findById(req.params.id);
    if(!terapeut){
      return res.status(404).send("Neuspešno ažuriranje podataka, prijavite se ponovo.");
    }
    if(req.body.lozinka!=""){
      const validnaLozinka= await bcrypt.compare(req.body.lozinka,terapeut.lozinka);
      if(validnaLozinka){
        const korisnik=await Korisnik.findOne({email:terapeut.email});
        const unetaNovaLozinka= await bcrypt.hash(req.body.novaLozinka,12);
        korisnik.lozinka=unetaNovaLozinka;
        terapeut.lozinka=unetaNovaLozinka;
        if(req.body.email!=terapeut.email){
          korisnik.email=req.body.email;
          terapeut.email=req.body.email;
        }
        await korisnik.save();
      }
      else{
        return res.status(305).send("Uneta lozinka se ne poklapa sa trenutnom lozinkom, proverite unete podatke.")
      }
    }
    const imeTerapeuta=req.body.ime.charAt(0).toUpperCase()+ req.body.ime.slice(1);
    const prezimeTerapeuta=req.body.prezime.charAt(0).toUpperCase()+ req.body.prezime.slice(1);
    terapeut.ime=imeTerapeuta;
    terapeut.prezime=prezimeTerapeuta;
    terapeut.telefon=req.body.telefon;
    terapeut.specijalizacija=req.body.specijalizacija;
    terapeut.opis=req.body.opis;
    let putanjaSlike=req.body.imagePath;
    if(req.file){
      const url=req.protocol+'://'+req.get("host");
      putanjaSlike=url+'/images/'+req.file.filename;
    }
    terapeut.slika=putanjaSlike;
    await terapeut.save();
    return res.send("Podaci su uspešno ažurirani.")

  }catch{
    res.status(305).send("Greska!!!");
  }
})

//brisanje naloga konkretnog terapeuta
router.delete("/:id",authCheck,async (req,res)=>{
  try{

    const terapeut = await Terapeut.findById(req.params.id);

    //brise se nalog terapeuta iz kolekcije korisnik
    await Korisnik.findOneAndDelete({ email: terapeut.email });

    //sve recenzije terapeuta se brisu
    await Recenzija.deleteMany({ terapeut: req.params.id });

    //brisu se svi termini terapeuta
    await Termin.deleteMany({terapeut: req.params.id});

    const testovi=await Test.find({terapeut:req.params.id});
    for(let t of testovi){
      await Odgovor.deleteMany({test:t._id});
      await Klijent.updateMany({},{ $pull: { 'testovi': t._id }});
      for(let pitanje of t.pitanja){
        await Pitanje.findByIdAndDelete(pitanje);
      }
      await Test.findByIdAndDelete(t);
    }

    let indeks=0;
    if(terapeut.klijenti){
      console.log("ID KLIJENTA TERAPEUTA KOJI SE BRISE",terapeut.klijenti)
      for(let el of terapeut.klijenti){
      /*terapeut.klijenti.forEach(async(el)=>{*/
        const k=await Klijent.findById(el);
        console.log("KLIJENTTT!!!!!!!",k.ime,k.prezime)
        const terapije=k.terapije;
        if(terapije){
          console.log("TERAPIJE KLIJENTA",terapije)
          for(let tt of terapije){
            const terapijaaa=await Terapija.findById(tt.idTerapije);
            console.log("ID TERAPIJE",tt.idTerapije);
            if(String(terapijaaa.terapeut)==String(req.params.id)){
              console.log("ID DOBRE TERAPIJE",tt.idTerapije)
              indeks=tt._id;
              await Klijent.findByIdAndUpdate(el, { $pull: { terapije:{_id:indeks}} });
            }
          }
        }
      }/*)*/
    }

    for(let terapija of terapeut.terapije){
      const ter=await Terapija.findById(terapija);

      //Terapije se brise iz liste u tipu terapija gde priprada
      await TipTerapije.findByIdAndUpdate(ter.tip, { $pull: { 'terapije': ter._id} });
      //Terapeut se brise iz liste u tipu terapija gde priprada
      await TipTerapije.findByIdAndUpdate(ter.tip, { $pull: { 'terapeuti': req.params.id } });

      await Terapija.findByIdAndDelete(ter._id);
    }
    await Terapeut.findByIdAndDelete(req.params.id);
    res.send("Terapeut je uspesno obrisan!");

  }catch{
    res.status(303).send("Greska pri brisanju!");
  }
})

//vraca konkretnog terapeuta i listu njegovih terapija sa opisom i tip terapije
router.get("/:id/terapije",async (req,res)=>{
  try{
    if(req.params.id.length===24){
      const terapeut =await Terapeut.findById(req.params.id)
      .populate({
        path: 'terapije',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        }
      });

      if(terapeut){
         res.send(terapeut);
         console.log(terapeut);
      }
      else{
        res.status(404).send("Ne postoji terapeut sa ovim id-em!!!");
      }
    }
    else{
      res.status(404).send("Ne postoji terapeut sa ovim id-em!!!");
    }

  }catch{
    res.status(404).send("Greska!!!");
  }


})

//vraca konkretnom terapeutu listu njegovih klijenata-osnovne informacije
router.get("/:id/klijenti",authCheck,async (req,res)=>{
  try{
    const klijenti=[];
  if(req.params.id.length==24){
    const terapeut=await Terapeut.findById(req.params.id);
    if(terapeut){
      console.log(terapeut.klijenti)
      for(k of terapeut.klijenti){
        const klijent=await Klijent.findById(k);
        klijenti.push({
          _id:k,
          ime:klijent.ime,
          prezime:klijent.prezime,
          email:klijent.email,
          telefon:klijent.telefon,
          slika:klijent.slika
        });
      }
      res.send(klijenti);
    }
    else{
      res.status(404).send("Ne postoji terapeut sa ovim id-em!!!");
    }
  }
  else
      res.status(404).send("Ne postoji terapeut sa ovim id-em!!!");
  }catch{
    res.status(404).send("Doslo je do greske!");
  }

})

//vraca konkretnom terapeutu koje terapije je izabrao klijent
router.get("/:idTerapeuta/klijent/:idKlijenta",authCheck,async (req,res)=>{
  try{
    const terapije=await Terapeut.findById(req.params.idTerapeuta).select('terapije');
    if(!terapije){
      return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
    }
    const klijent=await Klijent.findById(req.params.idKlijenta).select('terapije');
    if(!klijent){
      return res.status(404).send("Doslo je do greske, Vasa saradnja sa klijentom je otkazana ili je mu je nalog uklonjen.");
    }
    const naziviTerapija=[];
    const terapijeKlijenta=klijent.terapije;
    for(let t of terapije.terapije){
      for(let terapija of terapijeKlijenta){
        if(String(t)==String(terapija.idTerapije)){
          const ter=await TipTerapije.findOne({terapije:t}).select('naziv');
          naziviTerapija.push({
            _id : terapija.idTerapije,
            naziv:ter.naziv,
            ukupno:terapija.ukupno,
            odradjeno:terapija.odradjeno
          })
        }
      }
    }
    res.send(naziviTerapija);
  }catch{
    res.status(404).send("Greska!!!");
  }
})

router.get("/:idTerapeuta/terapije/:idKlijenta",async (req,res)=>{
  try{
    let listaTerapija=[]
    const terapeut=await Terapeut.findById(req.params.idTerapeuta);
    if(!terapeut){
      return res.status(404).send("Ovaj terapeut nije vise clan naseg savetovalista.");
    }

    if(req.params.idKlijenta==="neulogovan"){
      listaTerapija=await Terapija.find({terapeut:req.params.idTerapeuta}).select('detalji cena').populate('tip','naziv');
    }
    else{
      const klijent=await Klijent.findById(req.params.idKlijenta).select('terapije');
      if(!klijent){
        return res.status(305).send("Doslo je do greske, prijavite se ponovo.");
      }
      const idTerapija=[];
      for(let ter of klijent.terapije){
        idTerapija.push(ter.idTerapije);
      }
      const listaKlijentovihTerapija=await Terapija.find({terapeut:req.params.idTerapeuta,_id:{$in:idTerapija}}).select('detalji cena').populate('tip','naziv');
      for(let el of listaKlijentovihTerapija){
        for(e of klijent.terapije){
          if(String(e.idTerapije)==String(el._id)){
            listaTerapija.push({
              _id:e.idTerapije,
              ukupno:e.ukupno,
              odradjeno:e.odradjeno,
              tip:el.tip,
              detalji:el.detalji,
              cena:el.cena
            })
          }
        }
      }
     const listaNeKlijentovihTerapija=await Terapija.find({terapeut:req.params.idTerapeuta,_id:{$nin:idTerapija}}).select('detalji cena').populate('tip','naziv');
     for(let l of listaNeKlijentovihTerapija){
      listaTerapija.push(l)
     }
    }
    res.send(listaTerapija);
  }catch{
    res.status(404).send("Doslo je do greske, probajte ponovo.");
  }
})

module.exports=router;
