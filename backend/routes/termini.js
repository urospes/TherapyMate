const express=require('express');
const moment = require('moment')
const router=express.Router();
const authCheck=require("../middleware/auth-check");

const Termin=require('../models/termin');
const Terapeut=require('../models/terapeut');
const Klijent=require('../models/klijent');

//vraca terapeutu sve njegove termine
router.get("/terapeut/:idTerapeuta",authCheck,async (req,res)=>{
  try{
    if(req.params.idTerapeuta.length===24){
      const terapeut=await Terapeut.findById(req.params.idTerapeuta);
      if(!terapeut){
        return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
      }
      let today=moment().set('hour', 24).set('minute', 00).set('second', 00).set('millisecond', 000);
      const vreme=moment().add(3,'minutes').utcOffset('+0200').format('HH:mm');
      const trenutnoVreme=new Date (new Date().toDateString() + ' ' + vreme);

      const slobodniIstekli=await Termin.find({slobodan:true,datum:{$lte:today.toDate()}})
      for(let t of slobodniIstekli){
        const vremeTermina=new Date (new Date().toDateString() + ' ' + t.vreme);
        if(String(t.datum)!=String(today.toDate())){
          await t.delete();
        }else{
          if(vremeTermina<trenutnoVreme){

            await t.delete();
          }
        }
      }
      const termini =await Termin.find({terapeut:req.params.idTerapeuta})
      .populate('klijent','ime prezime email telefon')
      .populate({
        path: 'terapija',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        },
        select:'tip'
      })
      res.send(termini);
    }
    else{
      res.status(404).send("Nevalidan id!!!");
    }
  }
  catch{
    res.status(404).send("Doslo je do greske!");
  }

})

//vraca slobodne termine za terapeuta ciji je id prosledjen
router.get("/terapeut/slobodni/:id",authCheck,async (req,res)=>{
  try{
    if(req.params.id.length===24){
      const terapeut=await Terapeut.findById(req.params.id);
      if(!terapeut){
        return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
      }

      let today=moment().set('hour', 24).set('minute', 00).set('second', 00).set('millisecond', 000);
      const vreme=moment().add(3,'minutes').utcOffset('+0200').format('HH:mm');
      const trenutnoVreme=new Date (new Date().toDateString() + ' ' + vreme);
      const termini =await Termin.find({terapeut:req.params.id, slobodan:true,datum:{$lte:today.toDate()}})
      .populate('klijent','ime prezime email telefon')
      .populate({
        path: 'terapija',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        },
        select:'tip'
      });

      for(let t of termini){
        const vremeTermina=new Date (new Date().toDateString() + ' ' + t.vreme);
        if(String(t.datum)<String(today.toDate())){
          await t.delete();
        }else{
          if(vremeTermina<trenutnoVreme){
            await t.delete();
          }
        }
      }
      const sviSlobodni =await Termin.find({terapeut:req.params.id, slobodan:true})
      res.send(sviSlobodni);
   }
   else
   {
    res.status(404).send("Nevalidan id!!!");
   }
  }
  catch{
    res.status(404).send("Doslo je do greske!");
  }

})

//vraca zakazane termine za terapeuta ciji je id prosledjen
router.get("/terapeut/zakazani/:id",authCheck,async (req,res)=>{
  try{
    if(req.params.id.length===24){
      const terapeut=await Terapeut.findById(req.params.id);
      if(!terapeut){
        return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
      }
      let today=moment().set('hour', 24).set('minute', 00).set('second', 00).set('millisecond', 000);
      const vreme=moment().utcOffset('+0200').format('HH:mm');
      const trenutnoVreme=new Date (new Date().toDateString() + ' ' + vreme);

      const termini =await Termin.find({terapeut:req.params.id, slobodan:false,datum:{$gte:today.toDate()}})
      .populate('klijent','ime prezime email telefon')
      .populate({
        path: 'terapija',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        },
        select:'tip'
      });

      const zakazaniTermini=[];

      for(let t of termini){
        const vremeTermina=new Date (new Date().toDateString() + ' ' + t.vreme);
        if(String(t.datum)!=String(today.toDate())){
          zakazaniTermini.push(t);
        }else{
          if(vremeTermina>trenutnoVreme){
            zakazaniTermini.push(t);
          }
        }
      }
      res.send(zakazaniTermini);
    }
    else
    {
     res.status(404).send("Nevalidan id!");
    }
  }
  catch{
    res.status(404).send("Doslo je do greske!");
  }
})

