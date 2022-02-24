import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Klijent } from '../shared/klijent.model';
import { LoggedKorisnik } from '../shared/logged-korisnik.model';
import { Pitanje } from '../shared/pitanje.model';
import { Savetovaliste } from '../shared/savetovaliste.model';
import { Terapeut } from '../shared/terapeut.model';
import { Terapija } from '../shared/terapija.model';
import { Termin } from '../shared/termin.model';
import { Test } from '../shared/test.model';
import { SavetovalisteService } from './savetovaliste.service';
import { TipTerapijaService } from './tipTerapija.service';

@Injectable({ providedIn: 'root' })
export class TerapeutService {
  private terapeut: Terapeut = null; //TRENUTNO ULOGOAVNI TERAPEUT
  //private token: string = '';
  private id: string;
  private msg : string;
  response : Subject<string>=new Subject<string>();

  public terapijeChagned = new Subject<Terapija[]>();
  public klijentiChagned = new Subject<Klijent[]>();
  public terminiChanged= new Subject<Termin[]>();
  private terapije: Terapija[] = [];
  private klijenti : Klijent[]=[];
  private termini : Termin[]=[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private terapijaService: TipTerapijaService
  ) {
  }

  setTerapeutID(id: string) {
    this.id = id;
  }
  getKlijenti(){
    if (this.klijenti.length==0)
    this.fetchKlijenti();
    return this.klijenti;
  }
  getTerapije() {

    if (this.terapije.length == 0) {
      this.fetchTerapijeByTeraputID();
    }

    return this.terapije;
  }
  getTerapijaById(id: string) {
    if (this.terapije.length == 0) {
      this.fetchTerapijeByTeraputID();
    }
    let x= this.terapije.findIndex((t) => t.id == id);
   // console.log(this.terapije[x]);
    return this.terapije[x];
  }
  getTerapijeByKlijentId(id : string){
    if (this.terapije.length == 0) {
      this.fetchTerapijeByTeraputID();
    }
    return this.terapije;
  }
  getKlijentById(id : string){
    if (this.klijenti.length == 0) {
      this.fetchKlijenti();
    }
    return this.klijenti.find((t)=>t.getID()===id);
  }

  getTerapeutID(): string {
    return this.id;
  }

