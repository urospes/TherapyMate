const express=require('express');
const router=express.Router();
const authCheck=require("../middleware/auth-check");

const Savetovaliste=require('../models/savetovaliste');

//vraca informacije o savetovalistu
router.get("",async (req,res)=>{
  try{
    const savetovaliste =await Savetovaliste.findOne({});
     res.send(savetovaliste);
  }
  catch{
    res.status(404).send("Greska prilikom pribavljanja savetovalista!");
  }

})

//azuriranje informacija o savetovalistu
router.put("",authCheck, async (req,res)=>{
  try{
    const savetovaliste=await Savetovaliste.findOne({});
    if(savetovaliste){
      savetovaliste.ime=req.body.ime;
      savetovaliste.adresa=req.body.adresa;
      savetovaliste.telefon= req.body.telefon;
      savetovaliste.email=req.body.email;
      savetovaliste.opis=req.body.opis;
      await savetovaliste.save();
      res.send("Podaci o savetovalistu azuzirani uspesno");
    }else{
      res.status(305).send("Greska pri azuriranju!");
    }

  }
  catch{
    res.status(305).send("Greska pri azuriranju!");
  }
})

module.exports=router;
