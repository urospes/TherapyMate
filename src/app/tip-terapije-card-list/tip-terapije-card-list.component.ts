import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { TerapijeService } from '../services/terapije.service';
import { TerapijaCardInfo } from '../shared/terapija-card.model';
import { TipTerapijeCard } from '../shared/tipTerapijeCard.model';

@Component({
  selector: 'app-tip-terapije-card-list',
  templateUrl: './tip-terapije-card-list.component.html',
  styleUrls: ['./tip-terapije-card-list.component.css'],
})
export class TipTerapijeCardListComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  tipListLoading: boolean = false;
  pretrazeno: boolean = false;
  tipovi: TipTerapijeCard[];
  tipoviKopija: TipTerapijeCard[] = [];
  terapijePoTipu: TerapijaCardInfo[];
  tipTerapijeSubscription: Subscription;
  tipNaslov: string;
  isClicked: boolean = false;
  nemaTerapija: boolean = false;
  cardClicked: boolean[] = [];
  form: FormGroup;

  constructor(
    private http: HttpClient,
    private terapijeService: TerapijeService,
    private klijentService: KlijentService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({ pretraga: new FormControl('') });
    this.UcitajTipoveTerapija();
    this.tipTerapijeSubscription =
      this.terapijeService.tipTerapijeClick.subscribe((subData) => {
        if (subData !== null) {
          this.UcitajTerapije(subData.id);
          this.isClicked = true;
          this.tipNaslov = subData.naziv;
        } else {
          this.isClicked = false;
          window.scrollTo(50, 0);
        }
      });
  }

  onKliknutiTip(pos: number) {
    for (let i = 0; i < this.cardClicked.length; i++) {
      if (i === pos) {
        this.cardClicked[i] = !this.cardClicked[i];
      } else {
        if (this.cardClicked[i] === true) {
          this.cardClicked[i] = false;
        }
      }
    }
  }

  onNaVrhClicked(){
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  UcitajTerapije(idTipa: string) {
    this.tipListLoading = true;
    const idK: string =
      this.klijentService.getKlijentID() != null
        ? this.klijentService.getKlijentID()
        : 'neulogovan';
    this.http
      .get<any>(
        'http://localhost:3000/tipoviTerapija/' +
          idTipa +
          '/listTerapija/' +
          idK
      )
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            if (!responseEl.ukupno && !responseEl.odradjeno) {
              return new TerapijaCardInfo(
                responseEl._id,
                responseEl.detalji,
                responseEl.cena,
                responseEl.tip.naziv,
                responseEl.terapeut.ime,
                responseEl.terapeut.prezime,
                responseEl.terapeut.specijalizacija,
                responseEl.terapeut._id
              );
            } else {
              return new TerapijaCardInfo(
                responseEl._id,
                responseEl.detalji,
                responseEl.cena,
                responseEl.tip.naziv,
                responseEl.terapeut.ime,
                responseEl.terapeut.prezime,
                responseEl.terapeut.specijalizacija,
                responseEl.terapeut._id,
                responseEl.ukupno,
                responseEl.odradjeno
              );
            }
          });
        })
      )
      .subscribe(
        (modifiedData) => {
          this.terapijePoTipu = modifiedData;
          /*setTimeout(() => {
            window.scrollTo({
              top: window.innerHeight * 3,
              left: 0,
              behavior: 'smooth',
            });
          }, 1);*/
          this.tipListLoading = false;
        },
        (error) => {
          console.log('Greska');
          console.log(error);
        }
      );
  }

  UcitajTipoveTerapija() {
    this.isLoading = true;
    this.http
      .get<{ _id: string; naziv: string; opis: string }[]>(
        'http://localhost:3000/tipoviTerapija'
      )
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            return new TipTerapijeCard(
              responseEl._id,
              responseEl.opis,
              responseEl.naziv
            );
          });
        })
      )
      .subscribe(
        (modifiedData) => {
          this.tipovi = modifiedData;
          for (let tip of this.tipovi) {
            this.cardClicked.push(false);
          }
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
  }

  onPretragaClicked() {
    let temp: string = this.form.value.pretraga;
    this.nemaTerapija = false;

    if (!temp) {
      this.pretrazeno = false;
      this.tipovi = this.tipoviKopija.slice();
      //window.location.reload();
      return;
    }

    if (!this.pretrazeno) {
      this.tipoviKopija = this.tipovi.slice();
    }
    let rezultatiPretrage: TipTerapijeCard[] = this.tipoviKopija.slice();
    this.pretrazeno = true;

    let tempArr: string[] = [];
    let tempArr2: string[] = [];
    temp = temp.trim();
    tempArr = temp.split(' ');
    for (let i = 0; i < tempArr.length; i++) {
      tempArr2.push(tempArr[i].charAt(0).toUpperCase() + tempArr[i].slice(1));
    }
    tempArr = tempArr.concat(tempArr2);
    for (let i = 0; i < rezultatiPretrage.length; i++) {
      let count: number = 0;
      for (let j = 0; j < tempArr.length; j++) {
        if (!rezultatiPretrage[i].getNaziv().includes(tempArr[j])) {
          count++;
          if (count === tempArr.length) {
            rezultatiPretrage.splice(i, 1);
            i--;
          }
        }
      }
    }
    if (rezultatiPretrage.length === 0) {
      this.nemaTerapija = true;
    } else {
      this.nemaTerapija = false;
    }
    this.tipovi = rezultatiPretrage.slice();
  }

  ngOnDestroy() {
    if (this.tipTerapijeSubscription) {
      this.tipTerapijeSubscription.unsubscribe();
    }
  }
}
