import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { KlijentProfil } from '../shared/klijentProfil.model';

@Component({
  selector: 'app-korisnik-profil',
  templateUrl: './korisnik-profil.component.html',
  styleUrls: ['./korisnik-profil.component.css'],
})
export class KorisnikProfilComponent implements OnInit {
  klijentProfilInfo: KlijentProfil;
  isLoading: boolean = false;

  constructor(
    private klijentService: KlijentService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.klijentService.getKlijentID() !== null) {
      this.UcitajKlijenta(this.klijentService.getKlijentID());
    }
  }

  UcitajKlijenta(idKlijenta: string) {
    this.isLoading = true;
    this.http
      .get<any>('http://localhost:3000/klijenti/profil/' + idKlijenta)
      .pipe(
        map((responseData) => {
          return new KlijentProfil(
            responseData.id,
            responseData.ime,
            responseData.prezime,
            responseData.email,
            responseData.telefon,
            responseData.slika,
            responseData.obavestenja,
            responseData.testovi
          );
        })
      )
      .subscribe(
        (modifiedData) => {
          this.klijentProfilInfo = modifiedData;
          this.isLoading = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onZakazivanjeClicked() {
    this.router.navigateByUrl('klijent/upravljanjeTerminima');
  }

  onTerapijeClicked() {
    this.router.navigate(['terapije'], { relativeTo: this.route });
  }

  onTestoviClicked() {
    this.router.navigateByUrl('klijent/testovi');
  }

  onTerapeutiClicked() {
    this.router.navigate(['terapeuti'], { relativeTo: this.route });
  }
  onIzmeniClick() {
    this.router.navigate(
      ['/klijent/izmeniprofil'] /*{ relativeTo: this.route }*/
    );
  }
}
