import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KlijentService } from '../services/klijent.service';
import { TerapeutService } from '../services/terapeut.service';
import { TerapijeService } from '../services/terapije.service';
import { TerapijaCardInfo } from '../shared/terapija-card.model';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-terapija-card-item',
  templateUrl: './terapija-card-item.component.html',
  styleUrls: ['./terapija-card-item.component.css'],
})
export class TerapijaCardItemComponent implements OnInit {
  @Input() terapija: TerapijaCardInfo;
  basicView: boolean;
  poruka: string = null;

  constructor(
    private router: Router,
    private klijentService: KlijentService,
    private terapijaService: TerapijeService,
    private dialog: MatDialog,
    private terapeutService: TerapeutService
  ) {}

  ngOnInit(): void {
    if (
      this.terapija.getOdradjenoTerapija() == null &&
      this.terapija.getUkupnoTerapija() == null
    ) {
      this.basicView = true;
    } else {
      this.basicView = false;
    }
  }

  onTerapeutNameClicked() {
    this.router.navigateByUrl('terapeuti/' + this.terapija.getTerapeutId());
  }

  odrediProgres() {
    return (
      (this.terapija.getOdradjenoTerapija() /
        this.terapija.getUkupnoTerapija()) *
      100
    );
  }

  onOtkaziTerapiju() {
    let dialogRef = this.dialog.open(UpozorenjeDialogComponent, {
      data: {
        pitanje: `Da li ste sigurni da želite da otkažete terapiju?`,
        potvrdna: 'Otkaži',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this.klijentService
          .ObrisiTerapijuKlijentu(this.terapija.getID())
          .subscribe(
            (resText) => {
              this.poruka = 'Uspesno ste otkazali terapiju!';
              setTimeout(() => {
                this.poruka = null;
                //window.location.reload();
                this.terapijaService.otkazivanjeTerapijeClick.next(
                  this.terapija.getID()
                );
                this.basicView = true;
              }, 2000);
            },
            (error) => {
              this.poruka = error;
              setTimeout(() => {
                this.poruka = null;
              }, 2000);
            }
          );
      }
    });
  }

  onIzaberiTerapiju() {
    if(this.terapeutService.getTerapeutID()){
      this.router.navigate(['/home']);
      return;
    }
    if (!this.klijentService.getKlijentID()) {
      this.router.navigate(['/prijavljivanje']);
      return;
    }

    this.klijentService.DodajTerapijuKlijentu(this.terapija.getID()).subscribe(
      (resText) => {
        this.poruka = 'Uspesno ste izabrali terapiju!';
        this.terapijaService.pretplataTerapijeSub.next(this.terapija.getID());
        this.basicView = false;
        setTimeout(() => {
          this.poruka = null;
          //window.location.reload();
          /*this.terapijaService.pretplataTerapijeSub.next(this.terapija.getID());
          this.basicView = false;*/
        }, 2500);
      },
      (error) => {
        this.poruka = error;
        setTimeout(() => {
          this.poruka = null;
        }, 2500);
      }
    );
  }
}
