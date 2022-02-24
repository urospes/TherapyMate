import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { TerapeutService } from '../services/terapeut.service';
import { SavetovalisteInfo } from '../shared/savetovalisteInfo';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  savetovaliste: SavetovalisteInfo;
  isLoading: boolean = false;

  constructor(private router: Router, private http: HttpClient,
    private klijentService:KlijentService, private terapeutService: TerapeutService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http
      .get<any>('http://localhost:3000/savetovaliste')
      .pipe(
        map((responseData) => {
          return new SavetovalisteInfo(
            responseData.ime,
            responseData.adresa,
            responseData.email,
            responseData.opis,
            responseData.telefon
          );
        })
      )
      .subscribe(
        (modifiedData) => {
          this.savetovaliste = modifiedData;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onTerapeuti() {
    this.router.navigate(['/terapeuti']);
  }
  onTerapije() {
    this.router.navigate(['/terapije']);
  }
  onRegistracija() {
    if(this.klijentService.getKlijentID()){
      this.router.navigate(['/' + this.klijentService.getKlijentID() + '/profil']);
      return;
    }
    if(this.terapeutService.getTerapeutID()){
      this.router.navigate(['/terapeut/licniprofil']);
      return;
    }
    this.router.navigate(['/registracija']);
  }
}
