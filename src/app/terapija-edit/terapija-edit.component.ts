
import { Component, OnInit, Input, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map, mapTo, take } from 'rxjs/operators';
import { TerapeutService } from '../services/terapeut.service';
import { TestService } from '../services/test.service';
import { TipTerapijaService } from '../services/tipTerapija.service';
import { Terapija } from '../shared/terapija.model';
import { TipTerapija } from '../shared/tipTerapija.model';

@Component({
  selector: 'app-terapija-edit',
  templateUrl: './terapija-edit.component.html',
  styleUrls: ['./terapija-edit.component.css'],
})
export class TerapijaEditComponent implements OnInit {
  editTerapija: FormGroup;
  terapija: Terapija= new Terapija('','','','',1000);
  tipTerapija: TipTerapija[]=[];
  terapeutTerapije : string[]=[];
  nova: boolean=true;
  error : string='';
  success : string ='';
  isLoading : boolean=false;
  invalid : boolean=false;
  private subscription : Subscription;
  constructor(
    private TerapeutService: TerapeutService,
    private terapijaService: TipTerapijaService,
    private router: Router,
    private route: ActivatedRoute,
    private fb : FormBuilder
  ) {

  }
  get f() { return this.editTerapija.controls; }
  ngOnInit(): void {


    this.route.params.subscribe((params: Params) => {
      this.isLoading=true;
      this.editTerapija = new FormGroup({
        tip: new FormControl('',Validators.required),
        detalji: new FormControl('',[Validators.required, Validators.minLength(150)]),
        cena: new FormControl('',Validators.required),
      });
      if (params['id'] !=undefined ) {
        this.nova=false;
        this.TerapeutService.fetchTerapijeByTeraput().subscribe((data)=> {
          let i= data.terapije.findIndex(t=> t._id==params['id']);
          this.terapija=new Terapija(data.terapije[i]._id, data.terapije[i].terapeut, data.terapije[i].tip.naziv, data.terapije[i].detalji, data.terapije[i].cena)
           this.editTerapija.setValue({
             detalji: this.terapija.detalji,
             cena: this.terapija.cena,
             tip : this.terapija.tip
           });
           this.isLoading=false;
        });

      } else {
        this.nova=true;
        this.terapijaService.fetchTipTerapija().subscribe((data)=> {
          //console.log(data)
          data.forEach((element,i) => {
            this.tipTerapija.push(new TipTerapija(element._id, element.opis, element.naziv, []));
          });
        })
          this.TerapeutService.fetchTerapijeByTeraput().subscribe((data)=> {

            data.terapije.forEach((element,i) => {
              this.terapeutTerapije.push(element.tip.naziv);
            });
            
            for(let i=0; i<this.terapeutTerapije.length; i++)
            {
              let j=this.tipTerapija.findIndex(t=> t.naziv==this.terapeutTerapije[i]);
              this.tipTerapija.splice(j, 1);
            }
    
            if (this.tipTerapija.length!=0 ){
              this.error=""
            }
            else {
              this.error='Već držite sve ponuđene tipove terapije. Za dodavanje novih obratite se administratoru.';
              this.invalid=true;
              setTimeout(()=>{
                this.error='';
              }, 2000)
            }
            this.isLoading=false;
          });
            
     

            // console.log(this.tipTerapija.length)
            // console.log(this.terapeutTerapije.length)
     
      }
    });

  }


  onSubmit() {
    if (this.nova)
    {
      this.terapija = new Terapija(
        '-1',
        this.TerapeutService.getTerapeutID() /*ID TERAPEUTA*/,
        '',
        '',
        0
      );
    }
    this.terapija.tip = this.editTerapija.get('tip').value;
    this.terapija.detalji = this.editTerapija.get('detalji').value;
    this.terapija.cena = this.editTerapija.get('cena').value;
    if(this.terapija.tip!='' && this.terapija.detalji!='' && this.terapija.cena>0)
    {
      this.error='';
    if (this.terapija.id != '-1') {
      let i=this.terapijaService.updateTerapija(this.terapija.id, this.terapija.detalji, this.terapija.cena ).subscribe(
        (data)=>{
         // console.log(data)
          this.success=data.toString();
          setTimeout(() => {
            this.success = '';
            this.router.navigate(['/terapeut/terapije']);
          }, 2000);
        }, (err)=>{
          this.error=err.error;
          setTimeout(() => {
            this.error = '';
          }, 2000);
        }
      )

    } else
    {
     this.TerapeutService.dodajTerapiju(this.terapija.detalji, this.terapija.tip, this.terapija.cena)
      .subscribe((data)=> {
       if (data && data.length!=24)
       {
        //console.log(data)
         this.error=data;
       }
       else {
        // console.log(data)
         this.success="Uspešno ste dodali terapiju";
         this.TerapeutService.dodajUServis(new Terapija(data, this.TerapeutService.getTerapeutID(),this.terapija.tip, this.terapija.detalji, this.terapija.cena))
         setTimeout(() => {
          this.success = '';
          this.router.navigate(['/terapeut/terapije']);
        }, 2000)
      }
    }
      , (err)=>{
        this.error=err.error;
        setTimeout(() => {
          this.error = '';
        }, 2000);
      }
        );
        }
  }
  else {
    this.error="Unos nije validan";
  }
}


  onClickOtkazi() {
    this.router.navigate(['/terapeut/terapije']).then(() => {
      //window.location.reload();
    });
  }
}
