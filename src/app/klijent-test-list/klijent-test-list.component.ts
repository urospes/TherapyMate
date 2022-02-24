import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { KlijentService } from '../services/klijent.service';
import {
  PitanjeSaPonudjenimOdgovorima,
  TekstualnoPitanje,
} from '../shared/pitanje.model';
import { Terapeut } from '../shared/terapeut.model';
import { Test } from '../shared/test.model';

@Component({
  selector: 'app-klijent-test-list',
  templateUrl: './klijent-test-list.component.html',
  styleUrls: ['./klijent-test-list.component.css'],
})
export class KlijentTestListComponent implements OnInit {
  isLoading: boolean = false;
  prazan: boolean = false;
  testovi: Test[] = [];
  terapeuti: Terapeut[] = [];
  success: string = '';
  error: string = '';

  constructor(
    private http: HttpClient,
    private klijentService: KlijentService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http
      .get<any>(
        `http://localhost:3000/testovi/neuradjeni/${this.klijentService.getKlijentID()}`
      )
      .subscribe((data) => {
        //console.log(data);
        if (data.length == 0) this.prazan = true;
        else this.prazan = false;
        data.forEach((element) => {
          this.testovi.push(new Test(element._id, []));
          this.terapeuti.push(element.terapeut);
          element.pitanja.forEach((pitanje) => {
            if (pitanje.ponudjeniOdgovori.length == 0)
              this.testovi[this.testovi.length - 1].pitanja.push(
                new TekstualnoPitanje(pitanje._id, pitanje.tekstPitanja, '')
              );
            else
              this.testovi[this.testovi.length - 1].pitanja.push(
                new PitanjeSaPonudjenimOdgovorima(
                  pitanje._id,
                  pitanje.tekstPitanja,
                  pitanje.ponudjeniOdgovori,
                  ''
                )
              );
          });
        });
        this.isLoading = false;
      });
  }
  uradjeniTest(id: string) {
    if (id.length == 24) {
      let i = this.testovi.findIndex((t) => t.getID() === id);
      this.testovi.splice(i, 1);
      if (this.testovi.length == 0) this.prazan = true;
      this.success = 'Uspešno ste odradili test!';
      setTimeout(() => {
        this.success = '';
      }, 2000);
    } else {
      this.error = 'Došlo je do greške!';
      setTimeout(() => {
        this.error = '';
      }, 2000);
    }
  }
}
