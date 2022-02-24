
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { KlijentService } from '../services/klijent.service';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';
import { SavetovalisteService } from '../services/savetovaliste.service';
import { TerapeutService } from '../services/terapeut.service';
import { Klijent } from '../shared/klijent.model';
import { Terapeut } from '../shared/terapeut.model';
import {Location} from '@angular/common';
import { mimeType } from '../shared/mime-type-validator';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css'],
})
export class EditProfilComponent implements OnInit {
  @Input() klijent: Klijent; //profil ulogovanog klijenta, postavljamo referencu na trenutno ulogovanog
  //klijenta u ngOnInit()
  form: FormGroup;
  ime : string='';
  prezime : string='';
  lozinkaProvera : string='';
  lozinka : string='';
  novalozinka : string='';
  telefon : string='';
  slika : string='';
  specijalizacija : string='';
  opis : string='';
  greska : string='';
  email: string='';
  id:string='';
  imagePreview: string='';
  error : string='';
  success : string='';

  klijentUlogovan=false;
  terapeutUlogovan=false;
  isLoading=false;

  constructor(
    private klijentService: KlijentService,
    private savetovalisteService: SavetovalisteService,
    private korisnikLogovanjeService : KorisnikLogovanjeService,
    private terapeutService : TerapeutService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.isLoading=true;
    this.form = new FormGroup({
      ime : new FormControl('', Validators.required),
      prezime: new FormControl('', Validators.required),
      telefon: new FormControl('', Validators.required),
      lozinka: new FormControl('',  Validators.minLength(6)),
      novalozinka: new FormControl('', Validators.minLength(6)),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      specijalizacija :  new FormControl(''),
      opis :  new FormControl('')
  });
    //this.klijent = this.klijentService.getKlijent(); //instanciramo profil klijenta
    this.korisnikLogovanjeService.loggedKorisnik
      .pipe (
        take(1)
        ).subscribe(

      (korisnik) => {
        this.isLoading=true;
        if (korisnik) {
          if (korisnik.tip === 'klijent') {
            this.klijentUlogovan = true;
            this.terapeutUlogovan = false;
      
            this.klijentService.fetchKlijent().subscribe(
              (data)=>{
                this.slika=data.slika;
                this.imagePreview=data.slika;
                this.lozinka=data.lozinka;
                this.email=data.email;
                this.form.patchValue({
                  ime: data.ime,
                  prezime:data.prezime,
                  telefon:data.telefon,
                  specijalizacija:'',
                  opis:'',
                  lozinka:'',
                  novalozinka:'',
                });
              });
            }
            
           else {
            this.klijentUlogovan = false;
            this.terapeutUlogovan = true;
            this.terapeutService.fetchTerapeut().subscribe( (data)=> {
              this.imagePreview=data.slika; 
              this.slika=data.slika;
              this.email=data.email;
              this.lozinka=data.lozinka;
              this.id=data.id;
              this.form.patchValue({
                ime: data.ime,
                prezime:data.prezime,
                telefon:data.telefon,
                specijalizacija:data.specijalizacija,
                opis:data.opis,
                lozinka:'',
                novalozinka:'',
              });
            })
          }
        }
         else {
          this.klijentUlogovan = false;
          this.terapeutUlogovan = false;
        }
        this.isLoading=false;
      }
      );

    
  }

  getTerapeutFullName(idTerapeuta: string) {
    const temp: Terapeut =
      this.savetovalisteService.getTerapeutById(idTerapeuta);
    return temp.getIme() + ' ' + temp.getPrezime();
  }

  onSubmit(){
    if((this.form.get('lozinka').value!='' && this.form.get('novalozinka').value=='')|| (this.form.get('lozinka').value=='' && this.form.get('novalozinka').value!='')  )
    this.greska="Unesite obe lozinke";
    else 
    {
      if(this.terapeutUlogovan){
        //console.log(this.form.value.lozinka,this.form.value.novalozinka )
        this.terapeutService.updateTerapeutInfo(new Terapeut('',
        this.form.get('ime').value,
          this.form.get('prezime').value,
        0,
        this.slika,
        [],
        [],
        [],
        this.email,
        this.form.get('lozinka').value,
        this.form.get('telefon').value,
        this.form.get('specijalizacija').value,
        this.form.get('opis').value,
        ), this.form.get('novalozinka').value, this.form.value.image).subscribe(
          (data) => {
           // console.log(data)
            this.success=data.toString();
            window.scroll(0,0);
            setTimeout(()=>{
              this.success='';
              this.router.navigate(['/terapeut/licniprofil']).then(() => {
                window.location.reload();
            });
            }, 2000);
                  
          },
          (err) => {
            console.log(err)
            this.error=err.error;
            setTimeout(()=>{
            this.error='';
            }, 2000);
                  
          }
          );
      }
      
    else {
     
        this.klijentService. updateKlijentinfo(new Klijent('',
        this.form.get('ime').value,
          this.form.get('prezime').value,
        '',
        [],
        [],
        this.email,
        this.form.get('lozinka').value,
        this.form.get('telefon').value,
        this.slika,
        ), this.form.get('novalozinka').value, this.form.value.image).subscribe(
          (data) => {
            window.scroll(0,0);
            this.success=data.toString();
            setTimeout(()=>{
              this.success='';
              this.router.navigate([`/klijent/${this.id}/profil`]).then(() => {
                window.location.reload();
            });
            }, 2000);
                  
          },
          (err) => {
            this.error=err.error;
            setTimeout(()=>{
            this.error='';
            }, 2000);
                  
          }
          );
      }

  }
    
  }

  otkazi(){
    if (this.terapeutUlogovan)
    this.router.navigate(['/terapeut/licniprofil']);
    else
    this.router.navigate(['/klijent/'+this.id+'/profil']);
}
fileChange(event) {
  
}
onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
  console.log(file)
  this.form.patchValue({ image: file });
  this.form.get("image").updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
 
}

}
