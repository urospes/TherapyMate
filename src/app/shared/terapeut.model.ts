
import { Klijent } from './klijent.model';
import { Terapija } from './terapija.model';
import { Test } from './test.model';

export class Terapeut {
  private _id: string;
  private _ime: string;
  private _prezime: string;
  private _imgPath: string;
  private _email : string;
  private _lozinka : string;
  private _telefon : string;
  private _specijalizacija : string;
  private _opis : string;

  private _klijenti: string[];
  private _terapije: Terapija[];
  private _testovi: Test[];
  private _ocena: number;

  constructor(
    id: string,
    ime: string = '',
    prezime: string = '',
    ocena: number = 0,
    path: string = '',
    klijenti: string[] = [],
    terapije: Terapija[] = [],
    testovi: Test[] = [],
    email : string,
    lozinka : string,
    telefon : string,
    specijaliazcija : string,
    opis : string
  ) {
    this._id = id;
    this._ime = ime;
    this._prezime = prezime;
    this._klijenti = klijenti;
    this._terapije = terapije;
    this._ocena = ocena;
    this._imgPath = path;
    this._testovi = testovi;
    this._email=email;
    this._lozinka=lozinka;
    this._telefon=telefon;
    this._specijalizacija=specijaliazcija;
    this._opis=opis;
  }
  getEmail(){
    return this._email;
  }
  getLozinka(){
    return this._lozinka;
  }
  getTelefon(){
    return this._telefon;
  }
  getSpecijalizacija(){
    return this._specijalizacija;
  }
  getOpis(){
    return this._opis;
  }
  getId() {
    return this._id;
  }
  getIme() {
    return this._ime;
  }
  getPrezime() {
    return this._prezime;
  }
  getKlijenti() {
    return this._klijenti; //vidi da li sa slice ili ovako
  }
  getTerapije() {
    return this._terapije; //mozda i sa slice da ne bi radili sa istom referencom
  }
  getOcena() {
    return this._ocena;
  }
  getImgPath() {
    return this._imgPath;
  }
  getTestovi() {
    return this._testovi;
  }
}
