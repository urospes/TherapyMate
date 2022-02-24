import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Terapeut } from '../shared/terapeut.model';

@Component({
  selector: 'app-admin-terapeut-list',
  templateUrl: './admin-terapeut-list.component.html',
  styleUrls: ['./admin-terapeut-list.component.css']
})
export class AdminTerapeutListComponent implements OnInit {
prazan : boolean=false;
isLoading : boolean=false;
terapeuti : Terapeut[]=[];
odobreni : boolean[]=[];
success : string='';
error : string='';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.http.get<any>( `http://localhost:3000/terapeuti`)
    .subscribe((data)=> {
      data.forEach( (responseEl) => {
          this.terapeuti.push( new Terapeut(
            responseEl._id,
            responseEl.ime,
            responseEl.prezime,
            responseEl.ocena,
            responseEl.slika,
            [],
            [],
            [],
            responseEl.email,
            '',
            responseEl.telefon,
            responseEl.specijalizacija,
            responseEl.opis
          ));
          this.odobreni.push(responseEl.odobren);
      });
      this.terapeuti = this.terapeuti.reverse();
      this.odobreni = this.odobreni.reverse();
        }, (err)=>{
          console.log(err)
        });
this.isLoading=false;
}
onKorisnikDel(id : string){
  if(id.length==24)
  {
    let i=this.terapeuti.findIndex(t=>t.getId()==id);
  this.terapeuti.splice(i,1);
  this.odobreni.splice(i,1);
  this.success="Uspešno ste obrisali terapeuta";
  setTimeout(()=>{
    this.success='';
  }, 2000)
  }
  else
  {
    this.error=id;
    setTimeout(()=>{
      this.error=''
    }, 2000)
  }
}
onKorisnikOdobren(id : string){
  if(id.length==24)
{
this.success="Uspešno ste odobrili terapeuta";
setTimeout(()=>{
  this.success=''
}, 2000)
}
else
{
  this.error=id;
  setTimeout(()=>{
    this.error=''
  }, 2000)
}
}
  }


