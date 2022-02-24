import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';

@Component({
  selector: 'app-prijavljivanje',
  templateUrl: './prijavljivanje.component.html',
  styleUrls: ['./prijavljivanje.component.css'],
})
export class PrijavljivanjeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMessage: string = null;
  loginSubscription: Subscription;
  hide = true;

  constructor(
    private router: Router,
    private korisnikLogovanjeService: KorisnikLogovanjeService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      lozinka: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted=true;
    this.loginSubscription = this.korisnikLogovanjeService
      .ulogujKorisnika(
        this.form.get('email').value,
        this.form.get('lozinka').value
      )
      .subscribe(
        (responseData) => {
          this.errorMessage = null;
          this.router.navigate(['/home']);
        },
        (err) => {
          this.errorMessage = err;
        }
      );
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.submitted=false;
  }
}
