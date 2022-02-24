import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { TerminiService } from '../services/termini.service';
import { TerminInfo } from '../shared/terminInfo.model';
import { ZakazivanjeInfo } from '../shared/zakazivanjeInfo.model';

@Component({
  selector: 'app-zakazivanje-page',
  templateUrl: './zakazivanje-page.component.html',
  styleUrls: ['./zakazivanje-page.component.css'],
})
export class ZakazivanjePageComponent implements OnInit, OnDestroy {
  obavestenja: string[] = [];
  zakazaniTermini: TerminInfo[] = [];
  terapeutiTerapije: ZakazivanjeInfo[] = [];
  slobodniTermini: TerminInfo[] = [];
  kliknutiSlobodni: boolean[] = [];
  kliknutiPromena: boolean[] = [];
  terminiPromena: TerminInfo[] = [];

  idSelektovanogTerapeuta: string;
  idSelektovaneTerapije: string;
  terapijeTerapeuta: { idTerapije: string; nazivTipa: string }[] = [];
  idTermina: string;
  idTerminaZaPromenu: string;
  terminKojiSeMenja: TerminInfo;

  isLoading: boolean = false;
  terminiLoading: boolean = false;
  porukaNeuspesno: string = null;
  porukaGreska: string = null;
  porukaZakazivanje: string = null;
  promenaClicked: boolean = false;
  promenaTerminiLoading: boolean = false;

  obavestenjeSub: Subscription;
  otkazivanjeSub: Subscription;
  zakazivanjeSub: Subscription;
  promenaSubject: Subscription;
  zakazivanjeClicked: boolean = false;
  zakazivanjeLoading: boolean = false;

  constructor(
    private klijentService: KlijentService,
    private http: HttpClient,
    private terminiService: TerminiService
  ) {}

  ngOnInit(): void {
    this.ucitajZakazaneTermine();
    this.otkazivanjeSub = this.terminiService.otkazivanjeSubject.subscribe(
      (idTermina) => {
        this.obrisiTerminFront(idTermina);
      }
    );
    this.terminiService.zakazivanjeSubject.subscribe((subData) => {
      if (subData.promena) {
        this.idTerminaZaPromenu = subData.idTermina;
      } else {
        this.idTermina = subData.idTermina;
      }
    });
    this.promenaSubject = this.terminiService.promenaSubject.subscribe(
      (subData) => {
        this.promenaTerminiLoading = true;
        this.terminKojiSeMenja = subData;
        this.UcitajTermineTerapeuta(subData.getIDTerapeuta()).subscribe(
          (responseData) => {
            this.terminiPromena = responseData;
            for (let i = 0; i < responseData.length; i++) {
              this.kliknutiPromena.push(false);
            }
            this.promenaClicked = true;
            this.promenaTerminiLoading = false;
            this.sort(this.terminiPromena, this.terminiPromena.length);
          }
        ),
          (error) => {
            this.porukaGreska = error;
            setTimeout(() => {
              this.porukaGreska = null;
            }, 2000);
          };
      }
    );
  }

