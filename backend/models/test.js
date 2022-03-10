const mongoose =require('mongoose');
const {Schema}=mongoose;

const testSchema=new Schema({
  arhiviran:{
    type: Boolean,
    require: true
  },
  pitanja:[{ type: Schema.Types.ObjectId, ref:'Pitanje'}],//niz pitanja
  terapeut:{ type: Schema.Types.ObjectId, ref:'Terapeut'},//terapeut koji je sastavio test
  klijenti:[{ type: Schema.Types.ObjectId, ref:'Klijent'}]//jedan isti test moze da bude namenjen za vise klijenta jednog terapeuta
})

const test=mongoose.model('Test',testSchema);
module.exports=test;
