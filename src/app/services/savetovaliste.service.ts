import { Injectable } from '@angular/core';
import { Klijent } from '../shared/klijent.model';
import {
  PitanjeSaPonudjenimOdgovorima,
  TekstualnoPitanje,
} from '../shared/pitanje.model';
import { Savetovaliste } from '../shared/savetovaliste.model';
import { Terapeut } from '../shared/terapeut.model';
import { Terapija } from '../shared/terapija.model';
import { Test } from '../shared/test.model';
import { TipTerapija } from '../shared/tipTerapija.model';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TerapeutItemComponent } from '../terapeut-item/terapeut-item.component';
import { TerapeutCardInfo } from '../shared/terapeutCardInfo.model';

@Injectable({ providedIn: 'root' })
export class SavetovalisteService {
  private savetovaliste: Savetovaliste;
  id : string='';

  constructor(private http: HttpClient) {
    this.savetovaliste = new Savetovaliste('PsihoSvet', 'Cara Dusana 11');
  }
  setID(id : string){
    this.id=id;
  }

  savetovalisteSviKlijenti() {
    return this.savetovaliste.getSviKlijenti();
  }
  savetovalisteSviTerapeuti() {
    return this.savetovaliste.getSviTerapeuti();
  }

  terapeutRegistracija(terapeut: Terapeut) {
    this.savetovaliste.dodajTerapeuta(terapeut);
  }
  terapeutBrisanje(terapeut: Terapeut) {
    let index = -1;
    for (let i = 0; i < this.savetovaliste.getSviTerapeuti().length; i++) {
      // ovo poredi reference, tako da mozda nece da radi, obrati paznju!
      if (this.savetovaliste.getSviTerapeuti[i] === terapeut) index = i;
    }
    if (index !== -1) {
      this.savetovaliste.getSviTerapeuti().splice(index, 1);
    }
  }
  klijentRegistracija(klijent: Klijent) {
    this.savetovaliste.dodajKlijenta(klijent);
  }

  getTipTerapija() {
    return this.savetovaliste.getTipTerapija();
  }
  getTerapeutById(id: string) {
    for (let terapeut of this.savetovaliste.getSviTerapeuti()) {
      if (id === terapeut.getId()) return terapeut;
    }
  }

  /*ucitajTerapeute() {
    return this.http
      .get<TerapeutCardInfo[]>('http://localhost:3000/terapeuti/osnovneInfo')
      .pipe(
        map((responseData) => {
          return responseData.map((singleTerapeut) => {
            return new TerapeutCardInfo(
              singleTerapeut.id,
              singleTerapeut.ime,
              singleTerapeut.prezime,
              singleTerapeut.brTerapija,
              singleTerapeut.brKlijenata,
              singleTerapeut.ocena,
              singleTerapeut.tipoviTerapija
            );
          });
        })
      );
  }*/

  setTerapeuti(terapeuti: Terapeut[]) {
    this.savetovaliste.setTerapeuti(terapeuti);
  }
}
