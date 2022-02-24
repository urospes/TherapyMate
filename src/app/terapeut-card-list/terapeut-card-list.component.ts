import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { TerapeutClientCard } from '../shared/terapeut-client-info';

@Component({
  selector: 'app-terapeut-card-list',
  templateUrl: './terapeut-card-list.component.html',
  styleUrls: ['./terapeut-card-list.component.css'],
})
export class TerapeutCardListComponent implements OnInit, OnDestroy {
  terapeuti: TerapeutClientCard[];
  isLoading: boolean = false;
  oceniClicked: boolean = false;
  idOcenjivanogTerapeuta: string;
  fullNameOcenjivanogTerapeuta: string;
  subscription: Subscription;
  recenzijaSubscripiton: Subscription;
  otkaziTerapeutaSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private klijentService: KlijentService,
    private router: Router,
    private dialog : MatDialog
  ) {}

  ngOnInit(): void {
    this.recenzijaSubscripiton = this.klijentService.recenzijaSubject.subscribe(
      (subData) => {
        this.oceniClicked = true;
        this.idOcenjivanogTerapeuta = subData.id;
        this.fullNameOcenjivanogTerapeuta = subData.ime + ' ' + subData.prezime;

        setTimeout(() => {
          window.scrollTo({
            top: window.innerHeight,
            left: 0,
            behavior: 'smooth',
          });
        }, 10);
      }
    );
    this.otkaziTerapeutaSubscription =
      this.klijentService.otkaziTerapeutaSubject.subscribe((subData) => {
        this.obrisiTerapeutaFront(subData);
      });
    this.UcitajTerapeuteKlijenta();
  }

  obrisiTerapeutaFront(idTerapeuta: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.terapeuti.length && !found; i++) {
      if (this.terapeuti[i].getId() === idTerapeuta) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.terapeuti.splice(index, 1);
    }
  }

  UcitajTerapeuteKlijenta() {
    this.isLoading = true;
    this.subscription = this.http
      .get<any>(
        'http://localhost:3000/klijenti/' +
          this.klijentService.getKlijentID() +
          '/terapeutiInfo'
      )
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            return new TerapeutClientCard(
              responseEl.id,
              responseEl.ime,
              responseEl.prezime,
              responseEl.email,
              responseEl.telefon,
              responseEl.specijalizacija,
              responseEl.slika
            );
          });
        })
      )
      .subscribe((modifiedData) => {
        this.terapeuti = modifiedData;
        this.isLoading = false;
      });
  }

  ugasiOcene() {
    this.oceniClicked = false;
    setTimeout(() => {
      window.scrollTo({
        top: -window.innerHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 10);
  }

  onNoTerapeutiClicked() {
    this.router.navigateByUrl('/klijent/terapeuti');
  }

  ngOnDestroy() {
    if (this.recenzijaSubscripiton) {
      this.recenzijaSubscripiton.unsubscribe();
    }
    if (this.otkaziTerapeutaSubscription) {
      this.otkaziTerapeutaSubscription.unsubscribe();
    }
  }
}
