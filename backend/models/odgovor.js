const mongoose =require('mongoose');
const {Schema}=mongoose;

const odgovorSchema=new Schema({
  sadrzajOdgovora: {
    type: String
  },
  test:{ type: Schema.Types.ObjectId, ref:'Test'},//odgovor je za jedan test ??? Da li da se cuva i ovo??
  pitanje:{ type: Schema.Types.ObjectId, ref:'Pitanje'},//odgovor je vezan za jedno pitanje
  klijent:{ type: Schema.Types.ObjectId, ref:'Klijent'}//klijent ciji je ovo odgovor
})

const odgovor=mongoose.model('Odgovor',odgovorSchema);
module.exports=odgovor;
