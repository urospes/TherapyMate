const mongoose =require('mongoose');
const {Schema}=mongoose;

const pitanjeSchema=new Schema({
  tekstPitanja: {
    type: String,
    require: true,
  },
  ponudjeniOdgovori:{
    type: [String] //ako je pitanje sa ponudjenim odgovorima
  }
})
const pitanje=mongoose.model('Pitanje',pitanjeSchema);
module.exports=pitanje;
