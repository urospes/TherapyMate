import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';
import { TerapeutService } from '../services/terapeut.service';
import { Terapeut } from '../shared/terapeut.model';

@Component({
  selector: 'app-terapeut-profil',
  templateUrl: './terapeut-profil.component.html',
  styleUrls: ['./terapeut-profil.component.css']
})
export class TerapeutProfilComponent implements OnInit {
terapeut : Terapeut;
isLoading : boolean=false;
obavestenja : string[]=[];
  constructor(private korisnikLogovanjeService : KorisnikLogovanjeService, 
    private terapeutService : TerapeutService, private router : Router, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.korisnikLogovanjeService.loggedKorisnik
    .pipe (
      take(1)
      ). subscribe(
    (korisnik) => {
      if (korisnik) {
          this.terapeutService.fetchTerapeut().subscribe( (data)=> {
            this.obavestenja=data.obavestenja;
            this.terapeut=new Terapeut(data.id, data.ime, data.prezime, data.ocena, data.slika, [],[],[], data.email,'',data.telefon, data.specijalizacija, data.opis);
            this.isLoading=false;
          })
        }
    }
    );
  }
  onTerminiClicked(){
    this.router.navigate(['/terapeut/termini']);
  }
  onKlijentiClicked(){
    this.router.navigate(['/terapeut/klijenti']);
  }
  onTerapijeClicked(){
    this.router.navigate(['/terapeut/terapije']);
  }
  onTestoviClicked(){
    this.router.navigate(['/terapeut/testovi']);
  }
  onIzmeniClick(){
    this.router.navigate(['/terapeut/izmeniprofil'], /*{ relativeTo: this.route }*/);
  }

}
