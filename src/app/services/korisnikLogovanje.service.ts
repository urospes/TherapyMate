import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggedKorisnik } from '../shared/logged-korisnik.model';
import { AuthService } from './auth.service';
import { KlijentService } from './klijent.service';
import { TerapeutService } from './terapeut.service';
import { Role } from './../shared/role.model';
import { SavetovalisteService } from './savetovaliste.service';

@Injectable({ providedIn: 'root' })
export class KorisnikLogovanjeService {
  loggedKorisnik: BehaviorSubject<LoggedKorisnik> =
    new BehaviorSubject<LoggedKorisnik>(null);

  private tokenExpTimer: any;

  constructor(
    private savetovalisteService: SavetovalisteService,
    private klijentService: KlijentService,
    private terapeutService: TerapeutService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ulogujKorisnika(emailK: string, passwordK: string) {
    return this.http
      .post<{
        token: string;
        korisnikId: string;
        tipKorisnika: string;
        trajanjeTokena: number;
      }>('http://localhost:3000/korisnici/prijavljivanje', {
        email: emailK,
        lozinka: passwordK,
      })
      .pipe(
        catchError(this.errorHandling),
        tap((loggingData) => {
          if (
            loggingData.korisnikId !== null &&
            loggingData.tipKorisnika !== null &&
            loggingData.token !== null
          ) {
            let datum: Date = new Date(
              new Date().getTime() + loggingData.trajanjeTokena * 60 * 1000
            );
            const loggedUser: LoggedKorisnik = new LoggedKorisnik(
              loggingData.korisnikId,
              loggingData.tipKorisnika,
              loggingData.token,
              datum
            );
            if (loggingData.tipKorisnika === 'klijent') {
              this.authService.login(Role.Klijent);
              this.klijentService.setKlijentID(loggingData.korisnikId);
            } else if (loggingData.tipKorisnika === 'terapeut') {
              this.authService.login(Role.Terapeut);
              this.terapeutService.setTerapeutID(loggingData.korisnikId);
            } else {
              this.authService.login(Role.Admin);
              this.savetovalisteService.setID(loggingData.korisnikId);
            }
            this.loggedKorisnik.next(loggedUser);
            //stringify metoda poremeti datum
            localStorage.setItem('korisnik', JSON.stringify(loggedUser));
            this.autoLogout(loggingData.trajanjeTokena * 60 * 1000);
            this.router.navigateByUrl(loggedUser.id + '/profil');
          }
        })
      );
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('terapeut');
    this.klijentService.setKlijentID(null);
    this.terapeutService.setTerapeutID(null);
    this.savetovalisteService.setID(null);
    this.loggedKorisnik.next(null);
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    localStorage.removeItem('korisnik');
    this.tokenExpTimer = null;
    this.router.navigate(['/home']);
  }

  autoLogout(duration: number) {
    this.tokenExpTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  autoLoginKlorisnik() {
    const korisnikData: {
      id: string;
      tip: string;
      _token: string;
      _tokenExpiration: Date;
    } = JSON.parse(localStorage.getItem('korisnik'));

    if (!korisnikData) {
      return;
    }
    const korisnik: LoggedKorisnik = new LoggedKorisnik(
      korisnikData.id,
      korisnikData.tip,
      korisnikData._token,
      korisnikData._tokenExpiration
    );
    if (korisnik.tip === 'klijent') {
      this.klijentService.setKlijentID(korisnik.id);
    } else if (korisnik.tip === 'terapeut') {
      this.terapeutService.setTerapeutID(korisnik.id);
    } else {
      this.savetovalisteService.setID(korisnik.id);
    }
    this.loggedKorisnik.next(korisnik);
    if (korisnik.token) {
      this.autoLogout(
        new Date(korisnikData._tokenExpiration).getTime() - new Date().getTime()
      );
    }
  }

  private errorHandling(error: HttpErrorResponse) {
    let errorMessage: string = 'Doslo je do greske!';
    if (error.error === 'Greska pri logovanju')
      errorMessage =
        'Greska prilokom logovanja! Proverite da li ste uneli ispravne informacije.';
    else if (error.error === 'Nalog nije odobren') {
      errorMessage = 'Vas nalog jos uvek nije odobren. Pokusajte kasnije.';
    }
    return throwError(errorMessage);
  }
}