  fetchTerapijeByTeraputID() {
    return this.http
      .get<any>(`http://localhost:3000/terapeuti/${this.id}/terapije`)
  }
  fetchKlijenti(){
    return this.http.get<any>( `http://localhost:3000/terapeuti/${this.id}/klijenti`);
    
  }
  fetchKlijent(id : string){
    return this.http.get<any>( `http://localhost:3000/klijenti/${id}`);
  }
  fetchTerapijeByTeraput() {
    return this.http
      .get<any>(`http://localhost:3000/terapeuti/${this.id}/terapije`)
  }
  fetchTerapeut(){
    return this.http.get<any>(`http://localhost:3000/terapeuti/${this.id}`);
  }
  updateTerapeutInfo(terapeut : Terapeut, loz: string, image : File | string){{
      let formData: FormData = new FormData();
      ;
      if (typeof(image)==='object'){

        formData.append('image', image);
        formData.append('ime', terapeut.getIme());
        formData.append('prezime', terapeut.getPrezime());
        formData.append('email', terapeut.getEmail());
        formData.append('lozinka', terapeut.getLozinka());
        formData.append('novaLozinka', loz);
        formData.append('telefon', terapeut.getTelefon());
        formData.append('opis', terapeut.getOpis());
        formData.append('specijalizacija', terapeut.getSpecijalizacija());
        formData.append('imagePath', terapeut.getImgPath());

        return this.http.put(`http://localhost:3000/terapeuti/${this.id}`, formData, {responseType : 'text'});
      }
      else {
        return this.http.put(`http://localhost:3000/terapeuti/${this.id}`, {
      id : this.id,
      ime : terapeut.getIme(),
      prezime : terapeut.getPrezime(),
      email: terapeut.getEmail(),
      telefon : terapeut.getTelefon(),
      specijalizacija : terapeut.getSpecijalizacija(),
      opis : terapeut.getOpis(),
      lozinka : terapeut.getLozinka(),
      novalozinka: loz,
      imagePath : terapeut.getImgPath()
    }, {responseType : 'text'})


 }
}

  }
  updateTerapija(id: string, detalji: string, cena: number, tip: string) {
    this.terapijaService.updateTerapija(id, detalji, cena);
    // console.log(this.terapije)
    // const index = this.terapije.findIndex((i) => i.id == id);
    // this.terapije[index].detalji = detalji;
    // this.terapije[index].cena = cena;
    // this.terapijeChagned.next(this.terapije.slice());
  }
  addTerapija(detalji: string, tip: string, cena: number) {
    let id = this.getTerapeutID();
    let i : string='';
    this.http
      .post<string>(`http://localhost:3000/terapije/${id}`, {
        detalji: detalji,
        tipTerapije: tip,
        cena: cena,
      })
      .subscribe(
        (data) => {
          //(data)
          this.terapije.push(new Terapija(data, this.id, tip, detalji, cena));
          this.terapijeChagned.next(this.terapije.slice());
          this.msg= data;
          
        },
        (err) => {
          if(err.status==305)
        this.msg=err.error.toString();
        }
      );
      return this.msg;
  }
  dodajTerapiju(detalji: string, tip: string, cena: number) {
      let id = this.getTerapeutID();
     return this.http
        .post<string>(`http://localhost:3000/terapije/${id}`, {
          detalji: detalji,
          tipTerapije: tip,
          cena: cena,
        })
  }
  dodajUServis(t : Terapija){
    this.terapije.push(t);
    this.terapijeChagned.next(this.terapije);
  }
  deleteTerapija(id: string) {
    this.terapijaService.deleteTerapija(id);
    let i = this.terapije.findIndex((t) => t.id != id);
    this.terapije.splice(i + 1, 1);
    this.terapijeChagned.next(this.terapije);
  }
  addTerapeut(terapeut: Terapeut, image : File) {
    const formData: FormData = new FormData();

    formData.append('image', image);
    formData.append('ime', terapeut.getIme());
    formData.append('prezime', terapeut.getPrezime());
    formData.append('email', terapeut.getEmail());
    formData.append('lozinka', terapeut.getLozinka());
    formData.append('telefon', terapeut.getTelefon());
    formData.append('opis', terapeut.getOpis());
    formData.append('specijalizacija', terapeut.getSpecijalizacija());
    formData.append('imagePath', terapeut.getImgPath());
    
    // ., {
    //   ime: terapeut.getIme(),
    //   prezime: terapeut.getPrezime(),
    //   email: terapeut.getEmail(),
    //   lozinka: terapeut.getLozinka(),
    //   telefon: terapeut.getTelefon(),
    //   slika: terapeut.getEmail(),
    //   opis: terapeut.getOpis(),
    //   specijalizacija: terapeut.getSpecijalizacija(),
    //   file : image
    // }

    //console.log(image)
    return this.http.post('http://localhost:3000/terapeuti',formData ,{responseType : 'text'});
      
  }
  fetchTermini() {
   return this.http.get<any>(`http://localhost:3000/termini/terapeut/${this.id}`)

  }
  fetchSlobodniTermini(){
    return this.http.get<any>(`http://localhost:3000/termini/terapeut/slobodni/${this.id}`)

  }
  fetchZakazaniTermini(){
    return this.http.get<any>(`http://localhost:3000/termini/terapeut/zakazani/${this.id}`)

  }
  fetchPrethodniTermini(){
    return this.http.get<any>(`http://localhost:3000/termini/terapeut/istekliZakazani/${this.id}`)
  }
  fetchTerapijeKlijent(id : string){
    return this.http.get<{_id : string,naziv : string, odradjeno : number, ukupno : number}[]>
    (`http://localhost:3000/terapeuti/${this.id}/klijent/${id}`);
  }
  fetchTestovi(){
    return this.http.get<any>(`http://localhost:3000/testovi/terapeut/${this.id}`);
  }
  fetchNeuradjeniTestoviKlijenta(id : string){
    return this.http.get<any>(`http://localhost:3000/testovi/${this.id}/nedodeljeni/${id}/`);
  }
  fetchTestoviKlijenta(id : string){
    //console.log('ovde')
    return this.http.get<any>(`http://localhost:3000/testovi/klijent/${id}/${this.id}`);
  }
  addTest(){
 // console.log("Dodajem test, id terapeuta jr  "+this.id)
    return this.http.post<string>(`http://localhost:3000/testovi`,
     {idTerapeuta : this.id});
  }
  deleteTest(id : string){
    return this.http.patch(`http://localhost:3000/testovi/arhiviranjeTesta/${id}`,{responseType:'text'});
  }
  addTestKlijentu(id : string, klijent : string){
    return this.http.patch(`http://localhost:3000/testovi/dodeljivanjeKlijentu`, {
      idTesta: id,
      idKlijenta : klijent
    }, { responseType : 'text'});
  }
  terminiKomponenta() {
    this.fetchKlijenti();
    this.fetchTerapijeByTeraputID();
  }
  addTermin(termin : Termin){
    return this.http
    .post('http://localhost:3000/termini/'+this.id, {
      slobodan : true,
      vreme : termin.getVreme(),
      datum : termin.getDatum(),
      trajanje: termin.geTrajanje()
    }, { responseType : 'text'})
    
    //this.terminiChanged.next([]);
  }
  deleteTermin(id : string) {
   return this.http.delete(`http://localhost:3000/termini/${id}`, 
   {
     responseType: 'text'
   });
  }
  deletePropusteniTermin(id : string) {
    return this.http.delete(`http://localhost:3000/termini/${id}/propusten`, 
    {
      responseType: 'text'
    });
   }
  canceltermin(id : string){
    return this.http.patch(`http://localhost:3000/termini/otkazivanje`, {
      idTermina : id,
      otkazuje : 'terapeut'
    },
    {
      responseType: 'text'
    })
  }
  confirmTermin(id : string){
    return this.http.patch(`http://localhost:3000/termini/potvrdjivanje`, {
      idTermina : id
    }, { responseType: 'text'});
  }
  addPitanja(id : string, pitanja : Pitanje[]){
    let pitanjaFormat=[];
    pitanja.forEach((p)=>{
      if (p.tip=='ponudjeni')
      pitanjaFormat.push({tekstPitanja: p.tekst, ponudjeniOdgovori: p.ponudjeniOdgovori});
      else
      pitanjaFormat.push({tekstPitanja: p.tekst, ponudjeniOdgovori: []});
    })
    //console.log("dodajem pitanja, id testa je "+id+"pitanja su"+pitanjaFormat)
    return this.http.post(`http://localhost:3000/testovi/${id}`, {
      pitanja : pitanjaFormat
    }, 
    {
      responseType: 'text'
    });
  }
  logError(error) {
    //console.log(error);
  }


obrisiObavestenje(textObavestenja: string){
  return this.http
  .patch(
    'http://localhost:3000/termini/terapeut/brisanjeObavestenja',
    {
      idTerapeuta: this.id,
      obavestenje: textObavestenja
    },
    {
      responseType: 'text'
    });
}

zavrsiTermin(id : string){
  this.http.patch(`http://localhost:3000/termini/zavrsavanjeTermina/${id}`, {
    }).subscribe(
      (data) => {
        //console.log(data)
      },
      (err) => {
        this.logError(err);
      }
    )
}

}
