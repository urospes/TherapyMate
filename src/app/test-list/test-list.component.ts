import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TerapeutService } from '../services/terapeut.service';
import { TestService } from '../services/test.service';
import { Pitanje, PitanjeSaPonudjenimOdgovorima, TekstualnoPitanje } from '../shared/pitanje.model';
import { Test } from '../shared/test.model';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {
  testovi : Test[]=[];
  testoviKlijenta : Test[];
  subscription : Subscription;
  klijentID : string='';
  klijent : boolean=false;
  klijentDodaj : boolean=false;
  isLoading : boolean=false;
  dodavanje : boolean=false;
  prazan : boolean=false;
  new : boolean=false;
  error : string='';
  success : string='';
  constructor(private testService : TestService,
    private route : ActivatedRoute,
    private router : Router, 
    private terapeutService : TerapeutService) {
     
  }

  ngOnInit(): void {
    this.isLoading=true;

    this.route.paramMap.subscribe( (params : Params) => {
      if (!params.get('idK') && params.get('id')) 
      {
        //console.log('prvi')
        this.testovi=[];
        this.klijentID=params.get('id');
        this.terapeutService.fetchTestoviKlijenta(this.klijentID).subscribe((data)=>{
          this.isLoading=true;
          ///console.log(data)
        this.klijent=true;
        this.klijentDodaj=false;
        if (data.length==0)
         {       
        this.prazan=true;
        //console.log(this.prazan);
        this.isLoading=false;
         }
        else
        {

          this.prazan=false;
        data.forEach(test => {
          //console.log('prvi')
          let pitanja : Pitanje[]=[];
          test.forEach(element => {
            if(element.pitanje)
            if (element.pitanje.ponudjeniOdgovori.length!=0)
            {
              pitanja.push(new PitanjeSaPonudjenimOdgovorima(element.pitanje._id, element.pitanje.tekstPitanja, element.pitanje.ponudjeniOdgovori, element.sadrzajOdgovora));
            }
            else {
              pitanja.push(new TekstualnoPitanje(element.pitanje._id, element.pitanje.tekstPitanja,element.sadrzajOdgovora));
            }
          });
          if(pitanja.length!=0)
          
          this.testovi.push(new Test(test._id,pitanja ));
        });
      
        
      }
      this.isLoading=false;
      });
      }
      else 
        if (!params.get('id') && params.get('idK')){
          //console.log('drugi')
        this.klijentID=params.get('idK');
        this.klijent=false;
        this.klijentDodaj=true;
        this.terapeutService.fetchNeuradjeniTestoviKlijenta(this.klijentID).subscribe((data)=>{
          this.isLoading=true;
         // console.log(data)
          if (data.length==0)
          {
          this.prazan=true;
          this.new=true;
          }
          else {
            this.prazan=false;
          this.testovi=[];
          data.forEach(test => {
            let pitanja : Pitanje[]=[];
            test.pitanja.forEach(element => {
              
              if (element.ponudjeniOdgovori.length!=0)
              {
                pitanja.push(new PitanjeSaPonudjenimOdgovorima(element._id, element.tekstPitanja, element.ponudjeniOdgovori, ''));
              }
              else {
                pitanja.push(new TekstualnoPitanje(element._id, element.tekstPitanja));
              }
            });
            this.testovi.push(new Test(test._id,pitanja ));
          });
         // this.sort();
         
        }
        this.isLoading=false;
    });
  }
        else {
         ///console.log('treci')
          this.klijentID='';
          this.klijent=false;
          this.klijentDodaj=false;
        
        this.terapeutService.fetchTestovi().subscribe((data)=>{
          this.isLoading=true;
          ///console.log(data)
          if (data.length==0)
          this.prazan=true;
          else {
            this.prazan=false;
          this.testovi=[];
          data.forEach(test => {
            let pitanja : Pitanje[]=[];
            test.pitanja.forEach(element => {
              
              if (element.ponudjeniOdgovori.length!=0)
              {
                pitanja.push(new PitanjeSaPonudjenimOdgovorima(element._id, element.tekstPitanja, element.ponudjeniOdgovori, ''));
              }
              else {
                pitanja.push(new TekstualnoPitanje(element._id, element.tekstPitanja));
              }
            });
            this.testovi.push(new Test(test._id,pitanja ));
          });
          //this.sort();
          
        }  
        this.isLoading=false;
        });
      }

   });
  }


sort(){
  this.testovi.sort((a,b)=>{ if (a.pitanja.length<b.pitanja.length) return -1; else return 1; })
}
  onClickNov(){
    if (this.klijentID!='')
    {
      ///klijentu se dodaje novi test
      this.router.navigate([`/terapeut/klijenti/${this.klijentID}/testovi/new`]);
    }
      else {
        //kreira se novi test
    this.router.navigate(['new'], {relativeTo: this.route});
      }
  }
  onClickNazad(){
    this.router.navigate(['/terapeut/klijenti']);
  }
  obrisaniTest(id : string){
    if(id.length==24){
      let i=this.testovi.findIndex(t=>t.getID()==id);
     this.testovi.splice(i,1);
     if(this.testovi.length==0)
     this.prazan=true;
      this.success="Uspešno ste obrisali test";
    }
    else {
      this.error=id;
    }
    //window.location.reload();
  }
  dodatTest(msg : string){
    //console.log('da')
    if(msg.length==24)
    {
      this.success="Uspešno ste dodali test";
      let i=this.testovi.findIndex(t=>t.getID()==msg);
      this.testovi.splice(i,1);
      if (this.testovi.length==0)
        this.prazan=true;
      setTimeout(() => {
        this.success = '';
        this.router.navigate([`terapeut/klijenti/${this.klijentID}/testovi/new`]).then(() =>{
          if (this.prazan)
          window.location.reload();
        });
      }, 2000);
      
    }
     
    else 
      this.error="Dodavanje nije uspelo";
      setTimeout(() => {
        this.error = '';
      }, 5000);
    
  }
  onClickNovIzKlijenta(){
    this.router.navigate([`/terapeut/${this.klijentID}/testovi/new`]);
  }
  onClickNazadIzKlijenta() {
    this.router.navigate([`/terapeut/klijenti`]);
  }
  onClickNazadIzKlijentdodaj(){
    this.router.navigate([`/terapeut/klijenti/${this.klijentID}/testovi`]);
  }

  onClickKlijenti(){
    this.router.navigate([`/terapeut/klijenti`]);
  }
}
