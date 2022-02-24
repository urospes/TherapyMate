import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KlijentService } from '../services/klijent.service';
import { TerapeutService } from '../services/terapeut.service';
import { TerapijeService } from '../services/terapije.service';
import { TerapijaBasic } from '../shared/terapija-basic.model';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-terapija-basic-item',
  templateUrl: './terapija-basic-item.component.html',
  styleUrls: ['./terapija-basic-item.component.css'],
})
export class TerapijaBasicItemComponent implements OnInit {
  @Input() terapija: TerapijaBasic;
  pretplacen: boolean;
  poruka: string = null;

  constructor(
    private klijentService: KlijentService,
    private terapijeService: TerapijeService,
    private router: Router,
    private dialog : MatDialog,
    private terapeutService: TerapeutService
  ) {}

  ngOnInit(): void {
    if (
      this.terapija.getOdradjenoTerapija() !== -1 &&
      this.terapija.getUkupnoTerapija() !== -1
    ) {
      this.pretplacen = true;
    } else {
      this.pretplacen = false;
    }
  }

  odrediProgres() {
    if (this.pretplacen) {
      return (
        (this.terapija.getOdradjenoTerapija() /
          this.terapija.getUkupnoTerapija()) *
        100
      );
    } else return 0;
  }

  onIzaberiTerapiju() {
    if(this.terapeutService.getTerapeutID()){
      this.router.navigate(['/home']);
      return;
    }
    if (!this.klijentService.getKlijentID()) {
      this.router.navigate(['prijavljivanje']);
      return;
    }
    this.klijentService.DodajTerapijuKlijentu(this.terapija.getId()).subscribe(
      (subData) => {
        this.poruka = 'Uspesno ste izabrali terapiju!';
        this.terapijeService.pretplataTerapijeSub.next(this.terapija.getId());
        setTimeout(() => {
          this.poruka = null;
        }, 2000);
        this.pretplacen = true;
      },
      (error) => {
        this.poruka = error;
        setTimeout(() => {
          this.poruka = null;
        }, 2000);
      }
    );
  }

  onOtkaziTerapiju() {
    if (!this.klijentService.getKlijentID()) {
      this.router.navigate(['prijavljivanje']);
      return;
    }
    let dialogRef=this.dialog.open(UpozorenjeDialogComponent,
      { data :
        { pitanje : `Da li ste sigurni da želite da otkažete terapiju?`,
        potvrdna : 'Otkaži'}
      });
dialogRef.afterClosed().subscribe(result => {
  if( result=='true')
  {

    this.klijentService.ObrisiTerapijuKlijentu(this.terapija.getId()).subscribe(
      (subData) => {
        this.poruka = 'Uspesno otkazivanje terapije!';
        this.terapijeService.pretplataTerapijeSub.next(this.terapija.getId());
        setTimeout(() => {
          this.poruka = null;
        }, 2000);
        this.pretplacen = false;
      },
      (error) => {
        this.poruka = error;
        setTimeout(() => {
          this.poruka = null;
        }, 2000);
      }
    );
  }
}
  );
  }
}
