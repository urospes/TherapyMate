import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';

@Component({
  selector: 'app-klijent-navbar',
  templateUrl: './klijent-navbar.component.html',
  styleUrls: ['./klijent-navbar.component.css'],
})
export class KlijentNavbarComponent implements OnInit, OnDestroy {
  klijentUlogovan: boolean = false;
  terapeutUlogovan: boolean = false;
  adminUlogovan : boolean=false;
  private loggedSubscription: Subscription;
  private idKorisnika: string;

  constructor(private korisnikService: KorisnikLogovanjeService) {}

  ngOnInit(): void {
    this.loggedSubscription = this.korisnikService.loggedKorisnik.subscribe(
      (korisnik) => {
        if (korisnik) {
          if (korisnik.tip === 'klijent') {
            this.klijentUlogovan = true;
            this.terapeutUlogovan = false;
            this.adminUlogovan=false;
          } else if (korisnik.tip==='terapeut'){
            this.klijentUlogovan = false;
            this.terapeutUlogovan = true;
            this.adminUlogovan=false;
          } else {
            this.klijentUlogovan = false;
          this.terapeutUlogovan = false;
          this.adminUlogovan=true;
          }
          this.idKorisnika = korisnik.id;
        } else {
          this.klijentUlogovan = false;
          this.terapeutUlogovan = false;
          this.adminUlogovan=false;
        }
      }
    );
  }

  odjaviKorisnika() {
    this.korisnikService.logout();
  }

  ngOnDestroy(): void {
    this.loggedSubscription.unsubscribe();
  }
}
