import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipTerapijaService } from '../services/tipTerapija.service';
import { TipTerapija } from '../shared/tipTerapija.model';

@Component({
  selector: 'app-admin-edit-tipterapija',
  templateUrl: './admin-edit-tipterapija.component.html',
  styleUrls: ['./admin-edit-tipterapija.component.css']
})
export class AdminEditTipterapijaComponent implements OnInit {
  editTerapija: FormGroup;
  tipTerapije: TipTerapija=new TipTerapija(
    '',
    '',
    '',
    []
  );;
  nova: boolean=true;
  error : string='';
  success : string='';
  isLoading : boolean=false;
  private subscription : Subscription;
  constructor(
    private terapijaService: TipTerapijaService,
    private router: Router,
    private route: ActivatedRoute,
    private fb : FormBuilder,
    private htttp : HttpClient
  ) {
   
  }
  get f() { return this.editTerapija.controls; }
  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {

      this.isLoading=true;
      this.editTerapija = new FormGroup({
        naziv: new FormControl(),
        opis: new FormControl()
      });
      if (params['id'] !=undefined ) {
        this.nova=false;
        this.htttp.get<any>(`http://localhost:3000/tipoviTerapija/${params['id']}`)
      .subscribe((data)=> {
        this.tipTerapije=new TipTerapija(data._id, data.opis, data.naziv, data.terapije)
        
        this.editTerapija.setValue({
          naziv: this.tipTerapije.naziv,
          opis : this.tipTerapije.opis
        });
          }, (err)=>{
        console.log(err)
          });
      

      } else {
        this.nova=true;
      }
    });
    this.isLoading=false;
  }


  onSubmit() {
    if (this.nova)
    {
      this.tipTerapije = new TipTerapija(
        '-1',
        '',
        '',
        []
      );
    }
    this.tipTerapije.naziv = this.editTerapija.get('naziv').value;
    this.tipTerapije.opis = this.editTerapija.get('opis').value;
    if(this.tipTerapije.naziv!='' && this.tipTerapije.opis!='' )
    {
      this.error='';
    if (!this.nova) {
      this.htttp.put(`http://localhost:3000/tipoviTerapija/${this.tipTerapije.id}`, {
        naziv : this.tipTerapije.naziv,
        opis : this.tipTerapije.opis
      }, {responseType : 'text'}) .subscribe((data)=> {
        //console.log(data)
        if (data=="Uspenso"){
          this.success="Uspešno ste ažurirali tip terapije";
          setTimeout(() => {
            this.success = '';
            this.router.navigate(['/admin/terapije']);
          }, 2000);
        }
        else {
          this.error="Ovaj tip terapije već postoji u savetovalištu";
          setTimeout(() => {
            this.error = '';
          }, 2000);
        }

        }, (err)=>{
      this.error="Ovaj tip terapije već postoji u savetovalištu";
      setTimeout(() => {
        this.error = '';
      }, 2000);
        });
   
    }
     else 
    {
      this.htttp.post(`http://localhost:3000/tipoviterapija`, {
        naziv : this.tipTerapije.naziv,
        opis : this.tipTerapije.opis
      }, {responseType : 'text'}).subscribe((data)=> {
        if (data=="Uspesno"){
          this.success="Uspešno ste dodali tip terapije";
          setTimeout(() => {
            this.success = '';
            this.router.navigate(['/admin/terapije']);
          }, 2000);
        }

          }, (err)=>{
            this.error="Ovaj tip terapije već postoji u savetovalištu";
            setTimeout(() => {
              this.error = '';
            }, 2000);
          });
     
    }
    
  }
  else {
    this.error="Unos nije validan";
  }
  }

  onClickOtkazi() {
    this.router.navigate(['/admin/terapije']);
  }
}

