import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KlijentService } from '../services/klijent.service';

@Component({
  selector: 'app-recenziranje',
  templateUrl: './recenziranje.component.html',
  styleUrls: ['./recenziranje.component.css'],
})
export class RecenziranjeComponent implements OnInit {
  @Input() terapeutId: string;
  form: FormGroup;
  porukaOcenjivanje: string = null;
  porukaPotvrda: string = null;
  constructor(private klijentService: KlijentService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      ocena: new FormControl('', [
        Validators.required,
        Validators.max(5),
        Validators.min(1),
      ]),
      komentarField: new FormControl('', [Validators.required]),
    });
  }
  get f() {
    return this.form.controls;
  }

  onOcenaSubmit() {
    if (this.form.invalid) {
      this.showMessage('Niste uneli validne informacije.');
      return;
    }
    const ocena: number = this.form.value.ocena;
    const komentar: string = this.form.value.komentarField;
    this.klijentService
      .oceniTerapeuta(this.terapeutId, ocena, komentar)
      .subscribe(
        (resText) => {
          this.porukaPotvrda = 'Uspesno ste ocenili terapeuta!';
          setTimeout(() => {
            this.porukaPotvrda = null;
          }, 2500);
        },
        (error) => {
          this.showMessage(error);
        }
      );
  }

  showMessage(poruka: string) {
    this.porukaOcenjivanje = poruka;
    setTimeout(() => {
      this.porukaOcenjivanje = null;
    }, 2000);
  }
}
