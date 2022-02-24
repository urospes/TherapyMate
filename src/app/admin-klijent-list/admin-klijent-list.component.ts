import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { Klijent } from '../shared/klijent.model';

@Component({
  selector: 'app-admin-klijent-list',
  templateUrl: './admin-klijent-list.component.html',
  styleUrls: ['./admin-klijent-list.component.css']
})
export class AdminKlijentListComponent implements OnInit {
  prazan : boolean=false;
  isLoading : boolean=false;
  klijenti : Klijent[]=[];
  odobreni : boolean[]=[];
  error='';
  success='';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
      this.isLoading=true;
      this.http.get<any>( `http://localhost:3000/klijenti`)
      .subscribe((data)=> {
        //console.log(data)
        data.forEach( (responseEl) => {
            this.klijenti.push( new Klijent(
              responseEl._id,
              responseEl.ime,
              responseEl.prezime,
              '',
              [],
              [],
              responseEl.email,
              '',
              responseEl.telefon,
              responseEl.slika
            ));
            this.odobreni.push(responseEl.odobren);
        });
        this.klijenti = this.klijenti.reverse();
      this.odobreni = this.odobreni.reverse();
          }, (err)=>{

          });
  this.isLoading=false;
  }
  onKorisnikDel(id : string){
    if(id.length==24)
    {
      let i=this.klijenti.findIndex(t=>t.getID()==id);
    this.klijenti.splice(i,1);
    this.odobreni.splice(i,1);
    this.success="Uspešno ste obrisali klijenta";
    setTimeout(()=>{
      this.success='';
    }, 2000)
    }
    else
    {
      this.error=id;
    }

    //window.location.reload();
  }
  onKorisnikOdobren(id : string){
    if(id.length==24)
  {
  this.success="Uspešno ste odobrili klijenta";
  setTimeout(()=>{
    this.success='';
  }, 2000)
  }
  else
  {
    this.error=id;
    setTimeout(()=>{
      this.error=''
    }, 2000);
  }
  }

  }
