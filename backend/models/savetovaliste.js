const mongoose =require('mongoose');
const {Schema}=mongoose;


const savetovalisteSchema=new Schema({
  ime:{
    type: String,
    require: true
  },
  adresa:{
    type: String,
    require: true
  },
  telefon:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  opis:{
    type: String,
    require: true
  }
})

const Savetovaliste=mongoose.model('Savetovaliste',savetovalisteSchema);
module.exports=Savetovaliste;
