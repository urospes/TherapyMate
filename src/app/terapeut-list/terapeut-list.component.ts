import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TerapeutCardInfo } from '../shared/terapeutCardInfo.model';
import { map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-terapeut-list',
  templateUrl: './terapeut-list.component.html',
  styleUrls: ['./terapeut-list.component.css'],
})
export class TerapeutListComponent implements OnInit, OnDestroy {
  private terapeuti: TerapeutCardInfo[] = []; //lista terapeuta koja se prikazuje klijentima
  //prikazuju se svi terapeuti(moze i samo oni koji nisu trenutno izabrani)
  private subscription: Subscription;
  isLoading: boolean = false;
  form: FormGroup;
  pretrazeno: boolean = false;
  nemaTerapeuta: boolean = false;
  private sviTerapeutiKopija: TerapeutCardInfo[] = [];

  constructor(
    private http: HttpClient,
    private klijentService: KlijentService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({ pretraga: new FormControl('') });
    this.ucitajSveTerapeute();
  }

  onSortChanged(event) {
    if (event.value == 'ime') {
      this.sortirajPoImenu();
      return;
    }
    if (event.value == 'ocena') {
      this.sortirajPoOceni();
      return;
    }
  }

  getTerpeuti() {
    return this.terapeuti.slice();
  }

  onPretragaClicked() {
    let temp: string = this.form.value.pretraga;
    this.nemaTerapeuta = false;

    if (!temp) {
      this.pretrazeno = false;
      this.terapeuti = this.sviTerapeutiKopija.slice();
      //window.location.reload();
      return;
    }

    if (!this.pretrazeno) {
      this.sviTerapeutiKopija = this.terapeuti.slice();
    }
    let rezultatiPretrage: TerapeutCardInfo[] = this.sviTerapeutiKopija.slice();
    this.pretrazeno = true;

    let tempArr: string[] = [];
    let tempArr2: string[] = [];
    temp = temp.trim();
    tempArr = temp.split(' ');
    for (let i = 0; i < tempArr.length; i++) {
      tempArr2.push(tempArr[i].charAt(0).toUpperCase() + tempArr[i].slice(1));
    }
    tempArr = tempArr.concat(tempArr2);
  //  console.log(tempArr);
    for (let i = 0; i < rezultatiPretrage.length; i++) {
      let count: number = 0;
      for (let j = 0; j < tempArr.length; j++) {
        if (
          !rezultatiPretrage[i].getIme().includes(tempArr[j]) &&
          !rezultatiPretrage[i].getPrezime().includes(tempArr[j])
        ) {
          count++;
          if (count === tempArr.length) {
            rezultatiPretrage.splice(i, 1);
            i--;
          }
        }
      }
    }
    if (rezultatiPretrage.length === 0) {
      this.nemaTerapeuta = true;
    } else {
      this.nemaTerapeuta = false;
    }
    this.terapeuti = rezultatiPretrage.slice();
  }

  ucitajSveTerapeute() {
    this.isLoading = true;
    this.subscription = this.http
      .get<any>('http://localhost:3000/terapeuti/osnovneInfo')
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            const nazivi: string[] = [];
            for (let tip of responseEl.tipoviTerapija) {
              nazivi.push(tip.naziv);
            }
            return new TerapeutCardInfo(
              responseEl.id,
              responseEl.ime,
              responseEl.prezime,
              responseEl.brTerapija,
              responseEl.brKlijenata,
              responseEl.ocena,
              responseEl.slika,
              nazivi
            );
          });
        })
      )
      .subscribe((terapeutiList) => {
        this.terapeuti = terapeutiList;
        this.isLoading = false;
      });
  }

  sortirajPoOceni() {
    for (let i = 0; i < this.terapeuti.length - 1; i++) {
      for (let j = i + 1; j < this.terapeuti.length; j++) {
        if (this.terapeuti[i].getOcena() < this.terapeuti[j].getOcena()) {
          const temp = this.terapeuti[i];
          this.terapeuti[i] = this.terapeuti[j];
          this.terapeuti[j] = temp;
        }
      }
    }
  }

  sortirajPoImenu() {
    for (let i = 0; i < this.terapeuti.length - 1; i++) {
      for (let j = i + 1; j < this.terapeuti.length; j++) {
        if (
          this.terapeuti[i].getIme() + this.terapeuti[i].getPrezime() >
          this.terapeuti[j].getIme() + this.terapeuti[j].getPrezime()
        ) {
          const temp: TerapeutCardInfo = this.terapeuti[i];
          this.terapeuti[i] = this.terapeuti[j];
          this.terapeuti[j] = temp;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
