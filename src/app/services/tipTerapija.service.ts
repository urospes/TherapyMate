import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Terapija } from '../shared/terapija.model';
import { TipTerapija } from '../shared/tipTerapija.model';
import { SavetovalisteService } from './savetovaliste.service';
import { TerapeutService } from './terapeut.service';

@Injectable({ providedIn: 'root' })
export class TipTerapijaService {
  tipTerapijaChanged = new Subject<TipTerapija[]>();
  terapijaChanged = new Subject<Terapija[]>();
  private tipTerapija: TipTerapija[]=[];

  constructor(savetovalisteService: SavetovalisteService,
    private http : HttpClient) {
    
  }

  getTipTerapije(): TipTerapija[] {
    if (this.tipTerapija.length==0)
    this.fetchTipTerapija();
    return this.tipTerapija.slice(0);
  }

  getTipTerapija(index: number) {
    return this.tipTerapija[index];
  }

  addTipTerapija(tipTerapija: TipTerapija) {
    this.tipTerapija.push(tipTerapija);
    this.tipTerapijaChanged.next(this.tipTerapija.slice());
  }

  updateTipTerapija(index: number, newTerapija: TipTerapija) {
    this.tipTerapija[index] = newTerapija;
    this.tipTerapijaChanged.next(this.tipTerapija.slice());
  }

  deleteTipTerapija(index: number) {
    this.tipTerapija.splice(index, 1);
    this.tipTerapijaChanged.next(this.tipTerapija.slice());
  }

  getTerapija(id: string) {
    let terapija;
    let i = 0;
    while (terapija === undefined && i < this.tipTerapija.length) {
      terapija = this.tipTerapija[i++].terapije.find(
        (terapija) => terapija.id == id
      );
    }
    return terapija;
  }
  addTerapija(terapija: Terapija) {
    const index = this.tipTerapija.findIndex(
      (tip) => tip.naziv == terapija.tip
    );
    this.tipTerapija[index].terapije.push(terapija);
    this.terapijaChanged.next(this.tipTerapija[index].terapije.slice());
  }

  updateTerapija(id: string, detalji : string, cena : number) {
    return this.http.patch(`http://localhost:3000/terapije/${id}`, {
      detalji : detalji,
      cena : cena
      }, { responseType : 'text'})
  }

  deleteTerapija(id: string) {
    return this.http.delete(`http://localhost:3000/terapije/${id}`, {
      responseType:'text'
    });
  }
  getTerapije(): Terapija[] {
    let terapije: Terapija[] = [];
    this.tipTerapija.forEach((element) => {
      element.terapije.forEach((terapija) => {
        terapije.push(terapija);
      });
    });
    return terapije;
  }
  getTerapijeByTerapeutID(id: string) {
    let terapije: Terapija[] = [];
    this.tipTerapija.forEach((element) => {
      element.terapije.forEach((terapija) => {
        if (terapija.idTerapeuta === id) terapije.push(terapija);
      });
    });
    return terapije;
  }

  fetchTipTerapija(){
     return this.http.get< { naziv:string, opis:string , terapueti : string[], terapije : string[], _id : string} [] >('http://localhost:3000/tipoviTerapija');
    
  }
  logError(error)
  {
    console.log(error);
  }
}
