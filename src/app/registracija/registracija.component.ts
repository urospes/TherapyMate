import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KlijentService } from '../services/klijent.service';
import { TerapeutService } from '../services/terapeut.service';
import { Klijent } from '../shared/klijent.model';
import { mimeType } from '../shared/mime-type-validator';
import { Terapeut } from '../shared/terapeut.model';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css'],
})
export class RegistracijaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  success: string = '';
  error: string = '';
  tipKorisnika: string='klijent';
  imagePreview: string='./../../assets/resources/new.png';
  hide=true;
  constructor(
    private klijentServis: KlijentService,
    private terapeutServis: TerapeutService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      telefon: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      slika: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      tipKorisnika: new FormControl('klijent'),
      specijalizacija: new FormControl(''),
      opis: new FormControl(''),
    });
  }
  onSubmit(){
    
    let klijent;
    if (this.tipKorisnika=='klijent') {
      //klijent
      klijent = new Klijent(
        '',
        this.form.get('firstName').value,
        this.form.get('lastName').value,
        '',
        [],
        [],
        this.form.get('email').value,
        this.form.get('password').value,
        this.form.get('telefon').value,
        ''
      );
      console.log(klijent)
      this.klijentServis.addKlijent(klijent, this.form.value.slika).subscribe(
        (data) => {
          console.log(data)
          if (data == 'Poslat na odobravanje') {
            this.success =
              'Vaš nalog je poslat na odobravanje. Pokušajte da se prijavite kasnije.';
            setTimeout(() => {
              this.success = '';
            }, 2000);
          }
        },
        (err) => {
          this.error = 'Postoji nalog sa ovim emailom.';
          setTimeout(() => {
            this.error = '';
          }, 2000);
        }
      );
    } else {
      klijent = new Terapeut(
        '',
        this.form.get('firstName').value,
        this.form.get('lastName').value,
        0,
       '',
        [],
        [],
        [],
        this.form.get('email').value,
        this.form.get('password').value,
        this.form.get('telefon').value,
        this.form.get('specijalizacija').value,
        this.form.get('opis').value,
      );

      this.terapeutServis.addTerapeut(klijent, this.form.value.slika).subscribe(
        (data) => {
          //console.log(data)
          if (data == 'Poslat na odobravanje') {
            this.success =
              'Vaš nalog je poslat na odobravanje. Pokušajte da se prijavite kasnije.';
            setTimeout(() => {
              this.success = '';
            }, 2000);
          }
        },
        (err) => {
          this.error = 'Postoji nalog sa ovim emailom.';
          setTimeout(() => {
            this.error = '';
          }, 2000);
        }
      );
    }
  }
  promeni(event) {
    //console.log('event')
    this.tipKorisnika=event.value;
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //console.log(file)
    this.form.patchValue({ slika: file });
    this.form.get("slika").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    //console.log(file)
  }

}