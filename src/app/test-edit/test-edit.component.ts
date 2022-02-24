import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PitanjeService } from '../services/pitanje.service';
import { TerapeutService } from '../services/terapeut.service';
import { TestService } from '../services/test.service';
import { Pitanje, PitanjeSaPonudjenimOdgovorima } from '../shared/pitanje.model';
import { Test } from '../shared/test.model';

@Component({
  selector: 'app-test-edit',
  templateUrl: './test-edit.component.html',
  styleUrls: ['./test-edit.component.css'],
})
export class TestEditComponent implements OnInit {
  test: Test = new Test('', []);
  pitanja : Pitanje[]=[];
  success: string='';
  error: string='';
  id : string='';
  constructor(
    private terapeutService: TerapeutService,
    private PitanjeService: PitanjeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.test=new Test('', [])
    this.route.paramMap.subscribe((params: Params) => {
      if (params.get('id')) 
      {
        this.id=params.get('id');
      }
     } );

  }

eventHandler(event : Pitanje[]){
this.test.pitanja=event;
//console.log(this.test.pitanja)
}
  onClickSacuvaj() {
    //kreiraj test
    //dodaj mu pitanja
    this.terapeutService.addTest().subscribe((data)=>{
      //console.log("id testa je"+data);
       this.test.setID(data);
       this.terapeutService.addPitanja(this.test.getID(), this.test.pitanja).subscribe((data)=>{
         //console.log(data)
         {
           this.success="Uspešno ste dodali test.";
           setTimeout(() => {
            this.success = '';
          }, 20000);
          if (this.id=='')
             this.router.navigate(['/terapeut/testovi']).then(() => {
               window.location.reload();
          });
          else {
            this.router.navigate([`/terapeut/klijenti/${this.id}/testovi/new`]).then(() => {
              window.location.reload();
          }); }
       }}, err =>{
         //console.log(err)
        this.error=err.error;
        ;
        setTimeout(() => {
         this.error = '';
       }, 2000);
      
       
     })
  
  });
}
  onClickOtkazi() {
    
    //this.PitanjeService.vratiArhiviranaPitanja();
    if (this.id=='')
    this.router.navigate(['/terapeut/testovi']).then(() => {
      window.location.reload();
  });
  else {
    this.router.navigate([`/terapeut/klijenti/${this.id}/testovi/new`]).then(() => {
      window.location.reload();
  });
}
}
  onClickDodajTekst() {
    //this.router.navigate(['/terapeut/testovi/pitanje/new/tekstualno']);
    
  }
  onClickDodajPonudjeni() {
    //this.router.navigate(['/terapeut/testovi/pitanje/new/ponudjeni']);

  }

}
