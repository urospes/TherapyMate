const express=require('express');
const router=express.Router();
const authCheck=require("../middleware/auth-check");

const Terapija=require('../models/terapija');
const TipTerapije=require('../models/tipTerapije');
const Terapeut=require('../models/terapeut');
const Klijent=require('../models/klijent');
const Termin=require('../models/termin');

//vraca sve terapije
router.get("",authCheck,async (req,res)=>{
  try{
    const terapije =await Terapija.find({});
    res.send(terapije);
  }catch{
    res.status(404).send("Doslo je do greske!");
  }

})

//dodavanje nove terapije od terapeuta ciji je id proslednjen
router.post("/:id",authCheck,async (req,res)=>{
  const terapeut1=await Terapeut.findById(req.params.id);
  if(!terapeut1){
    return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
  }
  const tipTerapije=await TipTerapije.findOne({naziv:req.body.tipTerapije});
  if(!tipTerapije){
    return res.status(404).send("Ovaj tip terapije ne postoji vise u savetovalistu, probajte ponovo.");
  }

  const terapija =new Terapija({
    detalji: req.body.detalji,
    cena: req.body.cena,
    tip: tipTerapije._id,
    terapeut: req.params.id
  });
  terapija.save().then(async(novaTerapija)=>{
    terapeut1.terapije.push(novaTerapija._id);
    tipTerapije.terapeuti.push(req.params.id);
    tipTerapije.terapije.push(novaTerapija._id);
    await terapeut1.save();
    await tipTerapije.save();
    res.send(novaTerapija._id);
  }).catch(err =>
    res.status(305).send("Postoji vec terapija sa tim detaljima"));

})

//brisanje terapije ciji je id proslednjen
router.delete("/:id",authCheck,async (req,res)=>{
  try{
    const t=await Terapija.findById(req.params.id);
    const terapeut1=await Terapeut.findById(t.terapeut);
    if(!terapeut1){
      return res.status(404).send("Doslo je do greske, prijavite se ponovo.");
    }
    const termin=await Termin.findOne({terapija:req.params.id});
    if(termin!=null){
      return res.status(305).send("Neuspesno brisanje terapije. Imate zakazane termine za ovu terapiju.");
    }
    let indeks=0;
    await Terapeut.findByIdAndUpdate(t.terapeut, { $pull: { 'terapije': req.params.id } });
    if(terapeut1.klijenti){
      terapeut1.klijenti.forEach(async(el)=>{
        const k=await Klijent.findById(el);

        const terapije=k.terapije;

        if(terapije){
          for(let tt of terapije){
            if(String(tt.idTerapije)==String(req.params.id)){
              console.log("true")
              indeks=tt._id;
              break;
            }
          }
        }
      if(indeks!=0){
        await Klijent.findByIdAndUpdate(el, { $pull: { terapije:{_id:indeks}} });
      }

    }
    )}

    //Terapije se brise iz liste u tipu terapija gde priprada
    await TipTerapije.findByIdAndUpdate(t.tip, { $pull: { 'terapije': req.params.id } });
    //Terapeut se brise iz liste u tipu terapija gde priprada
    await TipTerapije.findByIdAndUpdate(t.tip, { $pull: { 'terapeuti': t.terapeut } });


    await Terapija.findByIdAndDelete(req.params.id);
    res.send("Terapija je uspesno obrisana");
  }
  catch{
    res.status(305).send("Greska prilikom brisanja terapije. Probajte ponovo!");
  }

})

//azuriranje informacija o konkretnoj terapiji
router.patch("/:id",authCheck, async (req,res)=>{
  try{
    const terapija=await Terapija.findById(req.params.id);
    if(terapija){
      console.log(terapija);
      console.log(req.body.detalji);
      terapija.detalji=req.body.detalji;
      terapija.cena=req.body.cena;
      console.log(terapija);
      await terapija.save();
      res.send("Podaci o terapiji ažurirani uspešno");
    }else{
      res.status(404).send("Greska prilikom azuriranja terapije. Probajte da se prijavite ponovo.");
    }
  }catch{
    res.status(305).send("Postoji vec terapija sa tim detaljima"); //proveriti da li radi ovo?
  }
})

//vraca terapiju i psihoterapeuta
router.get("/:id",authCheck,async (req,res)=>{
  try{
    if(req.params.id.length==24){
      const terapija =await Terapija.findById(req.params.id).populate('terapeut');
      console.log(req.params);
      if(terapija){
        res.send(terapija);
        console.log(terapija);
      }
      else{
        res.status(404).send("Ne postoji terapija sa ovim id-em!!!");
      }
    }
    else{
      res.status(404).send("Ne postoji terapija sa ovim id-em!!!");
    }
  }
  catch{
    res.status(404).send("Doslo je do greske!");
  }

})

//id tipa terapije->vraca sve terapije koje su prosledjenog tipa i terapeuta za svaku terapiju
router.get("/:id/tipTerapije",authCheck,async (req,res)=>{
  try{
    if(req.params.id.length==24){
      const tip=await TipTerapije.findById(req.params.id);
      if(!tip){
         return res.status(404).send("Ne postoji tip terapije sa ovim id-em!!!");
      }
      const terapije =await Terapija.find({tip:req.params.id}).populate('terapeut');
      res.send(terapije);
    }
    else{
      res.status(404).send("Ne postoji tip terapije sa ovim id-em!!!");
    }
  } catch{
    res.status(404).send("Doslo je do greske!");
  }

})

module.exports=router;
