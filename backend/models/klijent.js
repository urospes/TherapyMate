const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;

const klijentSchema=new Schema({
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
  slika:{
    type: String
  },
  odobren:{
    type: Boolean,
    require:true
  },
  obavestenja:{
    type: [String]
  },
  terapije:[
    {
      idTerapije:{
        type: Schema.Types.ObjectId,
        ref:'Terapija'
      },
      ukupno : Number,
      odradjeno : Number
    }
  ],
  testovi:[{type: Schema.Types.ObjectId, ref:'Test'}]//lista testova koje treba da uradi



})
klijentSchema.plugin(uniqueValidator);

const Klijent=mongoose.model('Klijent',klijentSchema);
module.exports=Klijent;
