import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TerapeutCardInfo } from '../shared/terapeutCardInfo.model';

@Component({
  selector: 'app-admin-recenzija-list',
  templateUrl: './admin-recenzija-list.component.html',
  styleUrls: ['./admin-recenzija-list.component.css'],
})
export class AdminRecenzijaListComponent implements OnInit {
  prazan: boolean = false;
  isLoading: boolean = false;
  terapeuti: TerapeutCardInfo[] = [];
  constructor(private http: HttpClient) {}
  success: string = '';
  error: string = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/terapeuti/osnovneInfo`).subscribe(
      (data) => {
        data.forEach((responseEl) => {
          this.terapeuti.push(
            new TerapeutCardInfo(
              responseEl.id,
              responseEl.ime,
              responseEl.prezime,
              responseEl.brTerapija,
              responseEl.brKlijenata,
              responseEl.ocena,
              responseEl.slika,
              []
            )
          );
          this.isLoading = false;
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onPrikaziPoruku(msg: string) {
    //console.log(msg);
    if (msg == 'Uspešno obrisana recenzija') this.success = msg;
    else this.error = msg;
    setTimeout(() => {
      this.success = '';
      this.error = '';
    }, 2000);
  }
}