  UcitajTermineTerapeuta(idTerapeuta: string) {
    return this.http
      .get<any>(
        'http://localhost:3000/termini/terapeut/slobodni/' + idTerapeuta
      )
      .pipe(
        catchError(this.handleError),
        map((responseData) => {
          return responseData.map((responseEl) => {
            return new TerminInfo(
              responseEl._id,
              responseEl.datum,
              responseEl.vreme,
              responseEl.trajanje,
              responseEl.potvrdjen,
              null,
              null,
              null,
              null,
              null,
              null
            );
          });
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    if (error.error) {
      return throwError(error.error);
    } else {
      return throwError('Doslo je do neočekivane greške, pokušajte ponovo.');
    }
  }

  private showZakazivanje(poruka: string) {
    this.porukaZakazivanje = poruka;
    setTimeout(() => {
      this.porukaZakazivanje = null;
    }, 2000);
  }

  zakaziTermin() {
    if (!this.idSelektovanogTerapeuta) {
      this.showZakazivanje(
        'Molimo vas izaberite terapeuta kod koga zelite da idete na seansu!'
      );
      return;
    }
    if (!this.idSelektovaneTerapije) {
      this.showZakazivanje(
        'Molimo vas izaberite terapiju koju zelite da zakazete!'
      );
      return;
    }
    if (!this.idTermina) {
      this.showZakazivanje('Molimo vas izaberite termin!');
      return;
    }
    this.klijentService
      .zakaziTerminKlijenta(this.idSelektovaneTerapije, this.idTermina)
      .subscribe(
        (resText) => {
          window.location.reload();
        },
        (error) => {
          this.showZakazivanje(error);
        }
      );
  }

  promeniTermin() {
    if (!this.idTerminaZaPromenu || !this.terminKojiSeMenja) {
      this.showNeuspesno('Niste izabrali novi termin.');
      return;
    }
    this.klijentService
      .promeniTermin(this.terminKojiSeMenja.getID(), this.idTerminaZaPromenu)
      .subscribe(
        (resText) => {
          window.location.reload();
        },
        (error) => {
          this.showNeuspesno(error);
        }
      );
  }

  showNeuspesno(poruka: string) {
    this.porukaGreska = poruka;
    setTimeout(() => {
      this.porukaGreska = null;
    }, 2000);
  }

  onTerapijaChanged(event) {
    this.idSelektovaneTerapije = event.value;
  }

  onSlobodanClicked(pos: number) {
    if (!this.kliknutiSlobodni) {
      return;
    }
    for (let i = 0; i < this.kliknutiSlobodni.length; i++) {
      if (this.kliknutiSlobodni[i] === true && i !== pos) {
        this.kliknutiSlobodni[i] = false;
      } else if (i === pos) {
        //this.kliknutiSlobodni[i] = true;
        this.kliknutiSlobodni[i] = !this.kliknutiSlobodni[i];
      }
    }
  }

  onPromenjenClicked(pos: number) {
    if (!this.kliknutiPromena) {
      return;
    }
    for (let i = 0; i < this.kliknutiPromena.length; i++) {
      if (this.kliknutiPromena[i] === true && i !== pos) {
        this.kliknutiPromena[i] = false;
      } else if (i === pos) {
        //this.kliknutiPromena[i] = true;
        this.kliknutiPromena[i] = !this.kliknutiPromena[i];
      }
    }
  }

  onTerapeutChanged(event) {
    this.idSelektovanogTerapeuta = event.value;
    let found: boolean = false;
    for (let i = 0; i < this.terapeutiTerapije.length && !found; i++) {
      if (
        this.terapeutiTerapije[i].getIDTerapeuta() ===
        this.idSelektovanogTerapeuta
      ) {
        this.terapijeTerapeuta = this.terapeutiTerapije[i].getTerapije();
        found = true;
      }
    }
    //ucitavamo termine terapeuta
    this.terminiLoading = true;
    this.UcitajTermineTerapeuta(this.idSelektovanogTerapeuta).subscribe(
      (modifiedData) => {
        this.slobodniTermini = modifiedData;
        //sortiranje
        this.sort(this.slobodniTermini, this.slobodniTermini.length);
        //sortirano

        for (let i = 0; i < modifiedData.length; i++) {
          this.kliknutiSlobodni.push(false);
        }
        this.slobodniTermini = modifiedData;
        this.terminiLoading = false;
      }
    );
  }

  obrisiTerminFront(id: string) {
    let index: number = -1;
    let found: boolean = false;
    for (let i = 0; i < this.zakazaniTermini.length && !found; i++) {
      if (this.zakazaniTermini[i].getID() === id) {
        index = i;
        found = true;
      }
    }
    if (index !== -1) {
      this.zakazaniTermini.splice(index, 1);
    }
  }

  ucitajZakazaneTermine() {
    this.isLoading = true;
    this.http
      .get<any>(
        'http://localhost:3000/termini/klijent/' +
          this.klijentService.getKlijentID()
      )
      .pipe(
        map((responseData) => {
          return {
            termini: responseData.termini.map((responseEl) => {
              return new TerminInfo(
                responseEl._id,
                responseEl.datum,
                responseEl.vreme,
                responseEl.trajanje,
                responseEl.potvrdjen,
                responseEl.terapeut._id,
                responseEl.terapeut.ime,
                responseEl.terapeut.prezime,
                responseEl.terapeut.telefon,
                responseEl.terapija._id,
                responseEl.terapija.tip.naziv
              );
            }),
            infos: responseData.obavestenja,
          };
        })
      )
      .subscribe((modifiedData) => {
        this.obavestenja = modifiedData.infos;
        this.zakazaniTermini = modifiedData.termini;
        //sortiranje
        this.sort(this.zakazaniTermini, this.zakazaniTermini.length);
        //sortirano
        this.isLoading = false;
      });
  }

  onXClick(pos: number) {
    this.obavestenjeSub = this.klijentService
      .obrisiObavestenje(this.obavestenja[pos])
      .subscribe(
        (resText) => {
          this.obavestenja.splice(pos, 1);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  sort(termini: TerminInfo[], len: number) {
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        if (
          termini[i].getDatumDate() > termini[j].getDatumDate() ||
          (termini[i].getDatumDate() == termini[j].getDatumDate() &&
            termini[i].getVreme() > termini[j].getVreme())
        ) {
          const temp: TerminInfo = termini[i];
          termini[i] = termini[j];
          termini[j] = temp;
        }
      }
    }
  }

  onZakazivanjeClicked() {
    this.zakazivanjeClicked = true;
    this.zakazivanjeLoading = true;
    this.http
      .get<any>(
        'http://localhost:3000/klijenti/' +
          this.klijentService.getKlijentID() +
          '/terapeutiTerapije'
      )
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            return new ZakazivanjeInfo(
              responseEl.idTerapeuta,
              responseEl.ime,
              responseEl.prezime,
              responseEl.telefon,
              responseEl.terapije
            );
          });
        })
      )
      .subscribe(
        (modifiedData) => {
          this.terapeutiTerapije = modifiedData;
          this.zakazivanjeLoading = false;
        },
        (error) => {
          this.showNeuspesno(error);
        }
      );
  }

  ngOnDestroy() {
    if (this.obavestenjeSub) {
      this.obavestenjeSub.unsubscribe();
    }
    if (this.zakazivanjeSub) {
      this.zakazivanjeSub.unsubscribe();
    }
    if (this.promenaSubject) {
      this.promenaSubject.unsubscribe();
    }
  }
}