//vraca istekle zakazane termine za terapeuta ciji je id prosledjen
router.get("/terapeut/istekliZakazani/:id",authCheck,async (req,res)=>{
  if(req.params.id.length===24){
    try{
      const terapeut=await Terapeut.findById(req.params.id);
      if(!terapeut){
        return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
      }
      let today=moment().set('hour', 24).set('minute', 00).set('second', 00).set('millisecond', 000);
      const vreme=moment().utcOffset('+0200').format('HH:mm');

      const istekliTermini=[];
      const termini=await Termin.find({terapeut:req.params.id, slobodan:false,potvrdjen:true,datum:{$lte:today}})
      .populate('klijent','ime prezime email telefon')
      .populate({
        path: 'terapija',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        },
        select:'tip'
      });
      const trenutnoVreme=new Date (new Date().toDateString() + ' ' + vreme);

      for(let t of termini){
        const vremeTermina=new Date (new Date().toDateString() + ' ' + t.vreme);
        if(String(t.datum)!=String(today.toDate())){
          istekliTermini.push(t);
        }else{
          if(vremeTermina<trenutnoVreme){
            istekliTermini.push(t);
          }
        }
      }
     res.send(istekliTermini);

    }catch
    {
      res.status(404).send("Greska!");
    }
  }
  else
  {
   res.status(404).send("Nevalidan id!!!");
  }
})

//vraca termine koji cekaju da se potvrde za terapeuta ciji je id prosledjen
router.get("/terapeut/nepotvrdjeni/:id",authCheck,async (req,res)=>{
  try{
    if(req.params.id.length===24){
      const terapeut=await Terapeut.findById(req.params.id);
        if(!terapeut){
          return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
        }
      const termini =await Termin.find({terapeut:req.params.id, slobodan:false, potvrdjen:false})
      .populate('klijent','ime prezime email telefon')
      .populate({
        path: 'terapija',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        },
        select:'tip'
      });
        res.send(termini);
    }
    else
    {
     res.status(404).send("Nevalidan id!!!");
    }
  }catch{
    res.status(404).send("Doslo je do greske!");
  }

})


//vraca klijentu sve termine koje je zakazao
router.get("/klijent/:idKlijenta",authCheck,async (req,res)=>{
  try{
    if(req.params.idKlijenta.length===24){
      const klijent=await Klijent.findById(req.params.idKlijenta).select('obavestenja');
      if(!klijent){
         return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
      }
      const termini =await Termin.find({klijent:req.params.idKlijenta}).select('potvrdjen vreme datum trajanje')
      .populate({
        path: 'terapija',
        populate:{
          path:'tip',
          model: 'TipTerapije',
          select: 'naziv'
        },
        select:'tip'
      })
      .populate('terapeut','ime prezime telefon')
      res.send({termini:termini,obavestenja:klijent.obavestenja});
    }
    else
    {
     res.status(404).send("Nevalidan id!!!");
    }
  }catch{
    res.status(404).send("Doslo je do greske!");
  }


})

//dodavanje novog slobodnog termina od strane terapeuta ciji je id prosledjen
router.post("/:id",authCheck,async (req,res)=>{
  try{

    let datumTermina=new Date( Date.parse(req.body.datum));
    let pocTermina=moment(req.body.datum.substring(0,10)+' '+req.body.vreme);
    let pocetakTermina=moment(req.body.datum.substring(0,10)+' '+req.body.vreme);
    let krajTermina;
    if(req.body.trajanje=='45min'){
      krajTermina=pocetakTermina.add(45,'minutes');
    }
    else if(req.body.trajanje=='60min'){
      krajTermina=pocetakTermina.add(60,'minutes');
    }
    else if(req.body.trajanje=='90min'){
      krajTermina=pocetakTermina.add(90,'minutes');
    }
    let minuti=krajTermina.minutes();
    let sati=krajTermina.hours();
    const vremePocetka=pocTermina.minutes()+60*pocTermina.hours();
    const vremeKraja=krajTermina.minutes()+60*krajTermina.hours();

    const terminiIstogDana=await Termin.find({terapeut:req.params.id,datum:datumTermina});
    let pocetakPoredjenogTermina;
    let krajPoredjenogTermina;
    for(let ter of terminiIstogDana){
      pocetakPoredjenogTermina=moment(ter.datum.toDateString().substring(0,10)+' '+ter.vreme);
      pocetakPoredjenogTermina1=moment(ter.datum.toDateString().substring(0,10)+' '+ter.vreme);
      if(ter.trajanje=='45min'){
        krajPoredjenogTermina=pocetakPoredjenogTermina1.add(45,'minutes');
      }
      else if(ter.trajanje=='60min'){
        krajPoredjenogTermina=pocetakPoredjenogTermina1.add(60,'minutes');
      }
      else if(ter.trajanje=='90min'){
        krajPoredjenogTermina=pocetakPoredjenogTermina1.add(90,'minutes');
      }
      const vremePocetkaPoredjenog=pocetakPoredjenogTermina.minutes()+60*pocetakPoredjenogTermina.hours();
      const vremeKrajaPoredjenog=krajPoredjenogTermina.minutes()+60*krajPoredjenogTermina.hours();
      if((vremePocetka>vremePocetkaPoredjenog && vremePocetka<vremeKrajaPoredjenog)||(vremeKraja>vremePocetkaPoredjenog && vremeKraja<vremeKrajaPoredjenog)){
        return res.status(305).send("Ovaj termin se poklapa sa već postojećim, promenite vreme termina.");
      }
      else if(vremePocetka<vremePocetkaPoredjenog && vremeKraja>vremeKrajaPoredjenog){
        return res.status(305).send("Ovaj termin se poklapa sa već postojećim, promenite vreme termina.");
      }
    }
    const termin =new Termin({
    slobodan: true,
    vreme: req.body.vreme,
    datum: req.body.datum,
    trajanje: req.body.trajanje,
    terapeut:req.params.id
  });
    await termin.save();
    res.send("Uspešno ste dodali novi termin.");
  }
  catch{
    res.send("Neuspešno dodavanje termina, probajte ponovo.");
  }
})

