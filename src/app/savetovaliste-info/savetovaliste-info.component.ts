import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-savetovaliste-info',
  templateUrl: './savetovaliste-info.component.html',
  styleUrls: ['./savetovaliste-info.component.css']
})
export class SavetovalisteInfoComponent implements OnInit {
  form: FormGroup;
  ime : string='';
  adresa : string='';
  telefon : string='';
  opis : string='';
  email: string='';
  id:string='';
  greska : string='';
  success : string='';

  klijentUlogovan=false;
  terapeutUlogovan=false;
  isLoading=false;
  constructor(private router : Router,
    private http : HttpClient) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.form = new FormGroup({
      'ime': new FormControl('', Validators.required),
      'adresa': new FormControl('', Validators.required),
      'telefon': new FormControl('', Validators.required),
      'opis' :  new FormControl('',  Validators.required),
      'email' :  new FormControl('', Validators.required)
  });
    this.http.get<any>(`http://localhost:3000/savetovaliste`)
    .subscribe((data)=> {
      console.log(data)
      this.ime=data.ime;
      this.adresa=data.adresa;
      this.telefon=data.telefon;
      this.opis=data.opis;
      this.email=data.email;
      this.form.setValue({
        ime : this.ime,
        adresa : this.adresa,
        telefon : this.telefon,
        opis : this.opis,
        email : this.email
      });
        }, (err)=>{
      console.log(err)
        });


  this.isLoading=false;
}
  onSubmit(){
    this.http.put(`http://localhost:3000/savetovaliste`,{
      ime : this.form.get('ime').value,
      adresa :this.form.get('adresa').value,
      telefon : this.form.get('telefon').value,
      email : this.form.get('email').value,
      opis : this.form.get('opis').value
    }, {responseType : 'text'})
    .subscribe((data)=> {
      this.success="Podaci o savetovalištu su uspešno ažurirani."
      window.scrollBy(0,0);
      setTimeout(()=>{
        this.success='';
        this.router.navigate(['/admin']);
      }, 2000)
        }, (err)=>{
      this.greska="Došlo je do greške, molimo Vas pokušajte kasnije."
      setTimeout(()=>{
        this.greska='';
      }, 2000)
        });

  }

   otkazi(){
      this.router.navigate(['/admin']);
  }

}
