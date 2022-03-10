const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;


const terminSchema=new Schema({
  slobodan:{
    type: Boolean,
    require: true
  },
  potvrdjen:{
    type: Boolean
  },
  vreme:{
    type: String,
    require: true
  },
  datum:{
    type: Date,
    require: true
  },
  trajanje:{
    type: String,
    require: true
  },
  terapija:{ type: Schema.Types.ObjectId, ref:'Terapija' },//koju terapiju je klijent zakazao
  klijent:{ type: Schema.Types.ObjectId, ref:'Klijent' }, //koji klijent je zakazao(ako je zakazao neko)
  terapeut:{type: Schema.Types.ObjectId, ref:'Terapeut'}//od kog terapeuta je ovaj termin
})

terminSchema.plugin(uniqueValidator);
const termin=mongoose.model('termin',terminSchema);
module.exports=termin;
