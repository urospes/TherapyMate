const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;

const tipTerapijeSchema=new Schema({
  naziv:{
    type: String,
    require: true,
    unique: true
  },
  opis:{
    type: String,
    require: true
  },
  terapeuti: [{ type: Schema.Types.ObjectId, ref:'Terapeut'}],
  terapije:[{ type: Schema.Types.ObjectId, ref:'Terapija'}]//lista svih terapija tog tipa
})
tipTerapijeSchema.plugin(uniqueValidator);

const TipTerapije=mongoose.model('TipTerapije',tipTerapijeSchema);
module.exports=TipTerapije;
