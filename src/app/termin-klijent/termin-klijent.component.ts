import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TerminiService } from '../services/termini.service';
import { TerminInfo } from '../shared/terminInfo.model';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-termin-klijent',
  templateUrl: './termin-klijent.component.html',
  styleUrls: ['./termin-klijent.component.css'],
})
export class TerminKlijentComponent implements OnInit {
  @Input() termin: TerminInfo;
  @Input() basicView: boolean = false;
  @Input() kliknuto: boolean = false;
  @Input() terminZaPromenu: boolean = false;
  istekao: boolean;
  poruka: string = null;

  constructor(
    private http: HttpClient,
    private terminiSevice: TerminiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const datum: Date = new Date(this.termin.getDatumDate());
    datum.setDate(datum.getDate() - 1);
    this.istekao = datum <= new Date();
  }


  odrediBoju() {
    if (this.termin.getPotvrdjen()) {
      return 'zeleno';
    } else {
      return 'zuto';
    }
  }

  potvrdjenClass() {
    if (this.termin.getPotvrdjen()) {
      return 'potvrdjen';
    } else {
      return 'nepotvrdjen';
    }
  }

  isPotvrdjen() {
    if (this.termin.getPotvrdjen()) {
      return 'Potvrđen.';
    } else {
      return 'Termin jos uvek nije potvrđen.';
    }
  }

  onOtkaziTermin() {
    let dialogRef = this.dialog.open(UpozorenjeDialogComponent, {
      data: {
        pitanje: `Da li ste sigurni da želite da otkažete termin?`,
        potvrdna: 'Otkaži',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this.http
          .patch(
            'http://localhost:3000/termini/otkazivanje',
            {
              idTermina: this.termin.getID(),
              otkazuje: 'klijent',
            },
            { responseType: 'text' }
          )
          .subscribe(
            (resText) => {
              this.terminiSevice.otkazivanjeSubject.next(this.termin.getID());
            },
            (error) => {
              this.showError(error);
            }
          );
      }
    });
  }

  private showError(poruka: string) {
    this.poruka = poruka;
    setTimeout(() => {
      this.poruka = null;
    }, 2000);
  }

  onTerminZaZakazivanjeClicked() {
    this.kliknuto = !this.kliknuto;
    if (this.kliknuto) {
      this.terminiSevice.zakazivanjeSubject.next({
        idTermina: this.termin.getID(),
        promena: this.terminZaPromenu,
      });
    } else {
      this.terminiSevice.zakazivanjeSubject.next({
        idTermina: null,
        promena: this.terminZaPromenu,
      });
    }
  }

  onPromeniTerminClicked() {
    this.terminiSevice.promenaSubject.next(this.termin);
  }
}
