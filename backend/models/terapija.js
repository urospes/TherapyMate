const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;

const terapijaSchema=new Schema({
  detalji:{
    type: String,
    require: true,
    unique: true
  },
  cena:{
    type: Number,
    require: true
  },
  //terapija pripada samo jednom tipu
  tip:{type: Schema.Types.ObjectId, ref:'TipTerapije'},
  //terapija sa konkretnim detaljima je vezana samo za jednog terapeuta
  terapeut:{ type: Schema.Types.ObjectId, ref:'Terapeut'}
})
terapijaSchema.plugin(uniqueValidator);

const Terapija=mongoose.model('Terapija',terapijaSchema);
module.exports=Terapija;
