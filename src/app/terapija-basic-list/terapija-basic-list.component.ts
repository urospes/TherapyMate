import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KlijentService } from '../services/klijent.service';
import { TerapijeService } from '../services/terapije.service';
import { TerapijaBasic } from '../shared/terapija-basic.model';

@Component({
  selector: 'app-terapija-basic-list',
  templateUrl: './terapija-basic-list.component.html',
  styleUrls: ['./terapija-basic-list.component.css'],
})
export class TerapijaBasicListComponent implements OnInit, OnDestroy {
  @Input() terapije: TerapijaBasic[] = [];
  pretplataSubscription: Subscription;
  otkazivanjeSubscription: Subscription;

  constructor(
    private klijentService: KlijentService,
    private http: HttpClient,
    private terapijeService: TerapijeService
  ) {}

  ngOnInit(): void {
    this.pretplataSubscription =
      this.terapijeService.pretplataTerapijeSub.subscribe((subData) => {
        this.dodajTerapijuFront(subData);
      });
    this.otkazivanjeSubscription =
      this.terapijeService.otkazivanjeTerapijeClick.subscribe((subData) => {
        this.promeniNaNeizabranu(subData);
      });
  }

  dodajTerapijuFront(id: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.terapije.length && !found; i++) {
      if (this.terapije[i].getId() === id) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.terapije[index].setOdradjeno(0);
      this.terapije[index].setUkupno(10);
    }
  }

  promeniNaNeizabranu(id: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.terapije.length && !found; i++) {
      if (this.terapije[i].getId() === id) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.terapije[index].setOdradjeno(-1);
      this.terapije[index].setUkupno(-1);
    }
  }

  ngOnDestroy() {
    if (this.pretplataSubscription) {
      this.pretplataSubscription.unsubscribe();
    }
    if (this.otkazivanjeSubscription) {
      this.otkazivanjeSubscription.unsubscribe();
    }
  }
}