//brisanje slobodnog termina
router.delete("/:idTermina",authCheck,async (req,res)=>{
  try{
    const termin=await Termin.findById(req.params.idTermina);
    if(!termin){
      return res.status(305).send("Doslo je do greske, prijavite se ponovo.");
    }
    if(!termin.slobodan){
      return res.status(305).send("Termin je u medjuvremenu zakazan, da biste obrisali termin morate ga zakazati.");
    }
    await termin.delete();
    res.send("Uspesno obrisan termin.");
  }
  catch{
    res.status(305).send("Doslo je do greske prilikom brisanja termina, probajte ponovo.");

  }
})

//brisanje slobodnog termina
router.delete("/:idTermina/propusten",authCheck,async (req,res)=>{
  try{
    const termin=await Termin.findById(req.params.idTermina);
    if(!termin){
      return res.status(305).send("Doslo je do greske, prijavite se ponovo.");
    }

    await termin.delete();
    res.send("Uspesno obrisan termin.");
  }
  catch{
    res.status(305).send("Doslo je do greske prilikom brisanja termina, probajte ponovo.");

  }
})



//klijent zakazuje zeljeni termin za odredjenu terapiju
router.patch("/zakazivanje",authCheck,async (req,res)=>{
  try{
    const klijent=await Klijent.findById(req.body.idKlijenta);
    if(!klijent){
      return res.status(305).send("Doslo je do greske prilikom zakazivanja, prijavite se ponovo.");
    }
    const termin= await Termin.findById(req.body.idTermina);
    if(termin!=null){
      if(termin.slobodan){
        termin.slobodan=false;
        termin.potvrdjen=false;
        termin.klijent=req.body.idKlijenta;
        termin.terapija=req.body.idTerapije;
        await termin.save();
        res.send("Termin uspesno zakazan!");
      }
      else{
        res.status(305).send("Ovaj termin je u medjuvremenu zakazan, probajte ponovo sa drugim terminom.");
      }
    }
    else{
      res.status(305).send("Terapeut je obrisao ovaj termin, probajte ponovo sa drugim terminom.");
    }
  }catch{
    res.status(305).send("Doslo je do greske prilikom zakazivanja termina, probajte ponovo.");

  }
})

//terapeut potvrdjuje odredjeni termin
router.patch("/potvrdjivanje",authCheck,async (req,res)=>{
  try{
    const termin=await Termin.findByIdAndUpdate(req.body.idTermina,{potvrdjen:true});
    const terapeut=await Terapeut.findById(termin.terapeut);
    if(!terapeut){
      return res.status(305).send("Doslo je do greske prilikom potvrdjivanja, probajte da se prijavite ponovo.");
    }

    if(termin.slobodan){
      return res.status(305).send("Klijent je u medjuvremenu otkazao ovaj termin.")
    }
    const klijent=await Klijent.findById(termin.klijent);
    const datum=new Date(termin.datum);
    datum.setTime(datum.getTime()-24*60*60*1000);

    klijent.obavestenja.push(`Terapeut ${terapeut.ime} ${terapeut.prezime} je potvrdio termin za ${datum.getDate().toString()}.${(datum.getMonth()+1).toString()}.${datum.getFullYear().toString()} od ${termin.vreme}h.`);
    await klijent.save();
    res.send("Uspesno potvrdjen!");
  }catch{
    res.status(304).send("Greska pri potvrdjivanju!");
  }
})

