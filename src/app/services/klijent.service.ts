import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Klijent } from '../shared/klijent.model';
import { TerapijaBasic } from '../shared/terapija-basic.model';

@Injectable({ providedIn: 'root' })
export class KlijentService {
  private id: string = null; //ID TRENUTNO ULOGOVANOG KLIJENTA
  recenzijaSubject: Subject<{ id: string; ime: string; prezime: string }> =
    new Subject<{ id: string; ime: string; prezime: string }>();
  otkaziTerapeutaSubject: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {}

  getKlijentID(): string {
    return this.id;
  }

  setKlijentID(idKlijenta: string) {
    this.id = idKlijenta;
  }

  dodajTerapeutaKlijentu(idTerapeuta: string) {
    return this.http
      .patch(
        'http://localhost:3000/klijenti/izborTerapeuta',
        {
          idKlijenta: this.id,
          idTerapeuta: idTerapeuta,
        },
        { responseType: 'text' }
      )
      .pipe(catchError(this.HandleError));
  }

  otkaziSaradnjuSaTerapeutom(idTerapeuta: string) {
    return this.http
      .patch(
        'http://localhost:3000/klijenti/otkazivanjeTerapeuta',
        {
          idKlijenta: this.id,
          idTerapeuta: idTerapeuta,
        },
        { responseType: 'text', observe: 'response' }
      )
      .pipe(catchError(this.HandleError));
  }

  oceniTerapeuta(idTerapeut: string, ocenaa: number, komentarr: string) {
    return this.http
      .post(
        'http://localhost:3000/recenzije',
        {
          idKlijenta: this.id,
          idTerapeuta: idTerapeut,
          ocena: ocenaa,
          komentar: komentarr,
        },
        { responseType: 'text', observe: 'response' }
      )
      .pipe(catchError(this.HandleError));
  }

  private HandleError(error: HttpErrorResponse) {
    if (error.error) {
      return throwError(error.error);
    }
    return throwError('Doslo je do greske. Pokusajte kasnije.');
  }

  DodajTerapijuKlijentu(idTerapije: string) {
    return this.http
      .patch(
        'http://localhost:3000/klijenti/izborTerapije',
        {
          idKlijenta: this.getKlijentID(),
          idTerapije: idTerapije,
        },
        { responseType: 'text', observe: 'response' }
      )
      .pipe(catchError(this.HandleError));
  }

  ObrisiTerapijuKlijentu(idTerapije: string) {
    return this.http
      .patch(
        'http://localhost:3000/klijenti/otkazivanjeTerapije',
        {
          idKlijenta: this.getKlijentID(),
          idTerapije: idTerapije,
        },
        { responseType: 'text', observe: 'response' }
      )
      .pipe(catchError(this.HandleError));
  }

  obrisiObavestenje(textObavestenja: string) {
    return this.http.patch(
      'http://localhost:3000/termini/klijent/brisanjeObavestenja',
      {
        idKlijenta: this.getKlijentID(),
        obavestenje: textObavestenja,
      },
      {
        responseType: 'text',
      }
    );
  }

  zakaziTerminKlijenta(idTerapije: string, idTermina: string) {
    return this.http
      .patch(
        'http://localhost:3000/termini/zakazivanje',
        {
          idKlijenta: this.getKlijentID(),
          idTerapije: idTerapije,
          idTermina: idTermina,
        },
        { responseType: 'text', observe: 'response' }
      )
      .pipe(catchError(this.HandleError));
  }

  ucitajTerapijeKodTerapeuta(idTerapeuta: string, idK: string) {
    return this.http
      .get<any>(
        'http://localhost:3000/terapeuti/' + idTerapeuta + '/terapije/' + idK
      )
      .pipe(
        map((responseData) => {
          return responseData.map((responseEl) => {
            if (responseEl.odradjeno != null && responseEl.ukupno != null) {
              return new TerapijaBasic(
                responseEl._id,
                responseEl.tip.naziv,
                responseEl.detalji,
                responseEl.cena,
                responseEl.odradjeno,
                responseEl.ukupno
              );
            } else {
              return new TerapijaBasic(
                responseEl._id,
                responseEl.tip.naziv,
                responseEl.detalji,
                responseEl.cena
              );
            }
          });
        })
      )
      .pipe(catchError(this.HandleError));
  }

  promeniTermin(idStarog: string, idNovog: string) {
    return this.http
      .patch(
        'http://localhost:3000/termini/promena',
        { idStarogTermina: idStarog, idNovogTermina: idNovog },
        { responseType: 'text', observe: 'response' }
      )
      .pipe(catchError(this.HandleError));
  }

  addKlijent(klijent: Klijent, file: File) {
    const formData: FormData = new FormData();

    formData.append('image', file);
    formData.append('ime', klijent.getIme());
    formData.append('prezime', klijent.getPrezime());
    formData.append('email', klijent.getEmail());
    formData.append('lozinka', klijent.getLoznika());
    formData.append('telefon', klijent.getTelefon());
    formData.append('slika', klijent.getSlika());
    return this.http.post(
      'http://localhost:3000/klijenti',
      // {
      //   // ime: klijent.getIme(),
      //   // prezime: klijent.getPrezime(),
      //   // email: klijent.getEmail(),
      //   // lozinka: klijent.getLoznika(),
      //   // telefon: klijent.getTelefon(),
      //   // slika: klijent.getSlika(),
      // },
      formData,
      { responseType: 'text' }
    );
  }
  fetchKlijent() {
    return this.http.get<any>(`http://localhost:3000/klijenti/${this.id}`);
  }
  updateKlijentinfo(klijent: Klijent, lozinka: string, image: File | string) {
    console.log('update klijent info');
    let formData: FormData = new FormData();
    if (typeof image === 'object') {
      formData.append('image', image);
      formData.append('ime', klijent.getIme());
      formData.append('prezime', klijent.getPrezime());
      formData.append('email', klijent.getEmail());
      formData.append('lozinka', klijent.getLoznika());
      formData.append('novaLozinka', lozinka);
      formData.append('telefon', klijent.getTelefon());
      formData.append('imagePath', klijent.getSlika());

      return this.http.put(
        `http://localhost:3000/klijenti/${this.id}`,
        formData,
        { responseType: 'text' }
      );
    } else {
      return this.http.put(`http://localhost:3000/klijenti/${this.id}`, {
        ime: klijent.getIme(),
        prezime: klijent.getPrezime(),
        telefon: klijent.getTelefon(),
        lozinka: klijent.getLoznika(),
        novaLozinka: lozinka,
        email: klijent.getEmail(),
        imagePath: klijent.getSlika(),
      });
    }
  }

  //sva logika oko logovanja je u korisnikLogovanje servisu

  logError(error) {
    console.log(error);
  }
}
