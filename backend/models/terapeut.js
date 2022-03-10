const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;


const terapeutSchema=new Schema({
  ime:{
    type: String,
    require: true
  },
  prezime:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true,
    unique:true
  },
  lozinka:{
    type: String,
    require: true
  },
  telefon:{
    type: String,
    require: true
  },
  specijalizacija:{
    type: String,
    require: true
  },
  opis:{
    type: String,
    require: true
  },
  slika:{
    type: String,
    //require: true
  },
  obavestenja:{
    type: [String]
  },
  odobren:{
    type: Boolean,
    require:true
  },
  terapije:[{ type: Schema.Types.ObjectId, ref:'Terapija' }],//lista terapija, svaka u sebi ima ref na TipTerapije
  klijenti:[{ type: Schema.Types.ObjectId, ref:'Klijent' }], //lista njegovih klijenata
})
terapeutSchema.plugin(uniqueValidator);
const Terapeut=mongoose.model('Terapeut',terapeutSchema);
module.exports=Terapeut;
