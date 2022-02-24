import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KlijentService } from '../services/klijent.service';
import { TipTerapijaService } from '../services/tipTerapija.service';
import { TerapeutPageInfo } from '../shared/terapeutPageInfo.model';
import { Subscription, throwError } from 'rxjs';
import { Recenzija } from '../shared/recenzija.model';
import { TerapijeService } from '../services/terapije.service';
import { map, take } from 'rxjs/operators';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TerapeutService } from '../services/terapeut.service';

@Component({
  selector: 'app-terapeut-page',
  templateUrl: './terapeut-page.component.html',
  styleUrls: ['./terapeut-page.component.css'],
})
export class TerapeutPageComponent implements OnInit, OnDestroy {
  terapeut: TerapeutPageInfo; //terapeut cija se stranica prikazuje
  recenzije: Recenzija[] = [];

  vecPretplacen: boolean;
  pretplataChecked: boolean = false;
  pretplataUspesna: boolean = false;
  otkazivanjeUspesno: boolean = false;
  isLogged: boolean;
  isLoading: boolean = false;
  terapijeLoading: boolean = false;
  porukaOtkazivanje: string;

  pretplataSub: Subscription;
  otkazivanjeSub: Subscription;
  prvaTerapijaSub: Subscription;

  constructor(
    private klijentService: KlijentService,
    public terapijaService: TipTerapijaService,
    private terapeutService: TerapeutService,
    private terServis: TerapijeService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {} //ovu stranicu moze da vidi ulogovani klijent
  //zato koristimo KlijentService

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.UcitajTerapeuta(params['id']);
    });
    this.prvaTerapijaSub = this.terServis.pretplataTerapijeSub
      .pipe(take(1))
      .subscribe((subData) => {
        if (!this.vecPretplacen) {
          this.vecPretplacen = true;
        }
      });
    if (this.klijentService.getKlijentID()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  proveriPretplatu(): void {
    if (!this.klijentService.getKlijentID()) {
      this.vecPretplacen = false;
      this.pretplataChecked = true;
      return;
    }

    this.http
      .get<any>(
        'http://localhost:3000/klijenti/' +
          this.klijentService.getKlijentID() +
          '/terapeuti'
      )
      .subscribe(
        (responseData) => {
          for (let el of responseData) {
            if (el === this.terapeut.getId()) {
              this.vecPretplacen = true;
              this.pretplataChecked = true;
              return;
            }
            this.vecPretplacen = false;
            this.pretplataChecked = true;
          }
          this.pretplataChecked = true;
        },
        (err) => {
          console.log('Doslo je do greske pri ucitavanju!');
        }
      );
  }

  onZakazivanjeClicked() {
    this.router.navigateByUrl('/klijent/upravljanjeTerminima');
  }

  onPretplataClicked() {
    if(this.terapeutService.getTerapeutID()){
      this.router.navigate(['/home']);
      return;
    }
    if (!this.klijentService.getKlijentID()) {
      this.router.navigate(['/prijavljivanje']);
      return;
    }

    this.pretplataSub = this.klijentService
      .dodajTerapeutaKlijentu(this.terapeut.getId())
      .subscribe(
        () => {
          this.pretplataUspesna = true;
          this.vecPretplacen = true;
          setTimeout(() => {
            this.pretplataUspesna = false;
          }, 2000);
        },
        (error) => {
          this.porukaOtkazivanje = error;
          setTimeout(() => {
            this.porukaOtkazivanje = null;
          }, 2000);
        }
      );
  }

  onOtkaziClicked() {
    if (!this.klijentService.getKlijentID()) {
      this.router.navigate(['prijavljivanje']);
      return;
    }
    let dialogRef = this.dialog.open(UpozorenjeDialogComponent, {
      data: {
        pitanje: `Da li ste sigurni da želite da otkažete terapiju?`,
        potvrdna: 'Otkaži',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this.otkazivanjeSub = this.klijentService
          .otkaziSaradnjuSaTerapeutom(this.terapeut.getId())
          .subscribe(
            (responseText) => {
              if (responseText.status === 200) {
                this.porukaOtkazivanje = 'Uspesno ste otkazali saradnju';
                this.vecPretplacen = false;
                setTimeout(() => {
                  this.porukaOtkazivanje = null;
                  window.location.reload();
                }, 2000);
              }
            },
            (err) => {
              this.porukaOtkazivanje = err;
              setTimeout(() => {
                this.porukaOtkazivanje = null;
              }, 2500);
            }
          );
      }
    });
  }

  HandleErrors(error: HttpErrorResponse) {
    return throwError(error);
  }

  UcitajTerapeuta(id: string) {
    this.isLoading = true;
    this.http
      .get<any>('http://localhost:3000/terapeuti/' + id + '/terapije')
      .pipe(
        map((responseData) => {
          return new TerapeutPageInfo(
            id,
            responseData.ime,
            responseData.prezime,
            responseData.email,
            responseData.telefon,
            responseData.specijalizacija,
            responseData.opis,
            responseData.slika,
            []
          );
        })
      )
      .subscribe((modifiedData) => {
        this.terapeut = modifiedData;
        //jos 2 GET req
        this.proveriPretplatu();
        let idK: string = 'neulogovan';
        if (this.klijentService.getKlijentID()) {
          idK = this.klijentService.getKlijentID();
        }
        this.ucitajTerapijeKodKlijenta(this.terapeut.getId(), idK);
        this.ucitajRecenzije(this.terapeut.getId());
        this.isLoading = false;
      });
  }

  ucitajTerapijeKodKlijenta(idTerapeut: string, idKlijent: string) {
    this.terapijeLoading = true;
    this.klijentService
      .ucitajTerapijeKodTerapeuta(idTerapeut, idKlijent)
      .subscribe(
        (subData) => {
          this.terapeut.setTerapije(subData);
          this.terapijeLoading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ucitajRecenzije(idTerapeuta: string) {
    this.http
      .get<any>('http://localhost:3000/recenzije/' + idTerapeuta)
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            return new Recenzija(
              responseEl._id,
              responseEl.ocena,
              responseEl.komentar,
              responseEl.terapeut,
              responseEl.klijent._id
            );
          });
        })
      )
      .subscribe(
        (modifiedData) => {
          this.recenzije = modifiedData;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    if (this.otkazivanjeSub) this.otkazivanjeSub.unsubscribe();
    if (this.pretplataSub) this.pretplataSub.unsubscribe();
    if (this.prvaTerapijaSub) this.prvaTerapijaSub.unsubscribe();
  }
}
