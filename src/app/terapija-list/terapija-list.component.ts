import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, GuardsCheckStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';
import { TerapeutService } from '../services/terapeut.service';
import { TipTerapijaService } from '../services/tipTerapija.service';
import { Terapija } from '../shared/terapija.model';

@Component({
  selector: 'app-terapija-list',
  templateUrl: './terapija-list.component.html',
  styleUrls: ['./terapija-list.component.css']
 
})
export class TerapijaListComponent implements OnInit {
  terapije : Terapija[]=[];
  prazan : boolean=true;
  error : string='';
  success : string='';
  subscription : Subscription;
  neulogovan : boolean= true;
  isLoading : boolean=false;
  constructor(private terapijaService : TipTerapijaService,
    private route : ActivatedRoute,
    private router : Router,
    private http : HttpClient,
    private terapeutService : TerapeutService
    ) {

    if (this.terapeutService.getTerapeutID())
    this.neulogovan=false;
   }

  ngOnInit(): void {
 this.isLoading=true;
    // this.http.patch(`http://localhost:3000/termini/zakazivanje`, {
    //   idKlijenta :'60c67188c57f791300437178',
    //   idTermina : '60d267ea514a7134dcaadaad',
    //   idTerapije :  '60d239d3863da83aecbe594c'
    //   }).subscribe(
    //     (data) => {},
    //     (err) => {
          
    //     }
    //   )
    this.terapeutService.fetchTerapijeByTeraputID().subscribe((data) => {
      //console.log(data.terapije)
      data.terapije.forEach((element, i) => {
        this.terapije[i] = new Terapija(
          element._id,
          element.terapeut,
          element.tip.naziv,
          element.detalji,
          element.cena
        );
      });
      if (this.terapije.length>0)
      this.prazan=false;
      else
      this.prazan=true;
      //console.log(this.terapije)
      this.isLoading=false;
    });
      
  }
  greska(err : string){
    this.error=err;
  }

  onClickNova(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }
  obrisanaterapija(res : {id :string, mess :string}){
    let i;
    //console.log(res.mess)
   if (res.mess=="Terapija je uspesno obrisana")
   {
   i=this.terapije.findIndex((t)=>t.id==res.id);
  // console.log(i)
   this.terapije.splice(i,1);
   this.success='Terapija je uspešno obrisana';
   window.scroll(0,0);
   setTimeout(() => {
    this.success = '';
  }, 5000);
  if (this.terapije.length==0)
  this.prazan=true;
   }
  else {
    this.error=res.mess; 
    setTimeout(() => {
      this.error = '';
    }, 2000);
  }
}
}