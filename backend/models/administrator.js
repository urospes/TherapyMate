const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;

const administratorSchema=new Schema({
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
  }
})
administratorSchema.plugin(uniqueValidator);

const administrator=mongoose.model('Administrator',administratorSchema);
module.exports=administrator;
