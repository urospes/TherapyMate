const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;

const korisnikSchema=new Schema({
  email:{
    type: String,
    require: true,
    unique:true
  },
  lozinka:{
    type: String,
    require: true
  },
  odobren:{
    type: Boolean,
    require: true
  },
  tip:{
    type: String,
    enum: ['klijent','terapeut','administrator'],
    require: true
  }
})
korisnikSchema.plugin(uniqueValidator);

const Korisnik=mongoose.model('Korisnik',korisnikSchema);
module.exports=Korisnik;
