import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { TerapijeService } from '../services/terapije.service';
import { TerapijaCardInfo } from '../shared/terapija-card.model';

@Component({
  selector: 'app-terapija-card-list',
  templateUrl: './terapija-card-list.component.html',
  styleUrls: ['./terapija-card-list.component.css'],
})
export class TerapijaCardListComponent implements OnInit, OnDestroy {
  @Input() terapije: TerapijaCardInfo[];
  isLoading: boolean = false;
  @Input() basicView: boolean = false;
  @Input() loadOnStart: boolean = true;
  @Input() allowDel: boolean = true;
  brisanjeSub: Subscription;
  dodavanjeSub: Subscription;

  constructor(
    private http: HttpClient,
    private klijentService: KlijentService,
    private router: Router,
    private terapijaService: TerapijeService
  ) {}

  ngOnInit(): void {
    if (this.loadOnStart) {
      this.UcitajTerapijeKlijenta();
    }
    this.brisanjeSub = this.terapijaService.otkazivanjeTerapijeClick.subscribe(
      (idTerapije) => {
        if (this.allowDel) {
          this.ObrisiTerapijuFront(idTerapije);
        } else {
          this.promeniNaNeizabranu(idTerapije);
        }
      }
    );
    this.dodavanjeSub = this.terapijaService.pretplataTerapijeSub.subscribe(
      (idTerapije) => {
        this.DodajTerapijuFront(idTerapije);
      }
    );
  }

  promeniNaNeizabranu(id: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.terapije.length && !found; i++) {
      if (this.terapije[i].getID() === id) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.terapije[index].setOdradjeno(null);
      this.terapije[index].setUkupno(null);
    }
  }

  DodajTerapijuFront(id: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.terapije.length && !found; i++) {
      if (this.terapije[i].getID() === id) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.terapije[index].setOdradjeno(0);
      this.terapije[index].setUkupno(10);
    }
  }

  ObrisiTerapijuFront(id: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.terapije.length && !found; i++) {
      if (this.terapije[i].getID() === id) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.terapije.splice(index, 1);
    }
  }

  UcitajTerapijeKlijenta() {
    this.isLoading = true;
    this.http
      .get<any>(
        'http://localhost:3000/klijenti/' +
          this.klijentService.getKlijentID() +
          '/terapijeInfo'
      )
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            return new TerapijaCardInfo(
              responseEl.idTerapije,
              responseEl.detaljiTerapije,
              responseEl.cena,
              responseEl.tipTerapije,
              responseEl.imeTerapeuta,
              responseEl.prezimeTerapeuta,
              responseEl.specijalizacija,
              responseEl.idTerapeuta,
              responseEl.ukupno,
              responseEl.odradjeno
            );
          });
        })
      )
      .subscribe(
        (modifiedData) => {
          this.terapije = modifiedData;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onNoTerapijeClicked() {
    this.router.navigateByUrl('/klijent/terapije');
  }

  ngOnDestroy() {
    if (this.brisanjeSub) {
      this.brisanjeSub.unsubscribe();
    }
  }
}
