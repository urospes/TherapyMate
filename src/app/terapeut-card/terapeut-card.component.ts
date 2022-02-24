import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KlijentService } from '../services/klijent.service';
import { TerapeutClientCard } from '../shared/terapeut-client-info';
import { MatDialog } from '@angular/material/dialog';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-terapeut-card',
  templateUrl: './terapeut-card.component.html',
  styleUrls: ['./terapeut-card.component.css'],
})
export class TerapeutCardComponent implements OnInit {
  @Input() terapeut: TerapeutClientCard;
  porukaOtkazivanje: string = null;

  constructor(
    private router: Router,
    private klijentService: KlijentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onCardClicked(event: Event) {
    if ((event.target as Element).id === 'akcija') {
    } else {
      this.router.navigateByUrl('klijent/terapeuti/' + this.terapeut.getId());
    }
  }

  onOtkaziClicked() {
    let dialogRef = this.dialog.open(UpozorenjeDialogComponent, {
      data: {
        pitanje: `Da li ste sigurni da želite da otkažete saradnju?`,
        potvrdna: 'Otkaži',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this.klijentService
          .otkaziSaradnjuSaTerapeutom(this.terapeut.getId())
          .subscribe(
            (responseText) => {
              if (responseText.status === 200) {
                this.porukaOtkazivanje = 'Uspesno ste otkazali saradnju';
                setTimeout(() => {
                  this.porukaOtkazivanje = null;
                  this.klijentService.otkaziTerapeutaSubject.next(
                    this.terapeut.getId()
                  );
                  //window.location.reload();
                }, 2000);
              }
            },
            (error) => {
              this.porukaOtkazivanje = error;
              setTimeout(() => {
                this.porukaOtkazivanje = null;
              }, 2000);
            }
          );
      }
    });
  }

  onOceniClicked() {
    this.klijentService.recenzijaSubject.next({
      id: this.terapeut.getId(),
      ime: this.terapeut.getIme(),
      prezime: this.terapeut.getPrezime(),
    });
  }
}