//klijent ili terapeut otkazuje termin
router.patch("/otkazivanje",authCheck,async (req,res)=>{
  try{
    const termin= await Termin.findById(req.body.idTermina);
    if(termin){
      if(termin.slobodan){
        return res.status(305).send("Ovaj termin je u medjuvremenu otkazan.");
      }
      const terapeut=await Terapeut.findById(termin.terapeut);
      const klijent=await Klijent.findById(termin.klijent);
      const datum=new Date(termin.datum);
      datum.setTime(datum.getTime()-24*60*60*1000);

      if(req.body.otkazuje=="klijent" && termin.potvrdjen){
        terapeut.obavestenja.push(`Klijent ${klijent.ime} ${klijent.prezime} je otkazao termin za ${datum.getDate().toString()}.${(datum.getMonth()+1).toString()}.${datum.getFullYear().toString()} od ${termin.vreme}h.`);
        await terapeut.save();
      }
      else if(req.body.otkazuje=="terapeut"){
        klijent.obavestenja.push(`Terapeut ${terapeut.ime} ${terapeut.prezime} je otkazao termin za  ${datum.getDate().toString()}.${(datum.getMonth()+1).toString()}.${datum.getFullYear().toString()} od ${termin.vreme}h.`);
        await klijent.save();
      }
      termin.slobodan=true;
      termin.potvrdjen=false;
      termin.klijent=null;
      termin.terapija=null;
      await termin.save();
      res.send("Uspesno otkazan");
    }
    else{
      res.status(305).send("Greska pri otkazivanju!");
    }
  }catch{
    res.status(305).send("Greska pri otkazivanju!");
  }

})

//klijent menja termin
router.patch("/promena",authCheck,async (req,res)=>{
  try{
    const termin= await Termin.findById(req.body.idStarogTermina);
    if(!termin){
      return res.status(305).send("Vaš termin je u međuvremenu otkazan, zakažite novi termin.")
    }
    if(termin.slobodan){
      return res.status(305).send("Vaš termin je u međuvremenu otkazan, zakažite novi termin.");
    }
    const noviTermin=await Termin.findById(req.body.idNovogTermina);
    if(termin!=null && noviTermin!=null && noviTermin.slobodan){
      noviTermin.slobodan=false;
      noviTermin.potvrdjen=false;
      noviTermin.klijent=termin.klijent;
      noviTermin.terapija=termin.terapija;
      termin.slobodan=true;
      termin.potvrdjen=false;
      termin.klijent=null;
      termin.terapija=null;
      await noviTermin.save();
      await termin.save();
      res.send("Uspesno promenjen termin!");
    }else{
      res.status(305).send("Ovaj termin nije više slobodan, izaberite neki drugi termin za promenu.");
    }

  }catch{
    res.status(305).send("Greška pri promeni termina, pokušajte ponovo.");
  }

})


router.patch("/klijent/brisanjeObavestenja",authCheck,async (req,res)=>{
  try{
    await Klijent.findByIdAndUpdate(req.body.idKlijenta,{ $pull: { 'obavestenja': req.body.obavestenje }});
    res.send("obrisani")
  }catch{
    res.status(304).send("Greska pri brisanju obavestenja!");
  }

})

router.patch("/terapeut/brisanjeObavestenja",authCheck,async (req,res)=>{
  try{
    await Terapeut.findByIdAndUpdate(req.body.idTerapeuta,{ $pull: { 'obavestenja': req.body.obavestenje }});
    res.send("obrisani")
  }catch{
    res.status(304).send("Greska pri brisanju obavestenja!");
  }

})

router.patch("/zavrsavanjeTermina/:idTermina",authCheck,async (req,res)=>{
  try{
    const t=await Termin.findOne({_id:req.params.idTermina}).select('terapija klijent');
    const k=await Klijent.findOne({_id:t.klijent});
    if(!k){
      return res.status(305).send("Ovaj klijent nije vise clan naseg savetovalista.");
    }
    for(let ter of k.terapije){
      if(String(ter.idTerapije)==String(t.terapija)){
        ter.odradjeno++;
        break;
      }
    }
    await k.save();
    await Termin.findByIdAndDelete(req.params.idTermina);
    res.send("Uspesno zavrsen termin.");
  }catch{
    res.status(305).send("Greska pri zavrsavanju termina!");
  }

})


module.exports=router;
