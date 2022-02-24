import { Test } from './test.model';

export class Klijent {
  private _id: string;
  private _terapeutiTerapije: { _idTerapeuta: string; _terapije: string[] }[] =
    []; // terapeut -> lista terapija AKO JE PRIVATNO NIKAKO NE MOGU DA MU DODAM NOV PODATAK, TJ KAD GA RETURNUJEM U GETERU NECE
  private _noviTestovi: Test[] = []; //novi testovi koje klijent treba da radi
  private _ime: string;
  private _prezime: string;
  private _idKartona: string; //klijenti poseduju kartone
  private _email : string;
  private _lozinka : string;
  private _telefon : string;
  private _slika : string;
  constructor(
    id: string,
    ime: string,
    prezime: string,
    idKartona: string,
    terapeutiTerapije: { _idTerapeuta: string; _terapije: string[] }[] = [],
    testovi: Test[] = [],
    email : string,
    lozinka : string,
    telefon : string,
    slika : string
  ) {
    this._id = id;
    this._ime = ime;
    this._prezime = prezime;
    this._idKartona = idKartona;
    this._terapeutiTerapije = terapeutiTerapije;
    this._noviTestovi = testovi;
    this._lozinka=lozinka;
    this._email=email;
    this._telefon=telefon;
    this._slika=slika;
  }

  getTerapeutiTerapije() {
    return this._terapeutiTerapije;
  }
  getTerapeuti() {
    //OVA FUNKCIJA VRACA NOVI NIZ TJ. KOPIJU NIZA SA TERAPEUTIMA!
    const temp: string[] = this._terapeutiTerapije.map((element) => {
      return element._idTerapeuta;
    });
    return temp;
  }
  getIme() {
    return this._ime;
  }
  getPrezime() {
    return this._prezime;
  }
  getKartonID() {
    return this._idKartona;
  }
  getTerapije() {
    //VRACA SAMO KOPIJU NIZA TERAPIJA, KOJE NISU ORGANIZOVANE PO TERAPEUTIMA!
    const temp: string[] = [];
    for (let terapeut of this._terapeutiTerapije) {
      temp.concat(terapeut._terapije);
    }
    return temp;
  }
  getTestovi() {
    return this._noviTestovi;
  }
  getID(){
    return this._id;
  }
  getEmail(){
    return this._email;
  }
  getTelefon(){
    return this._telefon;
  }
  getLoznika(){
    return this._lozinka;
  }
  getSlika(){
    return this._slika;
  }
  setID(id : string){
    this._id=id;
  }


}
