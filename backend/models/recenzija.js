const mongoose =require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const {Schema}=mongoose;

const recenzijaSchema=new Schema({
  ocena:{
    type: Number,
    require: true
  },
  komentar :{
    type: String,
    require: true
  },
  terapeut:{type: Schema.Types.ObjectId, ref:'Terapeut'},//na kog terapeuta se odnosi recenzija
  klijent:{type:Schema.Types.ObjectId,ref:'Klijent'}
})
recenzijaSchema.plugin(uniqueValidator);

const recenzija=mongoose.model('Recenzija',recenzijaSchema);
module.exports=recenzija;
