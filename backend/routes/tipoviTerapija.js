const express=require('express');
const router=express.Router();
const authCheck=require("../middleware/auth-check");

const TipTerapije=require('../models/tipTerapije');
const Terapija=require('../models/terapija');
const Klijent=require('../models/klijent');


//vraca sve tipove terapija
router.get("",async (req,res)=>{
  try{
    const tipoviTerapija =await TipTerapije.find({}).select('naziv opis terapije');
    console.log(tipoviTerapija);
    res.send(tipoviTerapija);
  }catch{
    res.status(404).send("Doslo je do greske")
  }

})

//vraca tip terapije ciji je id prosledjen
router.get("/:idTipa",authCheck,async (req,res)=>{
  try{
    const tipTer=await TipTerapije.findById(req.params.idTipa);
    if(tipTer){
      res.send(tipTer);
    }
    else{
      res.status(404).send("Greska prilikom preuzimanja terapije");
    }

  }catch{
    res.status(404).send("Greska prilikom preuzimanja terapije");
  }


})

//dodavanje novog tipa terapije
router.post("",authCheck,async (req,res)=>{
  const noviTipTerapije =new TipTerapije({
    naziv:req.body.naziv,
    opis: req.body.opis
  });
  try{
    const t=await noviTipTerapije.save();
    console.log("proba ovde")
    res.send("Uspesno")

  }catch{
    console.log("greska ovde")
    res.status(305).send("Doslo je do greske. Ovaj tip terapije vec postoji u savetovalistu.")

  }

})

//azuriranje informacija o tipu ciji je ID prosledjen
router.put("/:id",authCheck, async (req,res)=>{
  try{
    const tip=await TipTerapije.findById(req.params.id);
    tip.naziv=req.body.naziv;
    tip.opis=req.body.opis;
    await tip.save()
    console.log("uso ovde")
    res.send("Uspenso");
  }
  catch{
    res.status(305).send("Ovaj tip terapije vec postoji u savetovalistu."); //proveriti da li
  }
})

//brisanje tipa terapije ciji je id proslednjen(tip terapije se brise ako nijedan terapeut ne drzi taj tip)
router.delete("/:id",authCheck,async (req,res)=>{
  TipTerapije.findByIdAndDelete(req.params.id).then(odg=>{
    res.send("Tip terapije je uspesno obrisan");
  })
  .catch(err=>{
    res.status(404).send("Ne postoji tip terapije sa ovim id-em");
  })
})

//pretrazivanje terapija po tipu, case insensitive
router.get("/:nazivTerapije",authCheck,async (req,res)=>{
  let nazivTerapije=req.params.nazivTerapije.replace("%20"," ");
  const terapije =await TipTerapije.find({naziv:new RegExp(`^${nazivTerapije}$`, 'i')});
  if(terapije.length>0){
    res.send(terapije);
    console.log(terapije);
  }
  else{
    res.status(404).send("Ne postoji ovakav tip terapije");
  }
})

router.get("/:idTipa/listTerapija/:idKlijenta",async (req,res)=>{
  try{
    let listaTerapija=[]
    if(req.params.idKlijenta==="neulogovan"){
      listaTerapija=await Terapija.find({tip:req.params.idTipa}).populate('terapeut','ime prezime specijalizacija').populate('tip','naziv');
    }else{
      const klijent=await Klijent.findById(req.params.idKlijenta).select('terapije');
      if(!klijent){
        return res.status(305).send("Doslo je do greske, prijavite se ponovo.");
      }
      const idTerapija=[];
      for(let ter of klijent.terapije){
        idTerapija.push(ter.idTerapije);
      }
      const listaKlijentovihTerapija=await Terapija.find({tip:req.params.idTipa,_id:{$in:idTerapija}}).populate('terapeut','ime prezime specijalizacija').populate('tip','naziv');
      for(let el of listaKlijentovihTerapija){
        for(e of klijent.terapije){
          if(String(e.idTerapije)==String(el._id)){
            listaTerapija.push({
              _id:e.idTerapije,
              ukupno:e.ukupno,
              odradjeno:e.odradjeno,
              terapeut:el.terapeut,
              tip:el.tip,
              detalji:el.detalji,
              cena:el.cena
            })
          }
        }
      }
     const listaNeKlijentovihTerapija=await Terapija.find({tip:req.params.idTipa,_id:{$nin:idTerapija}}).populate('terapeut','ime prezime specijalizacija').populate('tip','naziv');
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
