import { Klijent } from './klijent.model';
import { Terapeut } from './terapeut.model';
import { TipTerapija } from './tipTerapija.model';

export class Savetovaliste {
  private _sviTerapeuti: Terapeut[] = []; //svi terapeuti savetovalista
  private _sviKlijenti: Klijent[] = []; //ovo nam mozda i ne treba, svi klijenti savetovalista
  private _naziv: string;
  private _adresa: string;
  private _tipterapija: TipTerapija[] = [];

  constructor(
    naziv: string,
    adresa: string,
    terapeuti: Terapeut[] = [],
    klijenti: Klijent[] = [],
    tipTerapija: TipTerapija[] = []
  ) {
    this._naziv = naziv;
    this._adresa = adresa;
    this._sviTerapeuti = terapeuti;
    this._sviKlijenti = klijenti;
    this._tipterapija = tipTerapija;
  }

  getSviTerapeuti() {
    return this._sviTerapeuti;
  }
  dodajTerapeuta(terapeut: Terapeut) {
    this._sviTerapeuti.push(terapeut);
  }
  getSviKlijenti() {
    return this._sviKlijenti;
  }
  dodajKlijenta(klijent: Klijent) {
    this._sviKlijenti.push(klijent);
  }

  getTipTerapija() {
    return this._tipterapija;
  }

  setTerapeuti(terapeuti: Terapeut[]) {
    this._sviTerapeuti = terapeuti;
  }
}
