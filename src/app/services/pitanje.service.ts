import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Pitanje, PitanjeSaPonudjenimOdgovorima, TekstualnoPitanje } from '../shared/pitanje.model';
import { Test } from '../shared/test.model';
import { TestService } from './test.service';

@Injectable({
  providedIn: 'root'
})
export class PitanjeService {
  pitanjeChanged=new Subject<Pitanje[]>();
  pitanjaZaBrisanje : Pitanje[]=[];
  pitanja : Pitanje[]=[];
  trenutnoPitanje : Pitanje;
  constructor(private testService : TestService) {
  if (this.testService.getTrenutniTest())
    this.pitanja=this.testService.getTrenutniTest().pitanja;
   }
  getTrenutnoPitanje(){
    return this.trenutnoPitanje;
  }
  setTrenutnoPitanje(pitanje : Pitanje){
    this.trenutnoPitanje=pitanje;
  }
  getPitanja(){
    return this.pitanja;
  }
  getPitanje(id : number){
    return this.pitanja.find(pitanje => pitanje.id===id);
  }

  addPitanje(pitanje : Pitanje){
    pitanje.id=this.pitanja.length;
    this.pitanja.push(pitanje);
    this.pitanjeChanged.next(this.pitanja.slice());
  }

  updatePitanje(novoPitanje : Pitanje){
    const index= this.pitanja.findIndex(pitanje => pitanje.id===novoPitanje.id);
    this.pitanja[index]=novoPitanje;
    this.pitanjeChanged.next(this.pitanja.slice());
  }
  deletePitanje(staroPitanje : Pitanje){
    //console.log(this.pitanja);
    const index= this.pitanja.findIndex(pitanje => pitanje.id===staroPitanje.id);
    this.pitanjaZaBrisanje=this.pitanjaZaBrisanje.concat(this.pitanja.splice(index, 1)); //za slucaj otkazi kod promene testa ne brisemo pitanje jos
    //console.log(this.pitanjaZaBrisanje)
    this.testService.getTrenutniTest().pitanja=this.pitanja;
    console.log(this.pitanja);
    this.pitanjeChanged.next(this.pitanja.slice());
  }
  izbrisiArhiviranaPitanja(){
    //brisanje iz baze
    this.pitanjaZaBrisanje=[];
    this.testService.trenutniTest.pitanja=this.pitanja;
    this.pitanjeChanged.next(this.pitanja.slice());
  }
  vratiArhiviranaPitanja(){
    this.pitanja=this.pitanja.concat(this.pitanjaZaBrisanje);
    this.testService.getTrenutniTest().pitanja=this.pitanja;
    this.pitanjaZaBrisanje=[];
    this.pitanjeChanged.next(this.pitanja.slice());
  }
}
